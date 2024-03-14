import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { useSelector } from 'react-redux'

import { useFocusEffect } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Colors } from '@department-of-veterans-affairs/mobile-tokens'
import { DateTime } from 'luxon'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useFacilitiesInfo } from 'api/facilities/getFacilitiesInfo'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import {
  ActivityButton,
  BackgroundVariant,
  BorderColorVariant,
  Box,
  BoxProps,
  CategoryLanding,
  EncourageUpdateAlert,
  LinkRow,
  LoadingComponent,
  Nametag,
  TextView,
  VAIcon,
  VAIconProps,
} from 'components'
import { Events } from 'constants/analytics'
import { CloseSnackbarOnNavigation } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { FEATURE_LANDING_TEMPLATE_OPTIONS } from 'constants/screens'
import { getUpcomingAppointmentDateRange } from 'screens/HealthScreen/Appointments/Appointments'
import { getInboxUnreadCount } from 'screens/HealthScreen/SecureMessaging/SecureMessaging'
import { RootState } from 'store'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import {
  AppointmentsState,
  ClaimsAndAppealsState,
  DisabilityRatingState,
  LettersState,
  MilitaryServiceState,
  PrescriptionState,
  getLetterBeneficiaryData,
  prefetchClaimsAndAppeals,
} from 'store/slices'
import { AnalyticsState, SecureMessagingState } from 'store/slices'
import { getInbox, loadAllPrescriptions, prefetchAppointments } from 'store/slices'
import colors from 'styles/themes/VAColors'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { roundToHundredthsPlace } from 'utils/formattingUtils'
import { useAppDispatch, useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'

import ContactVAScreen from './ContactVAScreen/ContactVAScreen'
import { HomeStackParamList } from './HomeStackScreens'
import ContactInformationScreen from './ProfileScreen/ContactInformationScreen'
import MilitaryInformationScreen from './ProfileScreen/MilitaryInformationScreen'
import PersonalInformationScreen from './ProfileScreen/PersonalInformationScreen'
import ProfileScreen from './ProfileScreen/ProfileScreen'
import SettingsScreen from './ProfileScreen/SettingsScreen'
import DeveloperScreen from './ProfileScreen/SettingsScreen/DeveloperScreen'
import HapticsDemoScreen from './ProfileScreen/SettingsScreen/DeveloperScreen/HapticsDemoScreen'
import RemoteConfigScreen from './ProfileScreen/SettingsScreen/DeveloperScreen/RemoteConfigScreen'
import SandboxScreen from './ProfileScreen/SettingsScreen/DeveloperScreen/SandboxScreen/SandboxScreen'
import ManageYourAccount from './ProfileScreen/SettingsScreen/ManageYourAccount/ManageYourAccount'
import NotificationsSettingsScreen from './ProfileScreen/SettingsScreen/NotificationsSettingsScreen/NotificationsSettingsScreen'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>

export function HomeScreen({}: HomeScreenProps) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const appointmentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appointments)
  const claimsInDowntime = useDowntime(DowntimeFeatureTypeConstants.claims)
  const rxInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const smInDowntime = useDowntime(DowntimeFeatureTypeConstants.secureMessaging)
  const lettersInDowntime = useDowntime(DowntimeFeatureTypeConstants.letters)

  const { data: facilitiesInfo } = useFacilitiesInfo()
  const cernerFacilities = facilitiesInfo?.filter((f) => f.cerner) || []

  const {
    prescriptionStatusCount,
    loadingHistory: loadingPrescriptions,
    prescriptionFirstRetrieval: rxPrefetch,
  } = useSelector<RootState, PrescriptionState>((state) => state.prescriptions)
  const {
    activeClaimsCount,
    loadingClaimsAndAppeals,
    claimsFirstRetrieval: claimsPrefetch,
  } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const unreadMessageCount = useSelector<RootState, number>(getInboxUnreadCount)
  const { loadingInboxData: loadingInbox, inboxFirstRetrieval: smPrefetch } = useSelector<
    RootState,
    SecureMessagingState
  >((state) => state.secureMessaging)
  const {
    preloadComplete: apptsPrefetch,
    loading: loadingAppointments,
    upcomingAppointmentsCount,
  } = useSelector<RootState, AppointmentsState>((state) => state.appointments)
  const { loading: loadingServiceHistory, mostRecentBranch } = useSelector<RootState, MilitaryServiceState>(
    (state) => state.militaryService,
  )
  const { letterBeneficiaryData, loadingLetterBeneficiaryData } = useSelector<RootState, LettersState>(
    (state) => state.letters,
  )
  const { ratingData, loading: loadingDisabilityRating } = useSelector<RootState, DisabilityRatingState>(
    (state) => state.disabilityRating,
  )
  const { loginTimestamp } = useSelector<RootState, AnalyticsState>((state) => state.analytics)
  const disRating = !!ratingData?.combinedDisabilityRating
  const monthlyPay = !!letterBeneficiaryData?.benefitInformation.monthlyAwardAmount
  const { isLoading: loadingPersonalInfo } = usePersonalInformation()

  useEffect(() => {
    if (apptsPrefetch && !claimsPrefetch && !rxPrefetch && !smPrefetch) {
      logAnalyticsEvent(Events.vama_hs_load_time(DateTime.now().toMillis() - loginTimestamp))
    }
  }, [dispatch, apptsPrefetch, claimsPrefetch, rxPrefetch, smPrefetch, loginTimestamp])

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

  const onFacilityLocator = () => {
    logAnalyticsEvent(Events.vama_find_location())
    navigateTo('Webview', {
      url: WEBVIEW_URL_FACILITY_LOCATOR,
      displayTitle: t('webview.vagov'),
      loadingMessage: t('webview.valocation.loading'),
    })
  }

  const profileIconProps: VAIconProps = {
    name: 'ProfileSelected',
  }

  const onProfile = () => {
    navigateTo('Profile')
  }

  const headerButton = {
    label: t('profile.title'),
    icon: profileIconProps,
    onPress: onProfile,
  }

  const loadingAboutYou = loadingServiceHistory || loadingDisabilityRating || loadingLetterBeneficiaryData
  const hasAboutYouInfo =
    !!ratingData?.combinedDisabilityRating ||
    !!letterBeneficiaryData?.benefitInformation.monthlyAwardAmount ||
    !!mostRecentBranch

  const boxProps: BoxProps = {
    style: {
      shadowColor: colors.black,
      ...Platform.select({
        ios: {
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
  }

  const activityLoading =
    loadingAppointments || loadingClaimsAndAppeals || loadingInbox || loadingPrescriptions || loadingPersonalInfo
  const hasActivity =
    !!upcomingAppointmentsCount || !!activeClaimsCount || !!prescriptionStatusCount.isRefillable || !!unreadMessageCount

  return (
    <CategoryLanding headerButton={headerButton} testID="homeScreenID">
      <Box>
        <EncourageUpdateAlert />
        <Box my={theme.dimensions.standardMarginBetween}>
          <TextView
            mx={theme.dimensions.gutter}
            mb={theme.dimensions.standardMarginBetween}
            variant={'HomeScreenHeader'}
            accessibilityRole="header">
            {t('activity')}
          </TextView>
          {activityLoading ? (
            <Box mx={theme.dimensions.standardMarginBetween}>
              <LoadingComponent
                spinnerWidth={24}
                spinnerHeight={24}
                text={t('activity.loading')}
                inlineSpinner={true}
                spinnerColor={theme.colors.icon.inlineSpinner}
              />
            </Box>
          ) : !hasActivity ? (
            <Box mx={theme.dimensions.standardMarginBetween}>
              <Box
                flexDirection="row"
                alignItems="center"
                mb={theme.dimensions.standardMarginBetween}
                accessible={true}
                accessibilityLabel={`${t('icon.success')} ${t('noActivity')}`}>
                <VAIcon name={'CircleCheckMark'} fill={Colors.green} fill2={theme.colors.icon.transparent} />
                <TextView
                  importantForAccessibility={'no'}
                  ml={theme.dimensions.condensedMarginBetween}
                  variant="HomeScreen">
                  {t('noActivity')}
                </TextView>
              </Box>
              {!!cernerFacilities.length && (
                <TextView
                  variant="ActivityFooter"
                  accessibilityLabel={a11yLabelVA(t('activity.informationNotIncluded'))}>
                  {t('activity.informationNotIncluded')}
                </TextView>
              )}
            </Box>
          ) : (
            <Box gap={theme.dimensions.condensedMarginBetween} mx={theme.dimensions.condensedMarginBetween}>
              {!!upcomingAppointmentsCount && (
                <ActivityButton
                  title={t('appointments')}
                  subText={t('appointments.activityButton.subText', { count: upcomingAppointmentsCount })}
                  deepLink={'appointments'}
                />
              )}
              {!!activeClaimsCount && (
                <ActivityButton
                  title={t('claims.title')}
                  subText={t('claims.activityButton.subText', { count: activeClaimsCount })}
                  deepLink={'claims'}
                />
              )}
              {!!unreadMessageCount && (
                <ActivityButton
                  title={`${t('messages')}`}
                  subText={t('secureMessaging.activityButton.subText', { count: unreadMessageCount })}
                  deepLink={'messages'}
                />
              )}
              {!!prescriptionStatusCount.isRefillable && (
                <ActivityButton
                  title={t('prescription.title')}
                  subText={t('prescriptions.activityButton.subText', {
                    count: prescriptionStatusCount.isRefillable,
                  })}
                  deepLink={'prescriptions'}
                />
              )}
            </Box>
          )}
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween} mb={theme.dimensions.formMarginBetween}>
          <TextView
            mx={theme.dimensions.gutter}
            mb={theme.dimensions.standardMarginBetween}
            variant={'HomeScreenHeader'}
            accessibilityRole="header">
            {t('aboutYou')}
          </TextView>
          {loadingAboutYou ? (
            <Box mx={theme.dimensions.standardMarginBetween}>
              <LoadingComponent
                spinnerWidth={24}
                spinnerHeight={24}
                text={t('aboutYou.loading')}
                inlineSpinner={true}
                spinnerColor={theme.colors.icon.inlineSpinner}
              />
            </Box>
          ) : !hasAboutYouInfo ? (
            <Box
              flexDirection="row"
              alignItems="center"
              mx={theme.dimensions.standardMarginBetween}
              mb={theme.dimensions.standardMarginBetween}
              accessible={true}
              accessibilityRole={'text'}
              accessibilityLabel={t('aboutYou.error') + t('aboutYou.noInformation')}>
              <VAIcon
                accessible={false}
                importantForAccessibility="no"
                name={'ExclamationCircle'}
                fill={theme.colors.icon.homeScreenError}
              />
              <TextView
                ml={theme.dimensions.condensedMarginBetween}
                variant="HomeScreen"
                accessible={false}
                importantForAccessibility="no">
                {t('aboutYou.noInformation')}
              </TextView>
            </Box>
          ) : (
            <>
              <Nametag />
              <Box backgroundColor={theme.colors.background.veteranStatusHome as BackgroundVariant} {...boxProps}>
                {disRating && (
                  <Box
                    pt={theme.dimensions.standardMarginBetween}
                    pb={monthlyPay ? 0 : theme.dimensions.standardMarginBetween}
                    pl={theme.dimensions.standardMarginBetween}>
                    <TextView
                      accessibilityLabel={`${t('disabilityRating.title')} ${t('disabilityRatingDetails.percentage', { rate: ratingData.combinedDisabilityRating })} ${t('disabilityRating.serviceConnected')}`}
                      variant={'VeteranStatusBranch'}>
                      {t('disabilityRating.title')}
                    </TextView>
                    <TextView
                      accessible={false}
                      importantForAccessibility={'no'}
                      variant={
                        'NametagNumber'
                      }>{`${t('disabilityRatingDetails.percentage', { rate: ratingData.combinedDisabilityRating })}`}</TextView>
                    <TextView accessible={false} importantForAccessibility={'no'} variant={'VeteranStatusProof'}>
                      {t('disabilityRating.serviceConnected')}
                    </TextView>
                  </Box>
                )}
                {monthlyPay && disRating && (
                  <Box
                    mx={theme.dimensions.standardMarginBetween}
                    my={theme.dimensions.condensedMarginBetween}
                    borderWidth={1}
                    borderColor={theme.colors.border.aboutYou as BorderColorVariant}
                  />
                )}
                {!!letterBeneficiaryData?.benefitInformation.monthlyAwardAmount && (
                  <Box
                    pt={disRating ? 0 : theme.dimensions.standardMarginBetween}
                    pl={theme.dimensions.standardMarginBetween}
                    pb={theme.dimensions.standardMarginBetween}>
                    <TextView
                      accessibilityLabel={`${t('monthlyCompensationPayment')} $${roundToHundredthsPlace(letterBeneficiaryData.benefitInformation.monthlyAwardAmount)}`}
                      variant={'VeteranStatusBranch'}>
                      {t('monthlyCompensationPayment')}
                    </TextView>
                    <TextView
                      accessible={false}
                      importantForAccessibility={'no'}
                      variant={
                        'NametagNumber'
                      }>{`$${roundToHundredthsPlace(letterBeneficiaryData.benefitInformation.monthlyAwardAmount)}`}</TextView>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween} mb={theme.dimensions.formMarginBetween}>
          <TextView
            mx={theme.dimensions.gutter}
            mb={theme.dimensions.standardMarginBetween}
            variant={'HomeScreenHeader'}
            accessibilityRole="header">
            {t('vaResources')}
          </TextView>
          <Box mx={theme.dimensions.condensedMarginBetween}>
            <LinkRow title={t('contactUs')} onPress={() => navigateTo('ContactVA')} />
            <LinkRow
              title={t('findLocation.title')}
              titleA11yLabel={a11yLabelVA(t('findLocation.title'))}
              onPress={onFacilityLocator}
            />
          </Box>
        </Box>
      </Box>
    </CategoryLanding>
  )
}

type HomeStackScreenProps = Record<string, unknown>

const HomeScreenStack = createStackNavigator<HomeStackParamList>()

/**
 * Stack screen for the Home tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
function HomeStackScreen({}: HomeStackScreenProps) {
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
      <HomeScreenStack.Screen
        name="PersonalInformation"
        component={PersonalInformationScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HomeScreenStack.Screen
        name="ContactInformation"
        component={ContactInformationScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HomeScreenStack.Screen
        name="MilitaryInformation"
        component={MilitaryInformationScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HomeScreenStack.Screen name="Settings" component={SettingsScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <HomeScreenStack.Screen
        name="ManageYourAccount"
        component={ManageYourAccount}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HomeScreenStack.Screen
        name="NotificationsSettings"
        component={NotificationsSettingsScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HomeScreenStack.Screen name="Developer" component={DeveloperScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <HomeScreenStack.Screen
        name="RemoteConfig"
        component={RemoteConfigScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HomeScreenStack.Screen name="Sandbox" component={SandboxScreen} options={FEATURE_LANDING_TEMPLATE_OPTIONS} />
      <HomeScreenStack.Screen name="HapticsDemoScreen" component={HapticsDemoScreen} options={{ headerShown: false }} />
    </HomeScreenStack.Navigator>
  )
}

export default HomeStackScreen
