import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button, ButtonVariants, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { useContactInformation, useDeleteEmail, useSaveEmail } from 'api/contactInformation'
import { SaveEmailData } from 'api/types'
import {
  AlertWithHaptics,
  Box,
  FieldType,
  FormFieldType,
  FormWrapper,
  FullScreenSubtask,
  LoadingComponent,
} from 'components'
import { EMAIL_REGEX_EXP } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { isErrorObject } from 'utils/common'
import { useAlert, useBeforeNavBackListener, useDestructiveActionSheet, useTheme } from 'utils/hooks'

type EditEmailScreenProps = StackScreenProps<HomeStackParamList, 'EditEmail'>

/**
 * Screen for editing a users email in the personal info section
 */
function EditEmailScreen({ navigation }: EditEmailScreenProps) {
  const snackbar = useSnackbar()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { data: contactInformation } = useContactInformation()
  const { mutate: saveEmail, isPending: savingEmail, isSuccess: emailSaved } = useSaveEmail()
  const { mutate: deleteEmail, isPending: deletingEmail, isSuccess: emailDeleted } = useDeleteEmail()
  const emailId = contactInformation?.contactEmail?.id
  const deleteEmailAlert = useAlert()
  const confirmAlert = useDestructiveActionSheet()

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
      onSuccess: () => {
        snackbar.show(t('contactInformation.emailAddress.saved'))
      },
      onError: (error: unknown) => {
        if (isErrorObject(error)) {
          if (error.status === 400) {
            snackbar.show(t('contactInformation.emailAddress.not.saved'), {
              isError: true,
              offset: theme.dimensions.snackBarBottomOffset,
            })
          } else {
            snackbar.show(t('contactInformation.emailAddress.not.saved'), {
              isError: true,
              offset: theme.dimensions.snackBarBottomOffset,
              onActionPressed: () => saveEmail(emailData, mutateOptions),
            })
          }
        }
      },
    }
    saveEmail(emailData, mutateOptions)
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
      onSuccess: () => snackbar.show(t('contactInformation.emailAddress.removed')),
      onError: () =>
        snackbar.show(t('contactInformation.emailAddress.not.removed'), {
          isError: true,
          offset: theme.dimensions.snackBarBottomOffset,
          onActionPressed: () => deleteEmail(emailData, mutateOptions),
        }),
    }
    deleteEmail(emailData, mutateOptions)
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
    })
  }

  const loadingCheck = savingEmail || deletingEmail

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={t('contactInformation.emailAddress')}
      leftButtonText={t('cancel')}
      onLeftButtonPress={navigation.goBack}
      rightButtonText={!loadingCheck ? t('save') : undefined}
      onRightButtonPress={!loadingCheck ? () => setOnSaveClicked(true) : undefined}
      rightButtonDisabled={saveDisabled}
      leftButtonTestID="contactInfoBackTestID"
      rightButtonTestID="contactInfoSaveTestID">
      {savingEmail || deletingEmail ? (
        <LoadingComponent
          text={
            deletingEmail ? t('contactInformation.delete.emailAddress') : t('contactInformation.savingEmailAddress')
          }
        />
      ) : (
        <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
          {contactInformation?.contactEmail?.emailAddress && (
            <Box my={theme.dimensions.standardMarginBetween}>
              <Button
                onPress={onDeletePressed}
                label={t('contactInformation.removeData', { pageName: emailTitle })}
                buttonType={ButtonVariants.Destructive}
              />
            </Box>
          )}
          {formContainsError && (
            <Box mb={theme.dimensions.standardMarginBetween}>
              <AlertWithHaptics
                variant="error"
                description={t('editEmail.alertError')}
                focusOnError={onSaveClicked}
                scrollViewRef={scrollViewRef}
              />
            </Box>
          )}
          <FormWrapper
            fieldsList={formFieldsList}
            onSave={onSave}
            setFormContainsError={setFormContainsError}
            onSaveClicked={onSaveClicked}
            setOnSaveClicked={setOnSaveClicked}
          />
        </Box>
      )}
    </FullScreenSubtask>
  )
}

export default EditEmailScreen
