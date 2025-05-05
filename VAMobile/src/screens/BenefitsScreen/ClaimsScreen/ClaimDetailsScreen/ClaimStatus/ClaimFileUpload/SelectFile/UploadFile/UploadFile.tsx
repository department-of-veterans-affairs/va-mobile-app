import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import { ScrollView } from 'react-native/types'

import { StackActions } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { spacing } from '@department-of-veterans-affairs/mobile-tokens'

import { useUploadFileToClaim } from 'api/claimsAndAppeals'
import { ClaimEventData, UploadFileToClaimParamaters } from 'api/types'
import {
  AlertWithHaptics,
  Box,
  FieldType,
  FormFieldType,
  FormWrapper,
  LoadingComponent,
  TextView,
  VAScrollView,
} from 'components'
import FileList from 'components/FileList'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import SubtaskTitle from 'components/Templates/SubtaskTitle'
import { Events } from 'constants/analytics'
import { ClaimTypeConstants } from 'constants/claims'
import { DocumentTypes526 } from 'constants/documentTypes'
import { NAMESPACE } from 'constants/namespaces'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import { MAX_TOTAL_FILE_SIZE_IN_BYTES, isValidFileType } from 'utils/claims'
import {
  useBeforeNavBackListener,
  useDestructiveActionSheet,
  useRouteNavigation,
  useShowActionSheet,
  useTheme,
} from 'utils/hooks'
import { getWaygateToggles } from 'utils/waygateConfig'

import { FileRequestStackParams } from '../../FileRequestSubtask'

type UploadFileProps = StackScreenProps<FileRequestStackParams, 'UploadFile'>

