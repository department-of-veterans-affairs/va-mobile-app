import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useRef, useState } from 'react'

import { AlertBox, Box, ButtonTypesConstants, ErrorComponent, FieldType, FormFieldType, FormWrapper, FullScreenSubtask, LoadingComponent, VAButton } from 'components'
import { EMAIL_REGEX_EXP } from 'constants/common'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, deleteEmail, finishEditEmail, updateEmail } from 'store/slices'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SnackbarMessages } from 'components/SnackBar'
import { useAppDispatch, useDestructiveAlert, useError, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

type EditEmailScreenProps = StackScreenProps<HomeStackParamList, 'EditEmail'>

/**
 * Screen for editing a users email in the personal info section
 */
const EditEmailScreen: FC<EditEmailScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
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
    successMsg: t('contactInformation.emailAddress.saved'),
    errorMsg: t('contactInformation.emailAddress.not.saved'),
  }

  const saveEmail = (): void => {
    dispatch(updateEmail(saveSnackbarMessages, email, emailId, ScreenIDTypesConstants.EDIT_EMAIL_SCREEN_ID))
  }

  const removeSnackbarMessages: SnackbarMessages = {
    successMsg: t('contactInformation.emailAddress.removed'),
    errorMsg: t('contactInformation.emailAddress.not.removed'),
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
    return (
      <FullScreenSubtask title={t('contactInformation.emailAddress')} leftButtonText={t('cancel')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.EDIT_EMAIL_SCREEN_ID} />
      </FullScreenSubtask>
    )
  }

  if (loading || emailSaved) {
    const loadingText = deleting ? t('contactInformation.delete.emailAddress') : t('contactInformation.savingEmailAddress')

    return <LoadingComponent text={loadingText} />
  }

  const isEmailInvalid = (): boolean => {
    // return true if the email does not contain the @ character
    const validEmailCondition = EMAIL_REGEX_EXP
    return !validEmailCondition.test(email)
  }

  const emailChanged = (): boolean => {
    const originalEmail = profile?.contactEmail?.emailAddress || ''
    return email !== originalEmail
  }

  const formFieldsList: Array<FormFieldType<unknown>> = [
    {
      fieldType: FieldType.TextInput,
      fieldProps: {
        inputType: 'email',
        labelKey: 'contactInformation.email',
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

  const emailTitle = t('contactInformation.emailAddress').toLowerCase()

  const onDeletePressed = (): void => {
    deleteEmailAlert({
      title: t('contactInformation.areYouSureYouWantToDelete', { alertText: emailTitle }),
      message: t('contactInformation.deleteDataInfo', { alertText: emailTitle }),
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      buttons: [
        {
          text: t('cancel'),
        },
        {
          text: t('remove'),
          onPress: onDelete,
        },
      ],
    })
  }

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={t('contactInformation.emailAddress')}
      leftButtonText={t('cancel')}
      onLeftButtonPress={!emailChanged() ? navigation.goBack : undefined}
      rightButtonText={t('save')}
      onRightButtonPress={() => setOnSaveClicked(true)}
      rightButtonDisabled={saveDisabled}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {profile?.contactEmail?.emailAddress && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <VAButton
              onPress={onDeletePressed}
              label={t('contactInformation.removeData', { pageName: emailTitle })}
              buttonType={ButtonTypesConstants.buttonDestructive}
              a11yHint={t('contactInformation.removeData.a11yHint', { pageName: emailTitle })}
            />
          </Box>
        )}
        {formContainsError && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertBox scrollViewRef={scrollViewRef} title={t('editEmail.alertError')} border="error" focusOnError={onSaveClicked} />
          </Box>
        )}
        <FormWrapper fieldsList={formFieldsList} onSave={saveEmail} setFormContainsError={setFormContainsError} onSaveClicked={onSaveClicked} setOnSaveClicked={setOnSaveClicked} />
      </Box>
    </FullScreenSubtask>
  )
}

export default EditEmailScreen
