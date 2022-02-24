import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { BackButton, Box, ButtonTypesConstants, FieldType, FormFieldType, FormWrapper, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsStackParamList } from '../../../../../ClaimsStackScreens'
import { DocumentTypes526 } from 'constants/documentTypes'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import FileList from 'components/FileList'

type UploadFileProps = StackScreenProps<ClaimsStackParamList, 'UploadFile'>

const UploadFile: FC<UploadFileProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { request, fileUploaded, imageUploaded } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />,
    })
  })

  const onUpload = navigateTo('UploadConfirmation', { request, filesList: fileUploaded ? [fileUploaded] : [imageUploaded] })

  const [documentType, setDocumentType] = useState('')
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

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
        isRequiredField: true,
        disabled: false,
      },
      fieldErrorMessage: t('claims:fileUpload.documentType.fieldError'),
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
        <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
          {request.displayName}
        </TextView>
      </Box>
      <FileList files={[fileUploaded]} onDelete={() => {}} />
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
