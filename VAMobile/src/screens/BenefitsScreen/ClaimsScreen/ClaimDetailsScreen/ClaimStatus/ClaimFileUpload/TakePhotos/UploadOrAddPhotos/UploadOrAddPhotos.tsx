import { Asset, ImagePickerResponse } from 'react-native-image-picker/src/types'
import { Dimensions, ScrollView } from 'react-native'
import { StackActions } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement, useEffect, useRef, useState } from 'react'
import _ from 'underscore'

import { AlertBox, Box, ButtonTypesConstants, FieldType, FormFieldType, FormWrapper, LoadingComponent, PhotoAdd, PhotoPreview, TextView, VAButton } from 'components'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { ClaimEventData } from 'store/api'
import { ClaimsAndAppealsState, fileUploadSuccess, uploadFileToClaim } from 'store/slices'
import { DocumentTypes526 } from 'constants/documentTypes'
import { Events } from 'constants/analytics'
import { MAX_NUM_PHOTOS } from 'constants/claims'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { SnackbarMessages } from 'components/SnackBar'
import { bytesToFinalSizeDisplay, bytesToFinalSizeDisplayA11y } from 'utils/common'
import { deletePhoto, onAddPhotos } from 'utils/claims'
import { logAnalyticsEvent } from 'utils/analytics'
import { showSnackBar } from 'utils/common'
import { useBeforeNavBackListener, useDestructiveActionSheet, useOrientation, useShowActionSheet, useTheme } from 'utils/hooks'
import FullScreenSubtask from 'components/Templates/FullScreenSubtask'

type UploadOrAddPhotosProps = StackScreenProps<BenefitsStackParamList, 'UploadOrAddPhotos'>

