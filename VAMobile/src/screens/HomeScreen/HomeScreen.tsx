import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import { Linking } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useFocusEffect } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useCallback } from 'react'

import { AppointmentsState, ClaimsAndAppealsState, DisabilityRatingState, LettersState, PrescriptionState, getLetterBeneficiaryData, prefetchClaimsAndAppeals } from 'store/slices'
import { Box, CategoryLanding, EncourageUpdateAlert, LargeNavButton, Nametag, SimpleList, SimpleListItemObj, TextView, VAIconProps } from 'components'
import { CloseSnackbarOnNavigation } from 'constants/common'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { Events } from 'constants/analytics'
import { FEATURE_LANDING_TEMPLATE_OPTIONS } from 'constants/screens'
import { HomeStackParamList } from './HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getInbox, loadAllPrescriptions, prefetchAppointments } from 'store/slices'
import { getInboxUnreadCount } from 'screens/HealthScreen/SecureMessaging/SecureMessaging'
import { getUpcomingAppointmentDateRange } from 'screens/HealthScreen/Appointments/Appointments'
import { logAnalyticsEvent } from 'utils/analytics'
import { logCOVIDClickAnalytics } from 'store/slices/vaccineSlice'
import { roundToHundredthsPlace } from 'utils/formattingUtils'
import { useAppDispatch, useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import ContactInformationScreen from './ProfileScreen/ContactInformationScreen'
import ContactVAScreen from './ContactVAScreen/ContactVAScreen'
import DeveloperScreen from './ProfileScreen/SettingsScreen/DeveloperScreen'
import HapticsDemoScreen from './ProfileScreen/SettingsScreen/DeveloperScreen/HapticsDemoScreen'
import ManageYourAccount from './ProfileScreen/SettingsScreen/ManageYourAccount/ManageYourAccount'
import MilitaryInformationScreen from './ProfileScreen/MilitaryInformationScreen'
import NotificationsSettingsScreen from './ProfileScreen/SettingsScreen/NotificationsSettingsScreen/NotificationsSettingsScreen'
import PersonalInformationScreen from './ProfileScreen/PersonalInformationScreen'
import ProfileScreen from './ProfileScreen/ProfileScreen'
import RemoteConfigScreen from './ProfileScreen/SettingsScreen/DeveloperScreen/RemoteConfigScreen'
import SandboxScreen from './ProfileScreen/SettingsScreen/DeveloperScreen/SandboxScreen/SandboxScreen'
import SettingsScreen from './ProfileScreen/SettingsScreen'
import getEnv from 'utils/env'

const { WEBVIEW_URL_CORONA_FAQ, WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>

export const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const { upcomingAppointmentsCount } = useSelector<RootState, AppointmentsState>((state) => state.appointments)
  const { prescriptionStatusCount } = useSelector<RootState, PrescriptionState>((state) => state.prescriptions)
  const { activeClaimsCount } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const unreadMessageCount = useSelector<RootState, number>(getInboxUnreadCount)
  const { letterBeneficiaryData } = useSelector<RootState, LettersState>((state) => state.letters)
  const { ratingData } = useSelector<RootState, DisabilityRatingState>((state) => state.disabilityRating)
  const appointmentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appointments)
  const claimsInDowntime = useDowntime(DowntimeFeatureTypeConstants.claims)
  const rxInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const smInDowntime = useDowntime(DowntimeFeatureTypeConstants.secureMessaging)
  const lettersInDowntime = useDowntime(DowntimeFeatureTypeConstants.letters)
  const { data: userAuthorizedServices } = useAuthorizedServices()

  useFocusEffect(
    useCallback(() => {
      if (userAuthorizedServices?.appointments && !appointmentsInDowntime) {
        dispatch(prefetchAppointments(getUpcomingAppointmentDateRange(), undefined, undefined, true))
      }
    }, [dispatch, appointmentsInDowntime, userAuthorizedServices?.appointments]),
  )

  useFocusEffect(
    useCallback(() => {
      if ((userAuthorizedServices?.claims || userAuthorizedServices?.appeals) && !claimsInDowntime) {
        dispatch(prefetchClaimsAndAppeals(undefined, true))
      }
    }, [dispatch, claimsInDowntime, userAuthorizedServices?.claims, userAuthorizedServices?.appeals]),
  )

  useFocusEffect(
    useCallback(() => {
      if (userAuthorizedServices?.prescriptions && !rxInDowntime) {
        dispatch(loadAllPrescriptions())
      }
    }, [dispatch, rxInDowntime, userAuthorizedServices?.prescriptions]),
  )

  useFocusEffect(
    useCallback(() => {
      if (userAuthorizedServices?.secureMessaging && !smInDowntime) {
        dispatch(getInbox())
      }
    }, [dispatch, smInDowntime, userAuthorizedServices?.secureMessaging]),
  )

  useFocusEffect(
    useCallback(() => {
      if (userAuthorizedServices?.lettersAndDocuments && !lettersInDowntime) {
        dispatch(getLetterBeneficiaryData())
      }
    }, [dispatch, lettersInDowntime, userAuthorizedServices?.lettersAndDocuments]),
  )

  const onContactVA = navigateTo('ContactVA')
  const onFacilityLocator = () => {
    logAnalyticsEvent(Events.vama_find_location())
    navigation.navigate('Webview', {
      url: WEBVIEW_URL_FACILITY_LOCATOR,
      displayTitle: t('webview.vagov'),
      loadingMessage: t('webview.valocation.loading'),
    })
  }
  const onCoronaVirusFAQ = () => {
    dispatch(logCOVIDClickAnalytics('home_screen'))
    navigation.navigate('Webview', { url: WEBVIEW_URL_CORONA_FAQ, displayTitle: t('webview.vagov'), loadingMessage: t('webview.covidUpdates.loading') })
  }

  const buttonDataList: Array<SimpleListItemObj> = [
    { text: t('contactVA.title'), onPress: onContactVA, testId: a11yLabelVA(t('contactVA.title')) },
    {
      text: t('findLocation.title'),
      onPress: onFacilityLocator,
      testId: a11yLabelVA(t('findLocation.title')),
    },
    { text: t('covid19Updates.title'), onPress: onCoronaVirusFAQ, testId: t('covid19Updates.title') },
  ]

  const profileIconProps: VAIconProps = {
    name: 'ProfileSelected',
  }

  const headerButton = {
    label: t('profile.title'),
    icon: profileIconProps,
    onPress: navigateTo('Profile'),
  }

  return (
    <CategoryLanding headerButton={headerButton}>
      <Box flex={1} justifyContent="flex-start">
        <EncourageUpdateAlert />
        <Nametag />
        {Number(upcomingAppointmentsCount) > 0 && (
          <Box mx={theme.dimensions.gutter} mb={theme.dimensions.condensedMarginBetween}>
            <LargeNavButton
              title={`${t('appointments')}`}
              subText={`(${upcomingAppointmentsCount} ${t('upcoming')})`}
              onPress={() => Linking.openURL('vamobile://appointments')}
              borderWidth={theme.dimensions.buttonBorderWidth}
            />
          </Box>
        )}
        {Number(prescriptionStatusCount.isRefillable) > 0 && (
          <Box mx={theme.dimensions.gutter} mb={theme.dimensions.condensedMarginBetween}>
            <LargeNavButton
              title={`${t('prescription.title')}`}
              subText={`(${prescriptionStatusCount.isRefillable} ${t('active')})`}
              onPress={() => Linking.openURL('vamobile://prescriptions')}
              borderWidth={theme.dimensions.buttonBorderWidth}
            />
          </Box>
        )}
        {Number(activeClaimsCount) > 0 && (
          <Box mx={theme.dimensions.gutter} mb={theme.dimensions.condensedMarginBetween}>
            <LargeNavButton
              title={`${t('claims.title')}`}
              subText={`(${activeClaimsCount} ${t('open')})`}
              onPress={() => Linking.openURL('vamobile://claims')}
              borderWidth={theme.dimensions.buttonBorderWidth}
            />
          </Box>
        )}
        {!!unreadMessageCount && (
          <Box mx={theme.dimensions.gutter} mb={theme.dimensions.condensedMarginBetween}>
            <LargeNavButton
              title={`${t('messages')}`}
              subText={`${unreadMessageCount} ${t('unread')}`}
              onPress={() => Linking.openURL('vamobile://messages')}
              borderWidth={theme.dimensions.buttonBorderWidth}
            />
          </Box>
        )}
        {!!ratingData?.combinedDisabilityRating && (
          <Box mx={theme.dimensions.gutter} mb={theme.dimensions.condensedMarginBetween}>
            <TextView variant={'MobileBodyBold'}>{t('disabilityRating.title')}</TextView>
            <TextView>{`${t('disabilityRating.combinePercent', { combinedPercent: ratingData.combinedDisabilityRating })}`}</TextView>
          </Box>
        )}
        {!!letterBeneficiaryData?.benefitInformation.monthlyAwardAmount && (
          <Box mx={theme.dimensions.gutter} mb={theme.dimensions.condensedMarginBetween}>
            <TextView variant={'MobileBodyBold'}>{t('monthlyPayment')}</TextView>
            <TextView>{`$${roundToHundredthsPlace(letterBeneficiaryData.benefitInformation.monthlyAwardAmount)}`}</TextView>
          </Box>
        )}
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.condensedMarginBetween}>
          <TextView variant={'MobileBodyBold'} accessibilityLabel={a11yLabelVA(t('aboutVA'))}>
            {t('aboutVA')}
          </TextView>
        </Box>
        <Box mb={theme.dimensions.contentMarginBottom}>
          <SimpleList items={buttonDataList} />
        </Box>
      </Box>
    </CategoryLanding>
  )
}

