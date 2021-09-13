import { Dimensions, Image } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactElement, ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components'

import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { useActionSheet } from '@expo/react-native-action-sheet'
import _ from 'underscore'

import { AlertBox, BackButton, Box, ButtonTypesConstants, FieldType, FormFieldType, FormWrapper, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsStackParamList } from '../../../../../ClaimsStackScreens'
import { DocumentTypes526 } from 'constants/documentTypes'
import { NAMESPACE } from 'constants/namespaces'
import { onAddPhotos } from 'utils/claims'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type StyledImageProps = {
  /** prop to set image width */
  width: number
}
const StyledImage = styled(Image)<StyledImageProps>`
  width: ${themeFn<StyledImageProps>((theme, props) => props.width)}px;
  height: 150px;
`

type UploadOrAddPhotosProps = StackScreenProps<ClaimsStackParamList, 'UploadOrAddPhotos'>

const UploadOrAddPhotos: FC<UploadOrAddPhotosProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { showActionSheetWithOptions } = useActionSheet()
  const { request, firstImageResponse } = route.params
  const [imagesList, setImagesList] = useState([firstImageResponse])
  const [errorMessage, setErrorMessage] = useState('')
  const [totalBytesUsed, setTotalBytesUsed] = useState(firstImageResponse.fileSize || 0)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />,
    })
  })

  const displayImages = (): ReactElement[] => {
    const { condensedMarginBetween, gutter } = theme.dimensions
    /** Need to subtract gutter margins and margins between pics before dividing screen width by 3 to get the width of each image*/
    const calculatedWidth = (Dimensions.get('window').width - 2 * gutter - 2 * condensedMarginBetween) / 3

    return _.map(imagesList, (image, index) => {
      return (
        /** Rightmost photo doesn't need right margin b/c of gutter margins
         * Every 3rd photo, right margin is changed to zero*/
        <Box mt={condensedMarginBetween} mr={index % 3 === 2 ? 0 : condensedMarginBetween} key={index} accessible={true} accessibilityRole="image">
          <StyledImage source={{ uri: image.uri }} width={calculatedWidth} />
        </Box>
      )
    })
  }

  const callbackIfUri = (response: ImagePickerResponse): void => {
    setImagesList([...imagesList, response])

    if (response.fileSize) {
      setTotalBytesUsed(totalBytesUsed + response.fileSize)
    }
  }

  const onUpload = navigateTo('UploadConfirmation', { request, filesList: imagesList })

  const [documentType, setDocumentType] = useState('')
  const [onSaveClicked, setOnSaveClicked] = useState(false)

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
        includeBlankPlaceholder: true,
        isRequiredField: true,
        disabled: false,
      },
      fieldErrorMessage: t('claims:fileUpload.documentType.fieldError'),
    },
  ]

  return (
    <VAScrollView {...testIdProps('File-upload: Upload-files-or-add-photos-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {!!errorMessage && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertBox text={errorMessage} border="error" background="noCardBackground" />
          </Box>
        )}
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {request.displayName}
        </TextView>
        <Box mt={theme.dimensions.condensedMarginBetween} mb={theme.dimensions.standardMarginBetween} display="flex" flexDirection="row" flexWrap="wrap">
          {displayImages()}
        </Box>
        <FormWrapper fieldsList={pickerField} onSave={onUpload} onSaveClicked={onSaveClicked} setOnSaveClicked={setOnSaveClicked} />
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={() => {
              setOnSaveClicked(true)
            }}
            label={t('fileUpload.upload')}
            testID={t('fileUpload.upload')}
            buttonType={ButtonTypesConstants.buttonPrimary}
            a11yHint={t('fileUpload.uploadA11yHint')}
          />
          {imagesList.length < 10 && (
            <Box mt={theme.dimensions.condensedMarginBetween}>
              <VAButton
                onPress={(): void => onAddPhotos(t, showActionSheetWithOptions, setErrorMessage, callbackIfUri, totalBytesUsed)}
                label={t('fileUpload.addAnotherPhoto')}
                testID={t('fileUpload.addAnotherPhoto')}
                buttonType={ButtonTypesConstants.buttonSecondary}
                a11yHint={t('fileUpload.addAnotherPhotoA11yHint')}
              />
            </Box>
          )}
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default UploadOrAddPhotos
