import { StackActions } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Box, ButtonTypesConstants, FieldType, FormFieldType, FormWrapper, LoadingComponent, TextView, VAButton } from 'components'
import { ClaimEventData } from 'store/api'
import { ClaimsAndAppealsState, fileUploadSuccess, uploadFileToClaim } from 'store/slices'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { DocumentTypes526 } from 'constants/documentTypes'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { SnackbarMessages } from 'components/SnackBar'
import { logAnalyticsEvent } from 'utils/analytics'
import { showSnackBar } from 'utils/common'
import { useBeforeNavBackListener, useDestructiveActionSheet, useTheme } from 'utils/hooks'
import FileList from 'components/FileList'
import FullScreenSubtask from 'components/Templates/FullScreenSubtask'

type UploadFileProps = StackScreenProps<BenefitsStackParamList, 'UploadFile'>

const UploadFile: FC<UploadFileProps> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { request: originalRequest, fileUploaded } = route.params
  const { claim, filesUploadedSuccess, fileUploadedFailure, loadingFileUpload } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const dispatch = useDispatch()
  const [filesList, setFilesList] = useState<DocumentPickerResponse[]>([fileUploaded])
  const confirmAlert = useDestructiveActionSheet()
  const [request, setRequest] = useState<ClaimEventData>(originalRequest)
  const snackbarMessages: SnackbarMessages = {
    successMsg: t('fileUpload.submitted'),
    errorMsg: t('fileUpload.submitted.error'),
  }

  useBeforeNavBackListener(navigation, (e) => {
    if (filesList?.length === 0 || filesUploadedSuccess) {
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
    if (fileUploadedFailure || filesUploadedSuccess) {
      dispatch(fileUploadSuccess())
    }

    if (filesUploadedSuccess) {
      setFilesList([])
      navigation.navigate('FileRequest', { claimID: claim?.id || '' })
    }
  }, [filesUploadedSuccess, fileUploadedFailure, dispatch, t, claim, navigation, request, filesList])

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
    logAnalyticsEvent(Events.vama_evidence_cont_3(claim?.id || '', request.trackedItemId || null, request.type, 'file'))
    dispatch(uploadFileToClaim(claim?.id || '', snackbarMessages, request, filesList, 'file'))
  }

  const onUpload = (): void => {
    const totalSize = filesList.reduce((sum, file) => sum + file.size, 0)
    logAnalyticsEvent(Events.vama_evidence_cont_2(claim?.id || '', request.trackedItemId || null, request.type, 'file', totalSize, filesList.length))
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
    logAnalyticsEvent(Events.vama_evidence_type(claim?.id || '', request.trackedItemId || null, request.type, 'file', typeLabel))
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
    navigation.navigate('SelectFile', { claimID: claim?.id || '', request, focusOnSnackbar: true })
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
        logAnalyticsEvent(Events.vama_evidence_cancel_2(claim?.id || '', request.trackedItemId || null, request.type, 'file'))
        navigation.dispatch(StackActions.pop(2))
      }}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {request.displayName}
        </TextView>
      </Box>
      <FileList files={[fileUploaded]} onDelete={onFileDelete} />
      <Box mx={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween}>
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
    </FullScreenSubtask>
  )
}

export default UploadFile