type HomeStackScreenProps = Record<string, unknown>

const HomeScreenStack = createStackNavigator()

/**
 * Stack screen for the Home tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
const HomeStackScreen: FC<HomeStackScreenProps> = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const screenOptions = {
    headerShown: false,
    // Use horizontal slide transition on Android instead of default crossfade
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  }

  return (
    <HomeScreenStack.Navigator
      screenOptions={screenOptions}
      screenListeners={{
        transitionStart: (e) => {
          if (e.data.closing) {
            CloseSnackbarOnNavigation(e.target)
          }
        },
        blur: (e) => {
          CloseSnackbarOnNavigation(e.target)
        },
      }}>
      <HomeScreenStack.Screen name="Home" component={HomeScreen} options={{ title: t('home.title') }} />
      <HomeScreenStack.Screen name="ContactVA" component={ContactVAScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <HomeScreenStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <HomeScreenStack.Screen name="PersonalInformation" component={PersonalInformationScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <HomeScreenStack.Screen name="ContactInformation" component={ContactInformationScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <HomeScreenStack.Screen name="MilitaryInformation" component={MilitaryInformationScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <HomeScreenStack.Screen name="Settings" component={SettingsScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <HomeScreenStack.Screen name="ManageYourAccount" component={ManageYourAccount} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <HomeScreenStack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <HomeScreenStack.Screen name="Developer" component={DeveloperScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <HomeScreenStack.Screen name="RemoteConfig" component={RemoteConfigScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <HomeScreenStack.Screen name="Sandbox" component={SandboxScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <HomeScreenStack.Screen name="HapticsDemoScreen" component={HapticsDemoScreen} options={{ headerShown: false }} />
    </HomeScreenStack.Navigator>
  )
}

export default HomeStackScreen