const UploadOrAddPhotos: FC<UploadOrAddPhotosProps> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { claim, filesUploadedSuccess, fileUploadedFailure, loadingFileUpload } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const showActionSheetWithOptions = useShowActionSheet()
  const { request: originalRequest, firstImageResponse } = route.params
  const dispatch = useDispatch()
  const isPortrait = useOrientation()
  const [imagesList, setImagesList] = useState(firstImageResponse.assets)
  const [errorMessage, setErrorMessage] = useState('')
  const [totalBytesUsed, setTotalBytesUsed] = useState(firstImageResponse.assets?.reduce((total, asset) => (total += asset.fileSize || 0), 0))
  const confirmAlert = useDestructiveActionSheet()
  const [request, setRequest] = useState<ClaimEventData>(originalRequest)
  const scrollViewRef = useRef<ScrollView>(null)
  const snackbarMessages: SnackbarMessages = {
    successMsg: t('fileUpload.submitted'),
    errorMsg: t('fileUpload.submitted.error'),
  }

  useBeforeNavBackListener(navigation, (e) => {
    if (imagesList?.length === 0 || filesUploadedSuccess) {
      return
    }
    e.preventDefault()
    confirmAlert({
      title: t('fileUpload.discard.confirm.title.photos'),
      message: t('fileUpload.discard.confirm.message.photos'),
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: [
        {
          text: t('fileUpload.continueUpload'),
        },

        {
          text: t('fileUpload.cancelUpload'),
          onPress: () => {
            navigation.dispatch(e.data.action)
          },
        },
      ],
    })
  })

  useEffect(() => {
    if (fileUploadedFailure || filesUploadedSuccess) {
      dispatch(fileUploadSuccess())
    }

    if (filesUploadedSuccess) {
      setImagesList([])
      navigation.navigate('FileRequest', { claimID: claim?.id || '' })
    }
  }, [filesUploadedSuccess, fileUploadedFailure, dispatch, t, claim, navigation, request, imagesList])

  const [documentType, setDocumentType] = useState('')
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    setRequest((prevRequest) => {
      return {
        ...prevRequest,
        documentType,
      }
    })
  }, [documentType])

  if (loadingFileUpload) {
    return (
      <FullScreenSubtask
        leftButtonText={t('cancel')}
        onLeftButtonPress={() => {
          navigation.dispatch(StackActions.pop(2))
        }}>
        <LoadingComponent text={t('fileUpload.loading')} />
      </FullScreenSubtask>
    )
  }

  const onUploadConfirmed = () => {
    logAnalyticsEvent(Events.vama_evidence_cont_3(claim?.id || '', request.trackedItemId || null, request.type, 'photo'))
    dispatch(uploadFileToClaim(claim?.id || '', snackbarMessages, request, imagesList || [], 'photo'))
  }

  const onUpload = (): void => {
    const totalSize = imagesList?.reduce((sum, image) => sum + (image.fileSize || 0), 0)
    logAnalyticsEvent(Events.vama_evidence_cont_2(claim?.id || '', request.trackedItemId || null, request.type, 'photo', totalSize || 0, imagesList?.length || 0))

    confirmAlert({
      title: t('fileUpload.submit.confirm.title'),
      message: t('fileUpload.submit.confirm.message'),
      cancelButtonIndex: 0,
      buttons: [
        {
          text: t('cancel'),
        },
        {
          text: t('fileUpload.submit'),
          onPress: onUploadConfirmed,
        },
      ],
    })
  }

  const onDocumentTypeChange = (selectedType: string) => {
    const typeLabel = DocumentTypes526.filter((type) => type.value === selectedType)[0]?.label || selectedType
    logAnalyticsEvent(Events.vama_evidence_type(claim?.id || '', request.trackedItemId || null, request.type, 'photo', typeLabel))
    setDocumentType(selectedType)
  }

  const onCheckboxChange = (isChecked: boolean) => {
    if (isChecked) {
      logAnalyticsEvent(Events.vama_evidence_conf(claim?.id || '', request.trackedItemId || null, request.type, 'photo'))
    }
    setConfirmed(isChecked)
  }

  const pickerField: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        selectedValue: documentType,
        onSelectionChange: onDocumentTypeChange,
        pickerOptions: DocumentTypes526,
        labelKey: 'fileUpload.documentType',
        isRequiredField: true,
        disabled: false,
      },
      fieldErrorMessage: t('fileUpload.documentType.fieldError'),
    },
    {
      fieldType: FieldType.Selector,
      fieldProps: {
        labelKey: 'fileUpload.evidenceOnlyPhoto',
        selected: confirmed,
        onSelectionChange: onCheckboxChange,
        isRequiredField: true,
      },
      fieldErrorMessage: t('fileUpload.evidenceOnly.error'),
    },
  ]

  const displayImages = (): ReactElement => {
    const { condensedMarginBetween, gutter } = theme.dimensions
    /** Need to subtract gutter margins and margins between pics before dividing screen width by 3 to get the width of each image*/
    const calculatedWidth = ((isPortrait ? Dimensions.get('window').width : Dimensions.get('window').height) - 2 * gutter - 2 * condensedMarginBetween) / 3

    const uploadedImages = (): ReactElement[] => {
      return _.map(imagesList || [], (asset, index) => {
        return (
          /** Rightmost photo doesn't need right margin b/c of gutter margins
           * Every 3rd photo, right margin is changed to zero*/

          <Box mt={condensedMarginBetween} mr={condensedMarginBetween} key={index}>
            <PhotoPreview
              width={calculatedWidth}
              height={calculatedWidth}
              image={asset}
              onDeleteCallback={(): void => {
                deletePhoto(deleteCallbackIfUri, index, imagesList || [])
              }}
              photoPosition={t(imagesList && imagesList?.length > 1 ? 'fileUpload.ofTotalPhotos' : 'fileUpload.ofTotalPhoto', {
                photoNum: index + 1,
                totalPhotos: imagesList?.length,
              })}
            />
          </Box>
        )
      })
    }

    return (
      <Box display="flex" flexDirection="row" flexWrap="wrap" pl={gutter} pr={condensedMarginBetween}>
        {uploadedImages()}
        {(!imagesList || imagesList.length < MAX_NUM_PHOTOS) && (
          <Box mt={condensedMarginBetween}>
            <PhotoAdd
              width={calculatedWidth}
              height={calculatedWidth}
              onPress={(): void => {
                onAddPhotos(t, showActionSheetWithOptions, setErrorMessage, callbackIfUri, totalBytesUsed || 0, claim?.id || '', request)
              }}
            />
          </Box>
        )}
      </Box>
    )
  }

  const callbackIfUri = (response: ImagePickerResponse): void => {
    if (!snackBar) {
      logAnalyticsEvent(Events.vama_snackbar_null('Claim add photos'))
    }
    snackBar?.hideAll()
    if (response && response.assets && response.assets.length + (imagesList?.length || 0) > MAX_NUM_PHOTOS) {
      setErrorMessage(t('fileUpload.tooManyPhotosError'))
    } else {
      const imagesCopy = imagesList
      response.assets?.forEach((asset) => {
        imagesCopy?.push(asset)
      })
      setImagesList(imagesCopy)
      let fileSizeAdded = 0
      response.assets?.forEach((asset) => {
        if (asset.fileSize) {
          fileSizeAdded = fileSizeAdded + asset.fileSize
        }
      })
      if (fileSizeAdded && totalBytesUsed) {
        setTotalBytesUsed(totalBytesUsed + fileSizeAdded)
      }
    }
  }

  const deleteCallbackIfUri = (response: Asset[]): void => {
    if (response.length === 0) {
      setImagesList([])
      showSnackBar(t('photoRemoved'), dispatch, undefined, true, false, false)
      navigation.navigate('TakePhotos', { claimID: claim?.id || '', request, focusOnSnackbar: true })
    } else {
      setErrorMessage('')
      setImagesList(response)
      let bytesUsed = 0
      response.forEach((image) => {
        if (image.fileSize) {
          bytesUsed = bytesUsed + image.fileSize
        }
      })
      setTotalBytesUsed(bytesUsed)
      showSnackBar(t('photoRemoved'), dispatch, undefined, true, false, false)
    }
  }

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      leftButtonText={t('cancel')}
      title={t('fileUpload.uploadPhotos')}
      onLeftButtonPress={() => {
        logAnalyticsEvent(Events.vama_evidence_cancel_2(claim?.id || '', request.trackedItemId || null, request.type, 'photo'))
        navigation.dispatch(StackActions.pop(2))
      }}>
      <Box mb={theme.dimensions.contentMarginBottom}>
        {!!errorMessage && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertBox scrollViewRef={scrollViewRef} title={t('fileUpload.PhotosNotUploaded')} text={errorMessage} border="error" focusOnError={onSaveClicked} />
          </Box>
        )}
        <TextView variant="MobileBodyBold" accessibilityRole="header" mx={theme.dimensions.gutter}>
          {request.displayName}
        </TextView>
        <Box
          backgroundColor={'contentBox'}
          borderTopWidth={1}
          borderTopColor="primary"
          borderBottomWidth={1}
          borderBottomColor="primary"
          pt={theme.dimensions.standardMarginBetween}
          pb={theme.dimensions.standardMarginBetween}
          display="flex"
          flexDirection="row"
          flexWrap="wrap">
          {displayImages()}
        </Box>
        <Box
          justifyContent="space-between"
          flexDirection="row"
          flexWrap="wrap"
          mx={theme.dimensions.gutter}
          mt={theme.dimensions.condensedMarginBetween}
          mb={theme.dimensions.standardMarginBetween}>
          <TextView variant="HelperText">{t('fileUpload.ofTenPhotos', { numOfPhotos: imagesList?.length })}</TextView>
          <TextView
            variant="HelperText"
            accessibilityLabel={t('fileUpload.ofFiftyMB.a11y', { sizeOfPhotos: bytesToFinalSizeDisplayA11y(totalBytesUsed ? totalBytesUsed : 0, t, false) })}>
            {t('fileUpload.ofFiftyMB', { sizeOfPhotos: bytesToFinalSizeDisplay(totalBytesUsed ? totalBytesUsed : 0, t, false) })}
          </TextView>
        </Box>
        <Box mx={theme.dimensions.gutter}>
          <FormWrapper fieldsList={pickerField} onSave={onUpload} onSaveClicked={onSaveClicked} setOnSaveClicked={setOnSaveClicked} />
          <Box mt={theme.dimensions.textAndButtonLargeMargin}>
            <VAButton
              onPress={() => {
                setOnSaveClicked(true)
              }}
              label={t('fileUpload.submit')}
              testID={t('fileUpload.submit')}
              buttonType={ButtonTypesConstants.buttonPrimary}
            />
          </Box>
        </Box>
      </Box>
    </FullScreenSubtask>
  )
}

export default UploadOrAddPhotos
