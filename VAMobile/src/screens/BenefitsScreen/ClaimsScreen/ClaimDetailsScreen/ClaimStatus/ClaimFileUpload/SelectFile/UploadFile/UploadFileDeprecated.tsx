import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackActions } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { useClaim, useUploadFileToClaim } from 'api/claimsAndAppeals'
import { ClaimEventData, UploadFileToClaimParamaters } from 'api/types'
import { Box, FieldType, FormFieldType, FormWrapper, LoadingComponent, TextView } from 'components'
import FileList from 'components/FileList'
import { SnackbarMessages } from 'components/SnackBar'
import FullScreenSubtask from 'components/Templates/FullScreenSubtask'
import { Events } from 'constants/analytics'
import { DocumentTypes526 } from 'constants/documentTypes'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList, DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { logAnalyticsEvent } from 'utils/analytics'
import { showSnackBar } from 'utils/common'
import {
  useAppDispatch,
  useBeforeNavBackListener,
  useDestructiveActionSheet,
  useRouteNavigation,
  useTheme,
} from 'utils/hooks'
import { getWaygateToggles } from 'utils/waygateConfig'

type UploadFileProps = StackScreenProps<BenefitsStackParamList, 'UploadFileDeprecated'>

function UploadFileDeprecated({ navigation, route }: UploadFileProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { claimID, request: originalRequest, fileUploaded } = route.params
  const { data: claim } = useClaim(claimID)
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
  const [request, setRequest] = useState<ClaimEventData>(originalRequest)
  const snackbarMessages: SnackbarMessages = {
    successMsg: t('fileUpload.submitted'),
    errorMsg: t('fileUpload.submitted.error'),
  }

  const waygate = getWaygateToggles().WG_UploadFile

  useBeforeNavBackListener(navigation, (e) => {
    if (filesList?.length === 0 || filesUploadedSuccess || (!waygate.enabled && waygate.type === 'DenyContent')) {
      return
    }
    e.preventDefault()
    confirmAlert({
      title: t('fileUpload.discard.confirm.title'),
      message: t('fileUpload.discard.confirm.message'),
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
    if (filesUploadedSuccess) {
      navigateTo('FileRequest', { claimID: claim?.id || '' })
    }
  }, [filesUploadedSuccess, claim, navigateTo])

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

  const onUploadConfirmed = () => {
    logAnalyticsEvent(Events.vama_evidence_cont_3(claim?.id || '', request.trackedItemId || null, request.type, 'file'))
    const mutateOptions = {
      onMutate: () => {
        logAnalyticsEvent(Events.vama_claim_upload_start(claimID, request.trackedItemId || null, request.type, 'file'))
      },
      onSuccess: () => {
        setFilesList([])
        setFilesUploadedSuccess(true)
        logAnalyticsEvent(Events.vama_claim_upload_compl(claimID, request.trackedItemId || null, request.type, 'file'))
        showSnackBar(snackbarMessages.successMsg, dispatch, undefined, true)
      },
      onError: () => showSnackBar(snackbarMessages.errorMsg, dispatch, onUploadConfirmed, false, true),
    }
    const params: UploadFileToClaimParamaters = { claimID, request, files: filesList }
    uploadFileToClaim(params, mutateOptions)
  }

  const onUpload = (): void => {
    const totalSize = filesList.reduce((sum, file) => sum + file.size, 0)
    logAnalyticsEvent(
      Events.vama_evidence_cont_2(
        claim?.id || '',
        request.trackedItemId || null,
        request.type,
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
      Events.vama_evidence_type(claim?.id || '', request.trackedItemId || null, request.type, 'file', typeLabel),
    )
    setDocumentType(selectedType)
  }

  const onCheckboxChange = (isChecked: boolean) => {
    if (isChecked) {
      logAnalyticsEvent(Events.vama_evidence_conf(claim?.id || '', request.trackedItemId || null, request.type, 'file'))
    }
    setConfirmed(isChecked)
  }

  const onFileDelete = () => {
    setFilesList([])
    showSnackBar(t('fileRemoved'), dispatch, undefined, true, false, false)
    navigateTo('SelectFile', { claimID: claim?.id || '', request, focusOnSnackbar: true })
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
          Events.vama_evidence_cancel_2(claim?.id || '', request.trackedItemId || null, request.type, 'file'),
        )
        navigation.dispatch(StackActions.pop(2))
      }}>
      {loadingFileUpload ? (
        <LoadingComponent text={t('fileUpload.loading')} />
      ) : (
        <>
          <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
            <TextView variant="MobileBodyBold" accessibilityRole="header">
              {request.displayName}
            </TextView>
          </Box>
          <FileList files={[fileUploaded]} onDelete={onFileDelete} />
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

export default UploadFileDeprecated
