import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'
import DocumentPicker from 'react-native-document-picker'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { AlertWithHaptics, Box, TextArea, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import SubtaskTitle from 'components/Templates/SubtaskTitle'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import { MAX_TOTAL_FILE_SIZE_IN_BYTES, isValidFileType } from 'utils/claims'
import getEnv from 'utils/env'
import { useBeforeNavBackListener, useRouteNavigation, useShowActionSheet, useTheme } from 'utils/hooks'

import { FileRequestStackParams } from '../FileRequestSubtask'

const { IS_TEST } = getEnv()

type SelectFilesProps = StackScreenProps<FileRequestStackParams, 'SelectFile'>

function SelectFile({ navigation, route }: SelectFilesProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const [error, setError] = useState('')
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const { claimID, request } = route.params || {}
  const showActionSheet = useShowActionSheet()

  useBeforeNavBackListener(navigation, (e) => {
    if (isActionSheetVisible) {
      e.preventDefault()
    }
  })

  useSubtaskProps({
    leftButtonText: t('back'),
    onLeftButtonPress: () => onCancel(),
    scrollViewRef: scrollViewRef,
  })

  const onFileFolder = async (): Promise<void> => {
    const {
      pickSingle,
      types: { images, plainText, pdf },
    } = DocumentPicker

    logAnalyticsEvent(
      Events.vama_evidence_cont_1(claimID, request?.trackedItemId || null, request?.type || 'Submit Evidence', 'file'),
    )

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
      navigateTo('UploadFile', { claimID, request, fileUploaded: document })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (docError: any) {
      if (DocumentPicker.isCancel(docError as Error)) {
        return
      }
      logNonFatalErrorToFirebase(docError, 'onFileFolder: SelectFile.tsx Error')
      setError(docError.code)
    }
  }

  const onSelectFile = (): void => {
    // For integration tests, bypass the file picking process
    if (IS_TEST) {
      navigateTo('UploadFile', { claimID, request, fileUploaded: 'test file' })
      return
    }

    const options = [t('fileUpload.fileFolder'), t('cancel')]

    setIsActionSheetVisible(true)
    showActionSheet(
      {
        options,
        cancelButtonIndex: 1,
      },
      (buttonIndex) => {
        setIsActionSheetVisible(false)
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

  const onCancel = () => {
    logAnalyticsEvent(
      Events.vama_evidence_cancel_1(
        claimID,
        request?.trackedItemId || null,
        request?.type || 'Submit Evidence',
        'file',
      ),
    )
    navigation.goBack()
  }

  return (
    <VAScrollView>
      <SubtaskTitle title={t('fileUpload.selectFiles')} />

      <Box flex={1}>
        {!!error && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertWithHaptics variant="error" description={error} scrollViewRef={scrollViewRef} />
          </Box>
        )}
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {request
              ? t('fileUpload.selectAFileToUpload', { requestTitle: request.displayName || t('fileUpload.theRequest') })
              : t('fileUpload.selectAFileToUploadSubmitEvidence')}
          </TextView>
          <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
            {t('fileUpload.pleaseRequestFromPhoneFiles')}
            <TextView variant="MobileBodyBold">
              {t('fileUpload.pleaseRequestFromPhoneFiles.bolded')}
              <TextView variant="MobileBody">
                {request
                  ? t('fileUpload.pleaseRequestFromPhoneFiles.pt2')
                  : t('fileUpload.pleaseRequestFromPhoneFiles.pt2SubmitEvidence')}
              </TextView>
            </TextView>
          </TextView>
          <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.standardMarginBetween}>
            {t('fileUpload.maxFileSize')}
          </TextView>
          <TextView variant="MobileBody" accessibilityLabel={t('fileUpload.50MB.a11y')}>
            {t('fileUpload.50MB')}
          </TextView>
          <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.standardMarginBetween}>
            {t('fileUpload.acceptedFileTypes')}
          </TextView>
          <TextView variant="MobileBody">{t('fileUpload.acceptedFileTypeOptions')}</TextView>
        </TextArea>
      </Box>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <Button onPress={onSelectFile} label={t('fileUpload.selectAFile')} testID={buttonTestId} />
      </Box>
    </VAScrollView>
  )
}

export default SelectFile
