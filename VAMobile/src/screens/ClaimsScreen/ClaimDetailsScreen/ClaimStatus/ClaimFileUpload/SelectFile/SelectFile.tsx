import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { useActionSheet } from '@expo/react-native-action-sheet'
import DocumentPicker from 'react-native-document-picker'

import { AlertBox, BackButton, Box, ButtonTypesConstants, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsStackParamList, DocumentPickerResponse } from '../../../../ClaimsStackScreens'
import { MAX_TOTAL_FILE_SIZE_IN_BYTES, isValidFileType } from 'utils/claims'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { IS_TEST } = getEnv()

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
      headerLeft: (props): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />,
    })
  })

  const onFileFolder = async (): Promise<void> => {
    const {
      pickSingle,
      types: { images, plainText, pdf },
    } = DocumentPicker

    try {
      const document = (await pickSingle({
        type: [images, plainText, pdf],
      })) as DocumentPickerResponse

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (docError: any) {
      if (DocumentPicker.isCancel(docError as Error)) {
        return
      }

      setError(docError.code)
    }
  }

  const onSelectFile = (): void => {
    // For integration tests, bypass the file picking process
    if (IS_TEST) {
      navigateTo('UploadFile', { request, fileUploaded: 'test file' })()
      return
    }

    const options = [t('fileUpload.fileFolder'), t('common:cancel')]

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 1,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            onFileFolder()
            break
        }
      },
    )
  }

  // Because the select a file button has the same accessibility label as the file upload screen it causes query issues in android
  const buttonTestId = IS_TEST ? 'selectfilebutton2' : t('fileUpload.selectAFile')

  return (
    <VAScrollView {...testIdProps('File-upload: Select-a-file-to-upload-for-the-request-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {!!error && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertBox text={error} border="error" background="noCardBackground" />
          </Box>
        )}
        <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
          {t('fileUpload.selectAFileToUpload', { requestTitle: request.displayName || t('fileUpload.theRequest') })}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('fileUpload.pleaseRequestFromPhoneFiles')}
        </TextView>
        <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header" mt={theme.dimensions.standardMarginBetween}>
          {t('fileUpload.acceptedFileTypes')}
        </TextView>
        <TextView variant="MobileBody">{t('fileUpload.acceptedFileTypeOptions')}</TextView>
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={onSelectFile}
            label={t('fileUpload.selectAFile')}
            testID={buttonTestId}
            buttonType={ButtonTypesConstants.buttonPrimary}
            a11yHint={t('fileUpload.selectAFileWithPhoneA11yHint')}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default SelectFile
