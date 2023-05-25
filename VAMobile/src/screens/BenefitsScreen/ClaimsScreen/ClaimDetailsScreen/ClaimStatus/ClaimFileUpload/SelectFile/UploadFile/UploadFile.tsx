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
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { SnackbarMessages } from 'components/SnackBar'
import { VATheme } from 'styles/theme'
import { showSnackBar } from 'utils/common'
import { useBeforeNavBackListener, useDestructiveAlert } from 'utils/hooks'
import { useTheme } from 'utils/hooks'
import FileList from 'components/FileList'
import FullScreenSubtask from 'components/Templates/FullScreenSubtask'

type UploadFileProps = StackScreenProps<BenefitsStackParamList, 'UploadFile'>

const UploadFile: FC<UploadFileProps> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme() as VATheme
  const { request: originalRequest, fileUploaded } = route.params
  const { claim, filesUploadedSuccess, fileUploadedFailure, loadingFileUpload } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const dispatch = useDispatch()
  const [filesList, setFilesList] = useState<DocumentPickerResponse[]>([fileUploaded])
  const confirmAlert = useDestructiveAlert()
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
          text: t('cancel'),
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
    dispatch(uploadFileToClaim(claim?.id || '', snackbarMessages, request, filesList))
  }

  const onUpload = (): void => {
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

  const onFileDelete = () => {
    setFilesList([])
    showSnackBar(t('file.deleted'), dispatch, undefined, true, false, false)
    navigation.navigate('SelectFile', { request, focusOnSnackbar: true })
  }

  const pickerField: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.Picker,
      fieldProps: {
        selectedValue: documentType,
        onSelectionChange: setDocumentType,
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
        onSelectionChange: setConfirmed,
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
        navigation.dispatch(StackActions.pop(2))
      }}>
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
    </FullScreenSubtask>
  )
}

export default UploadFile
