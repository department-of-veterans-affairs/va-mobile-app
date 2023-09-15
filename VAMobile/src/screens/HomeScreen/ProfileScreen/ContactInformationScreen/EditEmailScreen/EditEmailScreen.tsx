import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useRef, useState } from 'react'

import { AlertBox, Box, ButtonTypesConstants, ErrorComponent, FieldType, FormFieldType, FormWrapper, FullScreenSubtask, LoadingComponent, VAButton } from 'components'
import { EMAIL_REGEX_EXP } from 'constants/common'
import { EmailData } from 'api/types'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SnackbarMessages } from 'components/SnackBar'
import { isErrorObject, showSnackBar } from 'utils/common'
import { useAlert, useAppDispatch, useBeforeNavBackListener, useDestructiveActionSheet, useDowntimeByScreenID, useIsScreenReaderEnabled, useTheme } from 'utils/hooks'
import { useContactInformation, useDeleteEmail, useUpdateEmail } from 'api/contactInformation'

type EditEmailScreenProps = StackScreenProps<HomeStackParamList, 'EditEmail'>

/**
 * Screen for editing a users email in the personal info section
 */
const EditEmailScreen: FC<EditEmailScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { data: contactInformation } = useContactInformation()
  const { mutate: updateEmail, isLoading: savingEmail, isSuccess: emailSaved } = useUpdateEmail()
  const { mutate: deleteEmail, isLoading: deletingEmail, isSuccess: emailDeleted } = useDeleteEmail()
  const emailId = contactInformation?.contactEmail?.id
  const deleteEmailAlert = useAlert()
  const confirmAlert = useDestructiveActionSheet()
  const screenReaderEnabled = useIsScreenReaderEnabled()
  const contactInformationInDowntime = useDowntimeByScreenID(ScreenIDTypesConstants.EDIT_EMAIL_SCREEN_ID)

  const [email, setEmail] = useState(contactInformation?.contactEmail?.emailAddress || '')
  const [formContainsError, setFormContainsError] = useState(false)
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [saveDisabled, setSaveDisabled] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (emailSaved || emailDeleted) {
      navigation.goBack()
    }
  }, [emailSaved, emailDeleted, navigation])

  useEffect(() => {
    setSaveDisabled(formContainsError)
  }, [formContainsError])

  const saveSnackbarMessages: SnackbarMessages = {
    successMsg: t('contactInformation.emailAddress.saved'),
    errorMsg: t('contactInformation.emailAddress.not.saved'),
  }

  useBeforeNavBackListener(navigation, (e) => {
    if (noPageChanges()) {
      return
    }
    e.preventDefault()
    confirmAlert({
      title: t('contactInformation.emailAddress.deleteChanges'),
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: [
        {
          text: t('keepEditing'),
        },
        {
          text: t('deleteChanges'),
          onPress: () => {
            navigation.dispatch(e.data.action)
          },
        },
      ],
    })
  })

  const noPageChanges = (): boolean => {
    if (contactInformation?.contactEmail?.emailAddress) {
      if (contactInformation?.contactEmail?.emailAddress !== email) {
        return false
      }
    } else if (email) {
      return false
    }
    return true
  }

  const saveEmail = (): void => {
    let emailData: EmailData = { emailAddress: email }
    const newEmail = contactInformation?.contactEmail?.emailAddress

    if (newEmail) {
      emailData = { ...emailData, id: emailId }
    }

    const mutateOptions = {
      onSuccess: () => showSnackBar(saveSnackbarMessages.successMsg, dispatch, undefined, true, false, true),
      onError: (error: unknown) => {
        if (isErrorObject(error)) {
          if (error.status === 400) {
            showSnackBar(saveSnackbarMessages.errorMsg, dispatch, undefined, true, true)
          } else {
            showSnackBar(saveSnackbarMessages.errorMsg, dispatch, () => updateEmail(emailData, mutateOptions), false, true)
          }
        }
      },
    }
    updateEmail(emailData, mutateOptions)
  }

  const removeSnackbarMessages: SnackbarMessages = {
    successMsg: t('contactInformation.emailAddress.removed'),
    errorMsg: t('contactInformation.emailAddress.not.removed'),
  }

  const onDelete = (): void => {
    const originalEmail = contactInformation?.contactEmail?.emailAddress

    if (!originalEmail || !emailId) {
      // Cannot delete an email with no value or ID
      return
    }

    const emailData = {
      id: emailId,
      emailAddress: email,
    }

    const mutateOptions = {
      onSuccess: () => showSnackBar(removeSnackbarMessages.successMsg, dispatch, undefined, true, false, true),
      onError: () => showSnackBar(removeSnackbarMessages.errorMsg, dispatch, () => deleteEmail(emailData, mutateOptions), false, true),
    }
    deleteEmail(emailData, mutateOptions)
  }

  if (contactInformationInDowntime) {
    return (
      <FullScreenSubtask title={t('contactInformation.emailAddress')} leftButtonText={t('cancel')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.EDIT_EMAIL_SCREEN_ID} />
      </FullScreenSubtask>
    )
  }

  if (savingEmail || emailSaved) {
    const loadingText = deletingEmail ? t('contactInformation.delete.emailAddress') : t('contactInformation.savingEmailAddress')

    return (
      <FullScreenSubtask leftButtonText={t('cancel')} onLeftButtonPress={navigation.goBack}>
        <LoadingComponent text={loadingText} />
      </FullScreenSubtask>
    )
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
        labelKey: 'contactInformation.email',
        onChange: setEmail,
        value: email,
        isRequiredField: true,
        testID: 'emailAddressEditTestID',
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
      title: t('contactInformation.removeInformation.title', { info: emailTitle }),
      message: t('contactInformation.removeInformation.body', { info: emailTitle }),
      buttons: [
        {
          text: t('keep'),
        },
        {
          text: t('remove'),
          onPress: onDelete,
        },
      ],
      screenReaderEnabled: screenReaderEnabled,
    })
  }

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={t('contactInformation.emailAddress')}
      leftButtonText={t('cancel')}
      onLeftButtonPress={navigation.goBack}
      rightButtonText={t('save')}
      onRightButtonPress={() => setOnSaveClicked(true)}
      rightButtonDisabled={saveDisabled}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {contactInformation?.contactEmail?.emailAddress && (
          <Box my={theme.dimensions.standardMarginBetween}>
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
