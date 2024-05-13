import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { useSelector } from 'react-redux'

import { useIsFocused } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Colors } from '@department-of-veterans-affairs/mobile-tokens'
import { DateTime } from 'luxon'

import { useAppointments } from 'api/appointments'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useClaimsAndAppeals } from 'api/claimsAndAppeals'
import { useDisabilityRating } from 'api/disabilityRating'
import { useFacilitiesInfo } from 'api/facilities/getFacilitiesInfo'
import { useLetterBeneficiaryData } from 'api/letters'
import { useServiceHistory } from 'api/militaryService'
import { usePrescriptions } from 'api/prescriptions'
import { useFolders } from 'api/secureMessaging'
import {
  ActivityButton,
  AnnouncementBanner,
  BackgroundVariant,
  BorderColorVariant,
  Box,
  BoxProps,
  CategoryLanding,
  CategoryLandingAlert,
  EncourageUpdateAlert,
  LinkRow,
  LoadingComponent,
  Nametag,
  TextView,
  VAIcon,
  VAIconProps,
} from 'components'
import { Events } from 'constants/analytics'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { CloseSnackbarOnNavigation } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { FEATURE_LANDING_TEMPLATE_OPTIONS } from 'constants/screens'
import { FolderNameTypeConstants } from 'constants/secureMessaging'
import { getUpcomingAppointmentDateRange } from 'screens/HealthScreen/Appointments/Appointments'
import { RootState } from 'store'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { AnalyticsState } from 'store/slices'
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

const { WEBVIEW_URL_FACILITY_LOCATOR, LINK_URL_ABOUT_PACT_ACT } = getEnv()

type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>

