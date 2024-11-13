import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Share } from 'react-native'
import { useSelector } from 'react-redux'

import { StackScreenProps } from '@react-navigation/stack'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'
import _ from 'underscore'

import {
  Box,
  ButtonDecoratorType,
  FeatureLandingTemplate,
  LoadingComponent,
  SimpleList,
  SimpleListItemObj,
} from 'components'
import AppVersionAndBuild from 'components/AppVersionAndBuild'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { RootState } from 'store'
import { AuthState, logout, setBiometricsPreference } from 'store/slices'
import { DemoState } from 'store/slices/demoSlice'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import getEnv from 'utils/env'
import { getSupportedBiometricA11yLabel, getSupportedBiometricText } from 'utils/formattingUtils'
import { useAppDispatch, useDestructiveActionSheet, useExternalLink, useRouteNavigation, useTheme } from 'utils/hooks'

const { SHOW_DEBUG_MENU, LINK_URL_PRIVACY_POLICY, APPLE_STORE_LINK, GOOGLE_PLAY_LINK } = getEnv()

type SettingsScreenProps = StackScreenProps<HomeStackParamList, 'Settings'>

function SettingsScreen({ navigation }: SettingsScreenProps) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const launchExternalLink = useExternalLink()
  const { canStoreWithBiometric, shouldStoreWithBiometric, settingBiometricPreference, supportedBiometric } =
    useSelector<RootState, AuthState>((state) => state.auth)
  const { demoMode } = useSelector<RootState, DemoState>((state) => state.demo)
  const dispatchLogout = useAppDispatch()
  const signOutAlert = useDestructiveActionSheet()
  const _logout = () => {
    dispatchLogout(logout())
  }

  const onShowConfirm = (): void => {
    logAnalyticsEvent(Events.vama_click(t('logout.title'), t('settings.title')))
    signOutAlert({
      title: t('logout.confirm.text'),
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      buttons: [
        {
          text: t('cancel'),
        },
        {
          text: t('logout.title'),
          onPress: _logout,
        },
      ],
    })
  }

  const onToggleTouchId = (): void => {
    // toggle the value from previous state
    const newPrefValue = !shouldStoreWithBiometric
    dispatch(setBiometricsPreference(newPrefValue))
  }

  const supportedBiometricText = getSupportedBiometricText(supportedBiometric || '', t)
  const supportedBiometricA11yLabel = getSupportedBiometricA11yLabel(supportedBiometric || '', t)

  const biometricRow: SimpleListItemObj = {
    text: t('biometric.title', { biometricType: supportedBiometricText }),
    a11yHintText: t('biometric.a11yHint', { biometricType: supportedBiometricText }),
    onPress: onToggleTouchId,
    decorator: ButtonDecoratorType.Switch,
    decoratorProps: {
      on: shouldStoreWithBiometric,
      a11yHint: t('biometric.a11yHint', { biometricType: supportedBiometricText }),
    },
    testId: t('biometric.title', { biometricType: supportedBiometricA11yLabel }),
  }

  const onShare = async (): Promise<void> => {
    logAnalyticsEvent(Events.vama_click(t('shareApp.title'), t('settings.title')))
    try {
      await Share.share({
        message: t('shareApp.text', { appleStoreLink: APPLE_STORE_LINK, googlePlayLink: GOOGLE_PLAY_LINK }),
      })
    } catch (e) {
      logNonFatalErrorToFirebase(e, 'onShare: Settings Error')
      console.error(e)
    }
  }

  const onPrivacyPolicy = async (): Promise<void> => {
    launchExternalLink(LINK_URL_PRIVACY_POLICY)
  }

  const onFeedback = () => {
    // logAnalyticsEvent(Events.vama_feedback_page_entered())
    navigateTo('InAppFeedback')
  }

  const items: Array<SimpleListItemObj> = _.flatten([
    { text: t('accountSecurity'), onPress: () => navigateTo('AccountSecurity'), detoxTestID: 'accountSecurityID' },
    // don't even show the biometrics option if it's not available
    canStoreWithBiometric ? biometricRow : [],
    {
      text: t('notifications.title'),
      onPress: () => navigateTo('NotificationsSettings'),
      detoxTestID: 'notificationsID',
    },
    { text: t('shareApp.title'), a11yHintText: t('shareApp.a11yHint'), detoxTestID: 'shareAppID', onPress: onShare },
    {
      text: t('inAppRecruitment.userResearch'),
      a11yHintText: t('inAppRecruitment.userResearch.a11yHint'),
      onPress: () => navigateTo('InAppRecruitment'),
      detoxTestID: 'inAppRecruitmentID',
    },
    {
      text: t('privacyPolicy.title'),
      a11yHintText: t('privacyPolicy.a11yHint'),
      onPress: onPrivacyPolicy,
      detoxTestID: 'privacyPolicyID',
    },
    { text: t('inAppFeedback.title'), a11yHintText: t('inAppFeedback.a11yHint'), onPress: onFeedback },
  ])

  const debugMenu = (): ReactNode => {
    const debugButton: Array<SimpleListItemObj> = [
      {
        text: t('debug.title'),
        onPress: () => navigateTo('Developer'),
      },
    ]

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <SimpleList items={debugButton} />
      </Box>
    )
  }

  const loadingCheck = settingBiometricPreference

  return (
    <FeatureLandingTemplate
      backLabel={t('profile.title')}
      backLabelOnPress={navigation.goBack}
      title={t('settings.title')}
      testID="settingsID">
      {loadingCheck ? (
        <LoadingComponent text={t('biometricsPreference.saving')} />
      ) : (
        <>
          <Box mb={theme.dimensions.contentMarginBottom} flex={1}>
            <Box mb={theme.dimensions.standardMarginBetween}>
              <SimpleList items={items} />
              {(SHOW_DEBUG_MENU || demoMode) && debugMenu()}
            </Box>
            <Box px={theme.dimensions.gutter}>
              <Button
                onPress={onShowConfirm}
                label={t('logout.title')}
                buttonType={ButtonVariants.Destructive}
                testID="signOutButtonID"
              />
            </Box>
          </Box>
          <AppVersionAndBuild />
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default SettingsScreen
