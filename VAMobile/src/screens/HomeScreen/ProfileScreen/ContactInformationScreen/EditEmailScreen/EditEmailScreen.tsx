import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useRef, useState } from 'react'

import { AlertBox, Box, ButtonTypesConstants, FieldType, FormFieldType, FormWrapper, FullScreenSubtask, LoadingComponent, VAButton } from 'components'
import { EMAIL_REGEX_EXP } from 'constants/common'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { SaveEmailData } from 'api/types'
import { SnackbarMessages } from 'components/SnackBar'
import { isErrorObject, showSnackBar } from 'utils/common'
import { useAlert, useAppDispatch, useBeforeNavBackListener, useDestructiveActionSheet, useIsScreenReaderEnabled, useTheme } from 'utils/hooks'
import { useContactInformation, useDeleteEmail, useSaveEmail } from 'api/contactInformation'

type EditEmailScreenProps = StackScreenProps<HomeStackParamList, 'EditEmail'>

/**
 * Screen for editing a users email in the personal info section
 */
const EditEmailScreen: FC<EditEmailScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { data: contactInformation } = useContactInformation()
  const { mutate: saveEmail, isLoading: savingEmail, isSuccess: emailSaved } = useSaveEmail()
  const { mutate: deleteEmail, isLoading: deletingEmail, isSuccess: emailDeleted } = useDeleteEmail()
  const emailId = contactInformation?.contactEmail?.id
  const deleteEmailAlert = useAlert()
  const confirmAlert = useDestructiveActionSheet()
  const screenReaderEnabled = useIsScreenReaderEnabled()

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

  const onSave = (): void => {
    const emailData: SaveEmailData = { emailAddress: email, id: emailId }

    const mutateOptions = {
      onSuccess: () => showSnackBar(saveSnackbarMessages.successMsg, dispatch, undefined, true, false, true),
      onError: (error: unknown) => {
        if (isErrorObject(error)) {
          if (error.status === 400) {
            showSnackBar(saveSnackbarMessages.errorMsg, dispatch, undefined, true, true)
          } else {
            showSnackBar(saveSnackbarMessages.errorMsg, dispatch, () => saveEmail(emailData, mutateOptions), false, true)
          }
        }
      },
    }
    saveEmail(emailData, mutateOptions)
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

  if (savingEmail || deletingEmail) {
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
            <VAButton onPress={onDeletePressed} label={t('contactInformation.removeData', { pageName: emailTitle })} buttonType={ButtonTypesConstants.buttonDestructive} />
          </Box>
        )}
        {formContainsError && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertBox scrollViewRef={scrollViewRef} title={t('editEmail.alertError')} border="error" focusOnError={onSaveClicked} />
          </Box>
        )}
        <FormWrapper fieldsList={formFieldsList} onSave={onSave} setFormContainsError={setFormContainsError} onSaveClicked={onSaveClicked} setOnSaveClicked={setOnSaveClicked} />
      </Box>
    </FullScreenSubtask>
  )
}

export default EditEmailScreen
