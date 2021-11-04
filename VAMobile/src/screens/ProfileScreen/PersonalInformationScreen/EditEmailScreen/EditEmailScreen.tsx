import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { AlertBox, BackButton, Box, ErrorComponent, FieldType, FocusedNavHeaderText, FormFieldType, FormWrapper, LoadingComponent, SaveButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { NAMESPACE } from 'constants/namespaces'
import { RootNavStackParamList } from 'App'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { deleteEmail, finishEditEmail, updateEmail } from 'store/slices/personalInformationSlice'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useAppSelector, useError, useTheme, useTranslation } from 'utils/hooks'
import RemoveData from '../../RemoveData'

type EditEmailScreenProps = StackScreenProps<RootNavStackParamList, 'EditEmail'>

/**
 * Screen for editing a users email in the personal info section
 */
const EditEmailScreen: FC<EditEmailScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const { profile, emailSaved, loading } = useAppSelector((state) => state.personalInformation)
  const emailId = profile?.contactEmail?.id

  const [email, setEmail] = useState(profile?.contactEmail?.emailAddress || '')
  const [formContainsError, setFormContainsError] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saveDisabled, setSaveDisabled] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />,
      headerRight: () => <SaveButton onSave={() => setOnSaveClicked(true)} disabled={saveDisabled} />,
      headerTitle: (headerTitle) => <FocusedNavHeaderText headerTitle={headerTitle.children} />,
    })
  })

  useEffect(() => {
    if (emailSaved) {
      dispatch(finishEditEmail())
      setDeleting(false)
      navigation.goBack()
    }
  }, [emailSaved, navigation, dispatch])

  useEffect(() => {
    setSaveDisabled(formContainsError)
  }, [formContainsError])

  const saveEmail = (): void => {
    dispatch(updateEmail(email, emailId, ScreenIDTypesConstants.EDIT_EMAIL_SCREEN_ID))
  }

  const onDelete = (): void => {
    const originalEmail = profile?.contactEmail?.emailAddress

    if (!originalEmail || !emailId) {
      // Cannot delete an email with no value or ID
      return
    }

    setDeleting(true)
    dispatch(deleteEmail(originalEmail, emailId, ScreenIDTypesConstants.EDIT_EMAIL_SCREEN_ID))
  }

  if (useError(ScreenIDTypesConstants.EDIT_EMAIL_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.EDIT_EMAIL_SCREEN_ID} />
  }

  if (loading || emailSaved) {
    const loadingText = deleting ? t('personalInformation.delete.emailAddress') : t('personalInformation.savingEmailAddress')

    return <LoadingComponent text={loadingText} />
  }

  const isEmailInvalid = (): boolean => {
    // return true if the email does not contain the @ character
    const validEmailCondition = new RegExp(/\S+@\S+/)
    return !validEmailCondition.test(email)
  }

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'email',
        labelKey: 'profile:personalInformation.email',
        onChange: setEmail,
        value: email,
        isRequiredField: true,
      },
      fieldErrorMessage: t('editEmail.fieldError'),
      validationList: [
        {
          validationFunction: isEmailInvalid,
          validationFunctionErrorMessage: t('editEmail.fieldError'),
        },
      ],
    },
  ]

  return (
    <VAScrollView {...testIdProps('Email: Edit-email-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {profile?.contactEmail?.emailAddress && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <RemoveData pageName={t('personalInformation.emailAddress').toLowerCase()} alertText={t('personalInformation.emailAddress').toLowerCase()} confirmFn={onDelete} />
          </Box>
        )}
        {formContainsError && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertBox title={t('editEmail.alertError')} background="noCardBackground" border="error" />
          </Box>
        )}
        <FormWrapper fieldsList={formFieldsList} onSave={saveEmail} setFormContainsError={setFormContainsError} onSaveClicked={onSaveClicked} setOnSaveClicked={setOnSaveClicked} />
      </Box>
    </VAScrollView>
  )
}

export default EditEmailScreen
