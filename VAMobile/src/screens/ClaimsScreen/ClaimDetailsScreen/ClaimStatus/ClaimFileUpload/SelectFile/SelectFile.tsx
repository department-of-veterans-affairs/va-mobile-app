import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker'
import { useActionSheet } from '@expo/react-native-action-sheet'
import DocumentPicker from 'react-native-document-picker'

import { AlertBox, BackButton, Box, ButtonTypesConstants, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsStackParamList } from '../../../../ClaimsStackScreens'
import { MAX_TOTAL_FILE_SIZE_IN_BYTES, isValidFileType, postCameraLaunchCallback } from 'utils/claims'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type SelectFilesProps = StackScreenProps<ClaimsStackParamList, 'SelectFile'>

const SelectFile: FC<SelectFilesProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { showActionSheetWithOptions } = useActionSheet()
  const [error, setError] = useState('')
  const { request } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  const onFileFolder = async (): Promise<void> => {
    try {
      const document = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.plainText, DocumentPicker.types.pdf],
      })

      if (document.size > MAX_TOTAL_FILE_SIZE_IN_BYTES) {
        setError(t('fileUpload.fileSizeError'))
        return
      }

      if (!isValidFileType(document.type)) {
        setError(t('fileUpload.fileTypeError'))
        return
      }

      setError('')
      navigateTo('UploadFile', { request, fileUploaded: document })()
    } catch (docError) {
      if (DocumentPicker.isCancel(docError)) {
        return
      }

      setError(docError.code)
    }
  }

  const cameraRollCallbackIfUri = (response: ImagePickerResponse): void => {
    navigateTo('UploadFile', { request, imageUploaded: response })()
  }

  const onSelectFile = (): void => {
    const options = [t('fileUpload.cameraRoll'), t('fileUpload.fileFolder'), t('common:cancel')]

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            launchImageLibrary({ mediaType: 'photo', quality: 0.9 }, (response: ImagePickerResponse): void => {
              postCameraLaunchCallback(response, setError, cameraRollCallbackIfUri, 0, t, false)
            })
            break
          case 1:
            onFileFolder()
            break
        }
      },
    )
  }

  return (
    <VAScrollView {...testIdProps('File-upload: Select-a-file-to-upload-for-the-request-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {!!error && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertBox text={error} border="error" background="noCardBackground" />
          </Box>
        )}
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('fileUpload.selectAFileToUpload', { requestTitle: request.displayName || t('fileUpload.theRequest') })}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('fileUpload.pleaseRequestFromPhoneFiles')}
        </TextView>
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={onSelectFile}
            label={t('fileUpload.selectAFile')}
            testID={t('fileUpload.selectAFile')}
            buttonType={ButtonTypesConstants.buttonPrimary}
            a11yHint={t('fileUpload.selectAFileWithPhoneA11yHint')}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default SelectFile