function UploadFile({ navigation, route }: UploadFileProps) {
  const snackbar = useSnackbar()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { claimID, request: originalRequest, fileUploaded } = route.params
  const [filesUploadedSuccess, setFilesUploadedSuccess] = useState(false)
  const navigateTo = useRouteNavigation()
  const [filesList, setFilesList] = useState<DocumentPickerResponse[]>([fileUploaded])
  const { mutate: uploadFileToClaim, isPending: loadingFileUpload } = useUploadFileToClaim(
    claimID,
    originalRequest,
    filesList,
  )
  const confirmAlert = useDestructiveActionSheet()
  const [request, setRequest] = useState<ClaimEventData | undefined>(originalRequest)
  const [error, setError] = useState('')
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false)
  const [filesEmptyError, setFilesEmptyError] = useState(false)
  const showActionSheet = useShowActionSheet()
  const scrollViewRef = useRef<ScrollView>(null)

  useSubtaskProps({
    leftButtonText: t('cancel'),
    onLeftButtonPress: () => onCancel(),
  })

  const waygate = getWaygateToggles().WG_UploadFile
  useBeforeNavBackListener(navigation, (e) => {
    if (isActionSheetVisible) {
      e.preventDefault()
    }
    if (filesList?.length === 0 || filesUploadedSuccess || (!waygate.enabled && waygate.type === 'DenyContent')) {
      return
    }
    e.preventDefault()
    confirmAlert({
      title: t('fileUpload.discard.confirm.title'),
      message: request
        ? t('fileUpload.discard.confirm.message.requestFile')
        : t('fileUpload.discard.confirm.message.submitEvidenceFile'),
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: [
        {
          text: t('fileUpload.continueUpload'),
        },
        {
          text: t('fileUpload.cancelUpload'),
          onPress: () => navigation.dispatch(e.data.action),
        },
      ],
    })
  })

  useEffect(() => {
    if (filesUploadedSuccess) {
      navigateTo('ClaimDetailsScreen', { claimID: claimID, claimType: ClaimTypeConstants.ACTIVE })
    }
  }, [filesUploadedSuccess, claimID, navigateTo])

  const [documentType, setDocumentType] = useState('')
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (originalRequest) {
      setRequest({
        ...originalRequest,
        documentType,
      })
    }
  }, [documentType, originalRequest])

  const onUploadConfirmed = () => {
    logAnalyticsEvent(
      Events.vama_evidence_cont_3(claimID, request?.trackedItemId || null, request?.type || 'Submit Evidence', 'file'),
    )
    const mutateOptions = {
      onMutate: () => {
        logAnalyticsEvent(
          Events.vama_claim_upload_start(
            claimID,
            request?.trackedItemId || null,
            request?.type || 'Submit Evidence',
            'file',
          ),
        )
      },
      onSuccess: () => {
        setFilesList([])
        setFilesUploadedSuccess(true)
        logAnalyticsEvent(
          Events.vama_claim_upload_compl(
            claimID,
            request?.trackedItemId || null,
            request?.type || 'Submit Evidence',
            'file',
          ),
        )
        snackbar.show(t('fileUpload.submitted'))
      },
      onError: () =>
        snackbar.show(t('fileUpload.submitted.error'), {
          isError: true,
          offset: theme.dimensions.snackBarBottomOffset,
          onActionPressed: onUploadConfirmed,
        }),
    }
    const params: UploadFileToClaimParamaters = { claimID, documentType: documentType, request, files: filesList }
    uploadFileToClaim(params, mutateOptions)
  }

  const onUpload = (): void => {
    if (filesEmptyError) {
      return
    }
    const totalSize = filesList.reduce((sum, file) => sum + file.size, 0)
    logAnalyticsEvent(
      Events.vama_evidence_cont_2(
        claimID,
        request?.trackedItemId || null,
        request?.type || 'Submit Evidence',
        'file',
        totalSize,
        filesList.length,
      ),
    )
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
    logAnalyticsEvent(
      Events.vama_evidence_type(
        claimID,
        request?.trackedItemId || null,
        request?.type || 'Submit Evidence',
        'file',
        typeLabel,
      ),
    )
    setDocumentType(selectedType)
  }

  const onCheckboxChange = (isChecked: boolean) => {
    if (isChecked) {
      logAnalyticsEvent(
        Events.vama_evidence_conf(claimID, request?.trackedItemId || null, request?.type || 'Submit Evidence', 'file'),
      )
    }
    setConfirmed(isChecked)
  }

  const onFileDelete = () => {
    setFilesList([])
  }

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
      setFilesEmptyError(false)
      setError('')
      setFilesList([document])
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
        labelKey: 'fileUpload.evidenceOnly',
        selected: confirmed,
        onSelectionChange: onCheckboxChange,
        isRequiredField: true,
      },
      fieldErrorMessage: t('fileUpload.evidenceOnly.error'),
    },
  ]

  const onCancel = () => {
    logAnalyticsEvent(
      Events.vama_evidence_cancel_2(
        claimID,
        request?.trackedItemId || null,
        request?.type || 'Submit Evidence',
        'file',
      ),
    )
    navigation.dispatch(StackActions.pop(2))
  }

  const fileSelectStyle = {
    padding: spacing.vadsSpaceSm,
    backgroundColor: 'transparent',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border.photoAdd,
    textAlign: 'center',
  }

  const a11yErrorLabel = t('error', { error: t('fileUpload.requiredFile') })

  return (
    <VAScrollView scrollViewRef={scrollViewRef}>
      <SubtaskTitle title={t('fileUpload.uploadFiles')} />

      {loadingFileUpload ? (
        <LoadingComponent text={t('fileUpload.loading')} />
      ) : (
        <>
          <Box flex={1}>
            {!!error && (
              <Box mb={theme.dimensions.standardMarginBetween}>
                <AlertWithHaptics variant="error" description={error} scrollViewRef={scrollViewRef} />
              </Box>
            )}
            {request && (
              <TextView
                variant="MobileBodyBold"
                accessibilityRole="header"
                mb={theme.dimensions.contentMarginBottom}
                mx={theme.dimensions.gutter}>
                {request.displayName}
              </TextView>
            )}
            {filesList && filesList.length > 0 ? (
              <FileList files={filesList} onDelete={onFileDelete} />
            ) : (
              <Box mx={theme.dimensions.gutter} mt={theme.dimensions.condensedMarginBetween}>
                <Pressable onPress={onSelectFile} accessibilityRole="button">
                  <Box>
                    {filesEmptyError && (
                      // eslint-disable-next-line react-native-a11y/has-accessibility-hint
                      <TextView variant="MobileBodyBold" color="error" mb={3} accessibilityLabel={a11yErrorLabel}>
                        {t('fileUpload.requiredFile')}
                      </TextView>
                    )}
                    <TextView variant="MobileBodyBold" color="link" style={fileSelectStyle}>
                      {t('fileUpload.selectAFile')}
                    </TextView>
                  </Box>
                </Pressable>
              </Box>
            )}
            <Box mx={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween}>
              <FormWrapper
                fieldsList={pickerField}
                onSave={onUpload}
                onSaveClicked={onSaveClicked}
                setOnSaveClicked={setOnSaveClicked}
              />
            </Box>
          </Box>
          <Box
            mt={theme.dimensions.standardMarginBetween}
            mx={theme.dimensions.gutter}
            mb={theme.dimensions.contentMarginBottom}>
            <Button
              onPress={() => {
                if (filesList?.length === 0) {
                  setFilesEmptyError(true)
                }
                setOnSaveClicked(true)
              }}
              label={t('fileUpload.submit')}
              testID={t('fileUpload.submit')}
            />
          </Box>
        </>
      )}
    </VAScrollView>
  )
}

export default UploadFile
