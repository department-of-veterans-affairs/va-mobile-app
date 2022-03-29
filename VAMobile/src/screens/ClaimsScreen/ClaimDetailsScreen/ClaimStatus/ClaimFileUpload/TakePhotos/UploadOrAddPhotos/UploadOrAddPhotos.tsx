import { Asset, ImagePickerResponse } from 'react-native-image-picker/src/types'
import { Dimensions } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react'
import _ from 'underscore'

import {
  AlertBox,
  BackButton,
  Box,
  ButtonTypesConstants,
  FieldType,
  FormFieldType,
  FormWrapper,
  LoadingComponent,
  PhotoAdd,
  PhotoPreview,
  TextView,
  VAButton,
  VAScrollView,
} from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimEventData } from 'store/api'
import { ClaimsAndAppealsState, fileUploadSuccess, uploadFileToClaim } from 'store/slices'
import { ClaimsStackParamList } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { DocumentTypes526 } from 'constants/documentTypes'
import { MAX_NUM_PHOTOS } from 'constants/claims'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { bytesToFinalSizeDisplay } from 'utils/common'
import { deletePhoto, onAddPhotos } from 'utils/claims'
import { showSnackBar } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useDestructiveAlert, useTheme, useTranslation } from 'utils/hooks'

type UploadOrAddPhotosProps = StackScreenProps<ClaimsStackParamList, 'UploadOrAddPhotos'>

const UploadOrAddPhotos: FC<UploadOrAddPhotosProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const { claim, filesUploadedSuccess, fileUploadedFailure, loadingFileUpload } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const { showActionSheetWithOptions } = useActionSheet()
  const { request: originalRequest, firstImageResponse } = route.params
  const dispatch = useDispatch()
  const [imagesList, setImagesList] = useState(firstImageResponse.assets)
  const [errorMessage, setErrorMessage] = useState('')
  const [totalBytesUsed, setTotalBytesUsed] = useState(firstImageResponse.assets?.reduce((total, asset) => (total += asset.fileSize || 0), 0))
  const confirmAlert = useDestructiveAlert()
  const [request, setRequest] = useState<ClaimEventData>(originalRequest)
  const sliceMessages = {
    successMsg: t('fileUpload.submitted'),
    failureMsg: t('fileUpload.submitted.error'),
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => <BackButton onPress={onCancel} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />,
    })
  })

  const onCancel = () => {
    confirmAlert({
      title: t('fileUpload.discard.confirm.title.photos'),
      message: t('fileUpload.discard.confirm.message.photos'),
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: [
        {
          text: t('common:cancel'),
        },
        {
          text: t('fileUpload.discard.photos'),
          onPress: () => {
            snackBar.hideAll()
            navigation.navigate('FileRequestDetails', { request })
          },
        },
      ],
    })
  }

  useEffect(() => {
    if (fileUploadedFailure || filesUploadedSuccess) {
      dispatch(fileUploadSuccess())
    }

    if (filesUploadedSuccess) {
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
    return <LoadingComponent text={t('fileUpload.loading')} />
  }

  const onUploadConfirmed = () => {
    dispatch(uploadFileToClaim(claim?.id || '', sliceMessages, request, imagesList || []))
  }

  const onUpload = (): void => {
    confirmAlert({
      title: t('fileUpload.submit.confirm.title'),
      message: t('fileUpload.submit.confirm.message'),
      cancelButtonIndex: 0,
      buttons: [
        {
          text: t('common:cancel'),
        },
        {
          text: t('fileUpload.submit'),
          onPress: onUploadConfirmed,
        },
      ],
    })
  }

  const pickerField: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        selectedValue: documentType,
        onSelectionChange: setDocumentType,
        pickerOptions: DocumentTypes526,
        labelKey: 'claims:fileUpload.documentType',
        isRequiredField: true,
        disabled: false,
      },
      fieldErrorMessage: t('claims:fileUpload.documentType.fieldError'),
    },
    {
      fieldType: FieldType.Selector,
      fieldProps: {
        labelKey: 'claims:fileUpload.evidenceOnlyPhoto',
        selected: confirmed,
        onSelectionChange: setConfirmed,
        isRequiredField: true,
      },
      fieldErrorMessage: t('fileUpload.evidenceOnly.error'),
    },
  ]

  const displayImages = (): ReactElement => {
    const { condensedMarginBetween, gutter } = theme.dimensions
    /** Need to subtract gutter margins and margins between pics before dividing screen width by 3 to get the width of each image*/
    const calculatedWidth = (Dimensions.get('window').width - 2 * gutter - 2 * condensedMarginBetween) / 3

    const uploadedImages = (): ReactElement[] => {
      return _.map(imagesList || [], (asset, index) => {
        return (
          /** Rightmost photo doesn't need right margin b/c of gutter margins
           * Every 3rd photo, right margin is changed to zero*/
          <Box mt={condensedMarginBetween} mr={index % 3 === 2 ? 0 : condensedMarginBetween} key={index}>
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
              lastPhoto={imagesList?.length === 1 ? true : undefined}
            />
          </Box>
        )
      })
    }

    return (
      <Box display="flex" flexDirection="row" flexWrap="wrap" mx={theme.dimensions.gutter}>
        {uploadedImages()}
        {(!imagesList || imagesList.length < MAX_NUM_PHOTOS) && (
          <Box mt={condensedMarginBetween}>
            <PhotoAdd
              width={calculatedWidth}
              height={calculatedWidth}
              onPress={(): void => {
                onAddPhotos(t, showActionSheetWithOptions, setErrorMessage, callbackIfUri, totalBytesUsed || 0)
              }}
            />
          </Box>
        )}
      </Box>
    )
  }

  const callbackIfUri = (response: ImagePickerResponse): void => {
    snackBar.hideAll()
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
      showSnackBar(t('fileUpload.photoDeleted'), dispatch, undefined, true, false, false)
      navigation.navigate('TakePhotos', { request, focusOnSnackbar: true })
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
      snackBar.hideAll()
      showSnackBar(t('fileUpload.photoDeleted'), dispatch, undefined, true, false, false)
    }
  }

  return (
    <VAScrollView {...testIdProps('File-upload: Upload-files-or-add-photos-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        {!!errorMessage && (
          <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
            <AlertBox title={t('fileUpload.PhotosNotUploaded')} text={errorMessage} border="error" />
          </Box>
        )}
        <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header" mx={theme.dimensions.gutter}>
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
          <TextView variant="HelperText" color="bodyText">
            {t('fileUpload.ofTenPhotos', { numOfPhotos: imagesList?.length })}
          </TextView>
          <TextView variant="HelperText" color="bodyText">
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
              a11yHint={t('fileUpload.uploadA11yHint')}
            />
          </Box>
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default UploadOrAddPhotos
