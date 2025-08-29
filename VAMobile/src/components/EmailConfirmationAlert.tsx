import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useContactInformation } from 'api/contactInformation'
import { AlertWithHaptics, Box } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { SettingsState, updateDisplayEmailConfirmationAlert } from 'store/slices'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'

export const CONFIRM_EMAIL_ALERT_DISMISSED = '@confirm_email_alert_dismissed'

export type EmailConfirmationAlertProps = {
  /** A different variation of the alert is shown within the contact information screen */
  inContactInfoScreen?: boolean
}

const EmailConfirmationAlert: FC<EmailConfirmationAlertProps> = ({ inContactInfoScreen }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const snackbar = useSnackbar()
  const { data: contactInformation, isFetching: loadingContactInformation } = useContactInformation()
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { displayEmailConfirmationAlert } = useSelector<RootState, SettingsState>((state) => state.settings)
  const { t } = useTranslation(NAMESPACE.COMMON)

  // const [displayEmailConfirmation, setDisplayEmailConfirmation] = useState(false)

  useEffect(() => {
    const checkEmailConfirmAlertDismissed = async () => {
      const dismissed = await AsyncStorage.getItem(CONFIRM_EMAIL_ALERT_DISMISSED)
      if (!dismissed) {
        dispatch(updateDisplayEmailConfirmationAlert(true))
      }
    }
    checkEmailConfirmAlertDismissed()
  }, [dispatch])

  const handleDismiss = (): void => {
    AsyncStorage.setItem(CONFIRM_EMAIL_ALERT_DISMISSED, 'true')
    dispatch(updateDisplayEmailConfirmationAlert(false))
  }

  const enrolledInVAHealthCare =
    userAuthorizedServices?.appointments ||
    userAuthorizedServices?.secureMessaging ||
    userAuthorizedServices?.prescriptions ||
    userAuthorizedServices?.scheduleAppointments

  const emailOnFile = contactInformation?.contactEmail?.emailAddress

  const headerText = emailOnFile ? t('email.alert.confirm.title') : t('email.alert.add.title')
  const descriptionText = emailOnFile
    ? t('email.alert.confirm.body', { email: emailOnFile })
    : t('email.alert.add.body')
  const primaryButtonText = emailOnFile ? t('confirm') : t('email.alert.add.primary.action')
  const secondaryButtonText = emailOnFile
    ? t('email.alert.confirm.secondary.action')
    : t('email.alert.add.secondary.action')

  const onPrimaryAction = () => {
    if (emailOnFile) {
      handleDismiss()
      snackbar.show(t('email.alert.confirm.primary.action.snackbar'))
    } else {
      navigateTo('EditEmail')
    }
  }

  const onSecondaryAction = () => {
    if (emailOnFile) {
      navigateTo('EditEmail')
    } else {
      handleDismiss()
      snackbar.show(t('email.alert.add.secondary.action.snackbar'))
    }
  }

  if (!enrolledInVAHealthCare || !displayEmailConfirmationAlert || loadingContactInformation) {
    return <></>
  }

  // A different variation of the alert is shown within the contact information screen
  if (inContactInfoScreen) {
    const headerInContactScreen = emailOnFile
      ? t('email.alert.contact.confirm.title')
      : t('email.alert.contact.add.title')
    return (
      <AlertWithHaptics
        variant="warning"
        header={headerInContactScreen}
        primaryButton={emailOnFile ? { label: primaryButtonText, onPress: handleDismiss } : undefined}
      />
    )
  }

  return (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <AlertWithHaptics
        variant="warning"
        header={headerText}
        description={descriptionText}
        primaryButton={{ label: primaryButtonText, onPress: onPrimaryAction }}
        secondaryButton={{ label: secondaryButtonText, onPress: onSecondaryAction }}
      />
    </Box>
  )
}
export default EmailConfirmationAlert