export function HomeScreen({}: HomeScreenProps) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const isFocused = useIsFocused()
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const appointmentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appointments)
  const claimsInDowntime = useDowntime(DowntimeFeatureTypeConstants.claims)
  const appealsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appeals)
  const rxInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const smInDowntime = useDowntime(DowntimeFeatureTypeConstants.secureMessaging)

  const { data: ratingData, isLoading: loadingDisabilityRating } = useDisabilityRating()
  const { data: serviceHistory, isLoading: loadingServiceHistory } = useServiceHistory()
  const { data: facilitiesInfo } = useFacilitiesInfo()
  const cernerFacilities = facilitiesInfo?.filter((f) => f.cerner) || []
  const {
    data: prescriptionData,
    isError: prescriptionsError,
    isFetched: rxPrefetch,
    isFetching: loadingPrescriptions,
  } = usePrescriptions({
    enabled: isFocused,
  })
  const {
    data: claimsData,
    isError: claimsAndAppealsError,
    isFetched: claimsPrefetch,
    isFetching: loadingClaimsAndAppeals,
  } = useClaimsAndAppeals('ACTIVE', 1, {
    enabled: isFocused,
  })
  const activeClaimsCount = claimsData?.meta.activeClaimsCount
  const claimsError = claimsAndAppealsError || !!claimsData?.meta.errors?.length
  const {
    data: foldersData,
    isError: inboxError,
    isFetched: smPrefetch,
    isFetching: loadingInbox,
  } = useFolders({
    enabled: isFocused,
  })

  const upcomingAppointmentDateRange = getUpcomingAppointmentDateRange()
  const {
    data: apptsData,
    isError: appointmentsError,
    isFetched: apptsPrefetch,
    isFetching: loadingAppointments,
  } = useAppointments(
    upcomingAppointmentDateRange.startDate,
    upcomingAppointmentDateRange.endDate,
    TimeFrameTypeConstants.UPCOMING,
    1,
    {
      enabled: isFocused,
    },
  )
  const upcomingAppointmentsCount = apptsData?.meta?.upcomingAppointmentsCount
  const upcomingDaysLimit = apptsData?.meta?.upcomingDaysLimit

  const { data: letterBeneficiaryData, isLoading: loadingLetterBeneficiaryData } = useLetterBeneficiaryData()

  const { loginTimestamp } = useSelector<RootState, AnalyticsState>((state) => state.analytics)
  const disRating = !!ratingData?.combinedDisabilityRating
  const monthlyPay = !!letterBeneficiaryData?.benefitInformation.monthlyAwardAmount
  const unreadMessageCount = foldersData?.inboxUnreadCount

  useEffect(() => {
    if (apptsPrefetch && apptsData?.meta) {
      logAnalyticsEvent(Events.vama_hs_appts_load_time(DateTime.now().toMillis() - loginTimestamp))
      logAnalyticsEvent(Events.vama_hs_appts_count(apptsData.meta.upcomingAppointmentsCount))
    }
  }, [apptsData, apptsPrefetch, loginTimestamp])

  useEffect(() => {
    if (smPrefetch && foldersData) {
      const inboxFolder = foldersData.data.find((folder) => folder.attributes.name === FolderNameTypeConstants.inbox)
      logAnalyticsEvent(Events.vama_hs_sm_load_time(DateTime.now().toMillis() - loginTimestamp))
      if (inboxFolder) {
        logAnalyticsEvent(Events.vama_hs_sm_count(inboxFolder.attributes.unreadCount))
      }
    }
  }, [smPrefetch, foldersData, loginTimestamp])

  useEffect(() => {
    if (rxPrefetch && prescriptionData?.meta.prescriptionStatusCount.isRefillable) {
      logAnalyticsEvent(Events.vama_hs_rx_load_time(DateTime.now().toMillis() - loginTimestamp))
      logAnalyticsEvent(Events.vama_hs_rx_count(prescriptionData.meta.prescriptionStatusCount.isRefillable))
    }
  }, [rxPrefetch, prescriptionData, loginTimestamp])

  useEffect(() => {
    if (claimsPrefetch && claimsData?.meta.activeClaimsCount) {
      logAnalyticsEvent(Events.vama_hs_claims_load_time(DateTime.now().toMillis() - loginTimestamp))
      logAnalyticsEvent(Events.vama_hs_claims_count(claimsData?.meta.activeClaimsCount))
    }
  }, [claimsPrefetch, claimsData, loginTimestamp])

  useEffect(() => {
    if (apptsPrefetch && claimsPrefetch && rxPrefetch && smPrefetch) {
      logAnalyticsEvent(Events.vama_hs_load_time(DateTime.now().toMillis() - loginTimestamp))
    }
  }, [dispatch, apptsPrefetch, claimsPrefetch, rxPrefetch, smPrefetch, loginTimestamp])

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
    !!serviceHistory?.mostRecentBranch

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

  const activityLoading = loadingAppointments || loadingClaimsAndAppeals || loadingInbox || loadingPrescriptions
  const featureInDowntime = !!(
    (userAuthorizedServices?.appointments && appointmentsInDowntime) ||
    (userAuthorizedServices?.appeals && appealsInDowntime) ||
    (userAuthorizedServices?.claims && claimsInDowntime) ||
    (userAuthorizedServices?.prescriptions && rxInDowntime) ||
    (userAuthorizedServices?.secureMessaging && smInDowntime)
  )
  const hasActivity =
    !!upcomingAppointmentsCount ||
    !!activeClaimsCount ||
    !!prescriptionData?.meta.prescriptionStatusCount.isRefillable ||
    !!unreadMessageCount
  const hasActivityError = !!(appointmentsError || claimsError || inboxError || prescriptionsError)

  return (
    <CategoryLanding headerButton={headerButton} testID="homeScreenID">
      <Box>
        <EncourageUpdateAlert />
        <Box mt={theme.dimensions.condensedMarginBetween}>
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
            </Box>
          ) : (
            <>
              <Box gap={theme.dimensions.condensedMarginBetween} mx={theme.dimensions.condensedMarginBetween}>
                {!!upcomingAppointmentsCount && !!upcomingDaysLimit && (
                  <ActivityButton
                    title={t('appointments')}
                    subText={t('appointments.activityButton.subText', {
                      count: upcomingAppointmentsCount,
                      dayCount: upcomingDaysLimit,
                    })}
                    deepLink={'appointments'}
                  />
                )}
                {!claimsError && !!activeClaimsCount && (
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
                {!!prescriptionData?.meta.prescriptionStatusCount.isRefillable && (
                  <ActivityButton
                    title={t('prescription.title')}
                    subText={t('prescriptions.activityButton.subText', {
                      count: prescriptionData?.meta.prescriptionStatusCount.isRefillable,
                    })}
                    deepLink={'prescriptions'}
                  />
                )}
                {(hasActivityError || featureInDowntime) && (
                  <CategoryLandingAlert text={t('activity.error.cantShowAllActivity')} isError={hasActivityError} />
                )}
              </Box>
            </>
          )}
          {!!cernerFacilities.length && (
            <Box mx={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween}>
              <TextView variant="ActivityFooter" accessibilityLabel={a11yLabelVA(t('activity.informationNotIncluded'))}>
                {t('activity.informationNotIncluded')}
              </TextView>
            </Box>
          )}
        </Box>
        <Box mt={theme.dimensions.formMarginBetween} mb={theme.dimensions.formMarginBetween}>
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
            <Box mx={theme.dimensions.condensedMarginBetween}>
              <CategoryLandingAlert text={t('aboutYou.noInformation')} />
            </Box>
          ) : (
            <Box>
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
                    borderBottomWidth={1}
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
            </Box>
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
        <Box mb={theme.dimensions.contentMarginBottom}>
          <AnnouncementBanner
            title={t('learnAboutPACT')}
            link={LINK_URL_ABOUT_PACT_ACT}
            a11yLabel={a11yLabelVA(t('learnAboutPACT'))}
          />
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
