import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react'

import {
  AlertBox,
  BackButton,
  Box,
  ButtonTypesConstants,
  ErrorComponent,
  FieldType,
  FocusedNavHeaderText,
  FormFieldType,
  FormWrapper,
  LoadingComponent,
  SaveButton,
  VAButton,
  VAScrollView,
} from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { EMAIL_REGEX_EXP } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, deleteEmail, finishEditEmail, updateEmail } from 'store/slices'
import { RootNavStackParamList } from 'App'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SnackbarMessages } from 'components/SnackBar'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDestructiveAlert, useError, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

type EditEmailScreenProps = StackScreenProps<RootNavStackParamList, 'EditEmail'>

/**
 * Screen for editing a users email in the personal info section
 */
const EditEmailScreen: FC<EditEmailScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.PROFILE)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const { profile, emailSaved, loading } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const emailId = profile?.contactEmail?.id
  const deleteEmailAlert = useDestructiveAlert()

  const [email, setEmail] = useState(profile?.contactEmail?.emailAddress || '')
  const [formContainsError, setFormContainsError] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saveDisabled, setSaveDisabled] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

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

  const saveSnackbarMessages: SnackbarMessages = {
    successMsg: t('personalInformation.emailAddress.saved'),
    errorMsg: t('personalInformation.emailAddress.not.saved'),
  }

  const saveEmail = (): void => {
    dispatch(updateEmail(saveSnackbarMessages, email, emailId, ScreenIDTypesConstants.EDIT_EMAIL_SCREEN_ID))
  }

  const removeSnackbarMessages: SnackbarMessages = {
    successMsg: t('personalInformation.emailAddress.removed'),
    errorMsg: t('personalInformation.emailAddress.not.removed'),
  }

  const onDelete = (): void => {
    const originalEmail = profile?.contactEmail?.emailAddress

    if (!originalEmail || !emailId) {
      // Cannot delete an email with no value or ID
      return
    }

    setDeleting(true)
    dispatch(deleteEmail(removeSnackbarMessages, originalEmail, emailId, ScreenIDTypesConstants.EDIT_EMAIL_SCREEN_ID))
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
    const validEmailCondition = EMAIL_REGEX_EXP
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

  const emailTitle = t('personalInformation.emailAddress').toLowerCase()

  const onDeletePressed = (): void => {
    deleteEmailAlert({
      title: t('personalInformation.areYouSureYouWantToDelete', { alertText: emailTitle }),
      message: t('personalInformation.deleteDataInfo', { alertText: emailTitle }),
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      buttons: [
        {
          text: tc('cancel'),
        },
        {
          text: tc('remove'),
          onPress: onDelete,
        },
      ],
    })
  }

  return (
    <VAScrollView scrollViewRef={scrollViewRef}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {profile?.contactEmail?.emailAddress && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <VAButton
              onPress={onDeletePressed}
              label={t('personalInformation.removeData', { pageName: emailTitle })}
              buttonType={ButtonTypesConstants.buttonDestructive}
              a11yHint={t('personalInformation.removeData.a11yHint', { pageName: emailTitle })}
            />
          </Box>
        )}
        {formContainsError && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertBox scrollViewRef={scrollViewRef} title={t('editEmail.alertError')} border="error" />
          </Box>
        )}
        <FormWrapper fieldsList={formFieldsList} onSave={saveEmail} setFormContainsError={setFormContainsError} onSaveClicked={onSaveClicked} setOnSaveClicked={setOnSaveClicked} />
      </Box>
    </VAScrollView>
  )
}

export default EditEmailScreen
