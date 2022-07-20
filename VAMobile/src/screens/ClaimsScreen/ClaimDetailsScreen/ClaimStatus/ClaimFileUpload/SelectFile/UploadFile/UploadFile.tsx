import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { BackButton, Box, ButtonTypesConstants, FieldType, FormFieldType, FormWrapper, LoadingComponent, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimEventData } from 'store/api'
import { ClaimsAndAppealsState, fileUploadSuccess, uploadFileToClaim } from 'store/slices'
import { ClaimsStackParamList } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { DocumentTypes526 } from 'constants/documentTypes'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { SnackbarMessages } from 'components/SnackBar'
import { showSnackBar } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useBeforeNavBackListener, useDestructiveAlert, useTheme } from 'utils/hooks'
import FileList from 'components/FileList'

type UploadFileProps = StackScreenProps<ClaimsStackParamList, 'UploadFile'>

const UploadFile: FC<UploadFileProps> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.CLAIMS)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { request: originalRequest, fileUploaded } = route.params
  const { claim, filesUploadedSuccess, fileUploadedFailure, loadingFileUpload } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const dispatch = useAppDispatch()
  const [filesList, setFilesList] = useState<DocumentPickerResponse[]>([fileUploaded])
  const confirmAlert = useDestructiveAlert()
  const [request, setRequest] = useState<ClaimEventData>(originalRequest)
  const snackbarMessages: SnackbarMessages = {
    successMsg: t('fileUpload.submitted'),
    errorMsg: t('fileUpload.submitted.error'),
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => <BackButton onPress={onCancel} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />,
    })
  })

  useBeforeNavBackListener(navigation, (e) => {
    if (filesList.length === 0 || filesUploadedSuccess) {
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
          text: tc('cancel'),
        },
        {
          text: t('fileUpload.discard'),
          onPress: () => {
            navigation.dispatch(e.data.action)
          },
        },
      ],
    })
  })

  const onCancel = () => {
    navigation.navigate('FileRequestDetails', { request })
  }

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
    return <LoadingComponent text={t('fileUpload.loading')} />
  }

  const onUploadConfirmed = () => {
    dispatch(uploadFileToClaim(claim?.id || '', snackbarMessages, request, filesList))
  }

  const onUpload = (): void => {
    confirmAlert({
      title: t('fileUpload.submit.confirm.title'),
      message: t('fileUpload.submit.confirm.message'),
      cancelButtonIndex: 0,
      buttons: [
        {
          text: tc('cancel'),
        },
        {
          text: t('fileUpload.submit'),
          onPress: onUploadConfirmed,
        },
      ],
    })
  }

  const onFileDelete = () => {
    setFilesList([])
    showSnackBar(tc('file.deleted'), dispatch, undefined, true, false, false)
    navigation.navigate('SelectFile', { request, focusOnSnackbar: true })
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
      fieldErrorMessage: t('fileUpload.documentType.fieldError'),
    },
    {
      fieldType: FieldType.Selector,
      fieldProps: {
        labelKey: 'claims:fileUpload.evidenceOnly',
        selected: confirmed,
        onSelectionChange: setConfirmed,
        isRequiredField: true,
      },
      fieldErrorMessage: t('fileUpload.evidenceOnly.error'),
    },
  ]

  return (
    <VAScrollView {...testIdProps('File-upload: Upload-file-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
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
            a11yHint={t('fileUpload.uploadFileA11yHint')}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default UploadFile
