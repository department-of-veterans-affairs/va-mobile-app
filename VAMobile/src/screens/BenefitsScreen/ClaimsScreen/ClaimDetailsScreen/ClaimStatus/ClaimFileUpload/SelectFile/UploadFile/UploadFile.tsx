import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import DocumentPicker from 'react-native-document-picker'
import { ScrollView } from 'react-native/types'

import { StackActions } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'

import { useUploadFileToClaim } from 'api/claimsAndAppeals'
import { ClaimEventData, UploadFileToClaimParamaters } from 'api/types'
import { AlertWithHaptics, Box, FieldType, FormFieldType, FormWrapper, LoadingComponent, TextView } from 'components'
import FileList from 'components/FileList'
import { SnackbarMessages } from 'components/SnackBar'
import FullScreenSubtask from 'components/Templates/FullScreenSubtask'
import { Events } from 'constants/analytics'
import { ClaimTypeConstants } from 'constants/claims'
import { DocumentTypes526 } from 'constants/documentTypes'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList, DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import { MAX_TOTAL_FILE_SIZE_IN_BYTES, isValidFileType } from 'utils/claims'
import { showSnackBar } from 'utils/common'
import {
  useAppDispatch,
  useBeforeNavBackListener,
  useDestructiveActionSheet,
  useRouteNavigation,
  useShowActionSheet,
  useTheme,
} from 'utils/hooks'
import { getWaygateToggles } from 'utils/waygateConfig'

type UploadFileProps = StackScreenProps<BenefitsStackParamList, 'UploadFile'>

function UploadFile({ navigation, route }: UploadFileProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { claimID, request: originalRequest, fileUploaded } = route.params
  const [filesUploadedSuccess, setFilesUploadedSuccess] = useState(false)
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const [filesList, setFilesList] = useState<DocumentPickerResponse[]>([fileUploaded])
  const { mutate: uploadFileToClaim, isPending: loadingFileUpload } = useUploadFileToClaim(
    claimID,
    originalRequest,
    filesList,
  )
  const confirmAlert = useDestructiveActionSheet()
  const [request, setRequest] = useState<ClaimEventData | undefined>(originalRequest)
  const snackbarMessages: SnackbarMessages = {
    successMsg: t('fileUpload.submitted'),
    errorMsg: t('fileUpload.submitted.error'),
  }
  const [error, setError] = useState('')
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false)
  const [filesEmptyError, setFilesEmptyError] = useState(false)
  const showActionSheet = useShowActionSheet()
  const scrollViewRef = useRef<ScrollView>(null)

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
          onPress: () => {
            if (request) {
              navigateTo('FileRequestDetails', { claimID, request })
            } else {
              navigateTo('SubmitEvidence', { claimID })
            }
          },
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
        showSnackBar(snackbarMessages.successMsg, dispatch, undefined, true)
      },
      onError: () => showSnackBar(snackbarMessages.errorMsg, dispatch, onUploadConfirmed, false, true),
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

  return (
    <FullScreenSubtask
      leftButtonText={t('cancel')}
      title={t('fileUpload.uploadFiles')}
      onLeftButtonPress={() => {
        logAnalyticsEvent(
          Events.vama_evidence_cancel_2(
            claimID,
            request?.trackedItemId || null,
            request?.type || 'Submit Evidence',
            'file',
          ),
        )
        navigation.dispatch(StackActions.pop(2))
      }}>
      {loadingFileUpload ? (
        <LoadingComponent text={t('fileUpload.loading')} />
      ) : (
        <>
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
              {filesEmptyError && (
                <TextView variant="MobileBodyBold" color="error" mb={3}>
                  {t('fileUpload.requiredFile')}
                </TextView>
              )}
              <Button
                buttonType={ButtonVariants.Secondary}
                onPress={onSelectFile}
                label={t('fileUpload.selectAFile')}
              />
            </Box>
          )}
          <Box mx={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween}>
            <FormWrapper
              fieldsList={pickerField}
              onSave={onUpload}
              onSaveClicked={onSaveClicked}
              setOnSaveClicked={setOnSaveClicked}
            />
            <Box mt={theme.dimensions.textAndButtonLargeMargin}>
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
          </Box>
        </>
      )}
    </FullScreenSubtask>
  )
}

export default UploadFile
