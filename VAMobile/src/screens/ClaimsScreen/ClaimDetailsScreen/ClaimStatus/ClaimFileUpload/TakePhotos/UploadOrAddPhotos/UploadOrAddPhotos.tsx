import { Dimensions } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch } from 'react-redux'
import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react'

import { Asset, ImagePickerResponse } from 'react-native-image-picker/src/types'
import { bytesToFinalSizeDisplay } from 'utils/common'
import { useActionSheet } from '@expo/react-native-action-sheet'

import { AlertBox, BackButton, Box, ButtonTypesConstants, FieldType, FormFieldType, FormWrapper, PhotoAdd, PhotoPreview, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsStackParamList } from '../../../../../ClaimsStackScreens'
import { DocumentTypes526 } from 'constants/documentTypes'
import { NAMESPACE } from 'constants/namespaces'
import { deletePhoto, onAddPhotos } from 'utils/claims'
import { showSnackBar } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import _ from 'underscore'

type UploadOrAddPhotosProps = StackScreenProps<ClaimsStackParamList, 'UploadOrAddPhotos'>

const UploadOrAddPhotos: FC<UploadOrAddPhotosProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { showActionSheetWithOptions } = useActionSheet()
  const { request, firstImageResponse } = route.params
  const dispatch = useDispatch()
  const [imagesList, setImagesList] = useState(firstImageResponse.assets)
  const [errorMessage, setErrorMessage] = useState('')
  const [totalBytesUsed, setTotalBytesUsed] = useState(firstImageResponse.assets?.reduce((total, asset) => (total += asset.fileSize || 0), 0))

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />,
    })
  })

  const displayImages = (): ReactElement => {
    const { condensedMarginBetween, gutter } = theme.dimensions
    /** Need to subtract gutter margins and margins between pics before dividing screen width by 3 to get the width of each image*/
    const calculatedWidth = (Dimensions.get('window').width - 2 * gutter - 2 * condensedMarginBetween) / 3

    const uploadedImages = (): ReactElement[] => {
      return _.map(imagesList || [], (asset, index) => {
        return (
          <Box mt={condensedMarginBetween} mr={index % 3 === 2 ? 0 : condensedMarginBetween} key={index} accessible={true} accessibilityRole="image">
            <PhotoPreview
              width={calculatedWidth}
              height={calculatedWidth}
              image={asset}
              onDeleteCallback={(): void => {
                deletePhoto(deleteCallbackIfUri, index, imagesList || [])
              }}
              lastPhoto={imagesList?.length === 1 ? true : undefined}
            />
          </Box>
        )
      })
    }

    return (
      <Box display="flex" flexDirection="row" flexWrap="wrap" mx={theme.dimensions.gutter}>
        {uploadedImages()}
        {(!imagesList || imagesList.length < 10) && (
          <Box mt={condensedMarginBetween} accessible={true} accessibilityRole="image">
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
    if (response && response.assets && response.assets.length + (imagesList?.length || 0) > 10) {
      setErrorMessage(t('fileUpload.tooManyPhotosError'))
    } else {
      const imagesCopy = imagesList
      console.log('imagesCopy.length: ' + imagesCopy?.length)
      response.assets?.forEach((asset) => {
        imagesCopy?.push(asset)
      })
      console.log('imagesCopy.length.2: ' + imagesCopy?.length)
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
      navigation.goBack()
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

  const onUpload = navigateTo('UploadConfirmation', { request, filesList: imagesList })

  const [documentType, setDocumentType] = useState('')
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    request.documentType = documentType
  }, [documentType, request])

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
          mx={theme.dimensions.gutter}
          mt={theme.dimensions.condensedMarginBetween}
          mb={theme.dimensions.standardMarginBetween}>
          <TextView variant="HelperText" color={'brandedPrimaryText'}>
            {t('fileUpload.ofTenPhotos', { numOfPhotos: imagesList?.length })}
          </TextView>
          <TextView variant="HelperText" color={'brandedPrimaryText'}>
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
