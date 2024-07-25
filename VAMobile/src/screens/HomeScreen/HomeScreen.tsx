import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { colors } from '@department-of-veterans-affairs/mobile-tokens'
import { DateTime } from 'luxon'

import { useAppointments } from 'api/appointments'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useClaimsAndAppeals } from 'api/claimsAndAppeals'
import { useDisabilityRating } from 'api/disabilityRating'
import { useFacilitiesInfo } from 'api/facilities/getFacilitiesInfo'
import { useLetterBeneficiaryData } from 'api/letters'
import { useServiceHistory } from 'api/militaryService'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { usePrescriptions } from 'api/prescriptions'
import { useFolders } from 'api/secureMessaging'
import { ServiceHistoryData } from 'api/types'
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
  HeaderButton,
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
import { RootState } from 'store'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { AnalyticsState } from 'store/slices'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import { getUpcomingAppointmentDateRange } from 'utils/appointments'
import getEnv from 'utils/env'
import { roundToHundredthsPlace } from 'utils/formattingUtils'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'

import ContactVAScreen from './ContactVAScreen/ContactVAScreen'
import { HomeStackParamList } from './HomeStackScreens'
import ContactInformationScreen from './ProfileScreen/ContactInformationScreen'
import MilitaryInformationScreen from './ProfileScreen/MilitaryInformationScreen'
import PersonalInformationScreen from './ProfileScreen/PersonalInformationScreen'
import ProfileScreen from './ProfileScreen/ProfileScreen'
import SettingsScreen from './ProfileScreen/SettingsScreen'
import AccountSecurity from './ProfileScreen/SettingsScreen/AccountSecurity/AccountSecurity'
import DeveloperScreen from './ProfileScreen/SettingsScreen/DeveloperScreen'
import RemoteConfigScreen from './ProfileScreen/SettingsScreen/DeveloperScreen/RemoteConfigScreen'
import NotificationsSettingsScreen from './ProfileScreen/SettingsScreen/NotificationsSettingsScreen/NotificationsSettingsScreen'

const { WEBVIEW_URL_FACILITY_LOCATOR, LINK_URL_ABOUT_PACT_ACT } = getEnv()

const MemoizedLoadingComponent = React.memo(LoadingComponent)
type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>

export function HomeScreen({}: HomeScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const isFocused = useIsFocused()

  const authorizedServicesQuery = useAuthorizedServices()
  const appointmentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appointments)
  const claimsInDowntime = useDowntime(DowntimeFeatureTypeConstants.claims)
  const appealsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appeals)
  const rxInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const smInDowntime = useDowntime(DowntimeFeatureTypeConstants.secureMessaging)
  const serviceHistoryInDowntime = useDowntime(DowntimeFeatureTypeConstants.militaryServiceHistory)
  const disabilityRatingInDowntime = useDowntime(DowntimeFeatureTypeConstants.disabilityRating)
  const lettersInDowntime = useDowntime(DowntimeFeatureTypeConstants.letters)

  const upcomingAppointmentDateRange = getUpcomingAppointmentDateRange()
  const appointmentsQuery = useAppointments(
    upcomingAppointmentDateRange.startDate,
    upcomingAppointmentDateRange.endDate,
    TimeFrameTypeConstants.UPCOMING,
    {
      enabled: isFocused,
    },
  )
  const claimsAndAppealsQuery = useClaimsAndAppeals('ACTIVE', { enabled: isFocused })
  const foldersQuery = useFolders({ enabled: isFocused })
  const prescriptionsQuery = usePrescriptions({ enabled: isFocused })
  const facilitiesQuery = useFacilitiesInfo()
  const cernerFacilities = facilitiesQuery.data?.filter((facility) => facility.cerner) || []

  const disabilityRatingQuery = useDisabilityRating()
  const serviceHistoryQuery = useServiceHistory()
  const letterBeneficiaryQuery = useLetterBeneficiaryData()
  const personalInformationQuery = usePersonalInformation()

  const { loginTimestamp } = useSelector<RootState, AnalyticsState>((state) => state.analytics)

  useEffect(() => {
    if (appointmentsQuery.isFetched && appointmentsQuery.data?.meta) {
      logAnalyticsEvent(Events.vama_hs_appts_load_time(DateTime.now().toMillis() - loginTimestamp))
      logAnalyticsEvent(Events.vama_hs_appts_count(appointmentsQuery.data.meta.upcomingAppointmentsCount))
    }
  }, [appointmentsQuery.data, appointmentsQuery.isFetched, loginTimestamp])

  useEffect(() => {
    if (foldersQuery.isFetched && foldersQuery.data) {
      const inboxFolder = foldersQuery.data.data.find(
        (folder) => folder.attributes.name === FolderNameTypeConstants.inbox,
      )
      logAnalyticsEvent(Events.vama_hs_sm_load_time(DateTime.now().toMillis() - loginTimestamp))
      if (inboxFolder) {
        logAnalyticsEvent(Events.vama_hs_sm_count(inboxFolder.attributes.unreadCount))
      }
    }
  }, [foldersQuery.isFetched, foldersQuery.data, loginTimestamp])

  useEffect(() => {
    if (prescriptionsQuery.isFetched && prescriptionsQuery.data?.meta.prescriptionStatusCount.isRefillable) {
      logAnalyticsEvent(Events.vama_hs_rx_load_time(DateTime.now().toMillis() - loginTimestamp))
      logAnalyticsEvent(Events.vama_hs_rx_count(prescriptionsQuery.data.meta.prescriptionStatusCount.isRefillable))
    }
  }, [prescriptionsQuery.isFetched, prescriptionsQuery.data, loginTimestamp])

  useEffect(() => {
    if (claimsAndAppealsQuery.isFetched && claimsAndAppealsQuery.data?.meta.activeClaimsCount) {
      logAnalyticsEvent(Events.vama_hs_claims_load_time(DateTime.now().toMillis() - loginTimestamp))
      logAnalyticsEvent(Events.vama_hs_claims_count(claimsAndAppealsQuery.data?.meta.activeClaimsCount))
    }
  }, [claimsAndAppealsQuery.isFetched, claimsAndAppealsQuery.data, loginTimestamp])

  useEffect(() => {
    if (
      appointmentsQuery.isFetched &&
      claimsAndAppealsQuery.isFetched &&
      prescriptionsQuery.isFetched &&
      foldersQuery.isFetched
    ) {
      logAnalyticsEvent(Events.vama_hs_load_time(DateTime.now().toMillis() - loginTimestamp))
    }
  }, [
    appointmentsQuery.isFetched,
    claimsAndAppealsQuery.isFetched,
    prescriptionsQuery.isFetched,
    foldersQuery.isFetched,
    loginTimestamp,
  ])

  useEffect(() => {
    const SERVICE_INDICATOR_KEY = `@store_service_indicator${personalInformationQuery?.data?.id}`
    const serviceHistory = serviceHistoryQuery?.data?.serviceHistory || ([] as ServiceHistoryData)

    const checkServiceIndicators = async (serviceIndicators: string): Promise<void> => {
      if (!serviceIndicators) {
        return
      }

      try {
        const asyncServiceIndicators = await AsyncStorage.getItem(SERVICE_INDICATOR_KEY)
        if (!asyncServiceIndicators || asyncServiceIndicators !== serviceIndicators) {
          serviceHistory.forEach((service) => {
            if (service.honorableServiceIndicator === 'Y') {
              logAnalyticsEvent(Events.vama_vet_status_yStatus())
            } else if (service.honorableServiceIndicator === 'N') {
              logAnalyticsEvent(Events.vama_vet_status_nStatus())
            } else if (service.honorableServiceIndicator === 'Z') {
              logAnalyticsEvent(Events.vama_vet_status_zStatus(service.characterOfDischarge))
            }
          })
          AsyncStorage.setItem(SERVICE_INDICATOR_KEY, serviceIndicators)
        }
      } catch (err) {
        logNonFatalErrorToFirebase(err, 'checkServiceIndicators: AsyncStorage error')
      }
    }

    if (serviceHistory) {
      const serviceIndicators = serviceHistory.map((service) => service.honorableServiceIndicator).join('')
      checkServiceIndicators(serviceIndicators)
    }
  }, [serviceHistoryQuery?.data?.serviceHistory, personalInformationQuery?.data?.id])

  const activityFeatureInDowntime = !!(
    (authorizedServicesQuery.data?.appointments && appointmentsInDowntime) ||
    (authorizedServicesQuery.data?.appeals && appealsInDowntime) ||
    (authorizedServicesQuery.data?.claims && claimsInDowntime) ||
    (authorizedServicesQuery.data?.prescriptions && rxInDowntime) ||
    (authorizedServicesQuery.data?.secureMessaging && smInDowntime)
  )

  const activityFeatureActive = !!(
    (authorizedServicesQuery.data?.appointments && !appointmentsInDowntime) ||
    (authorizedServicesQuery.data?.appeals && !appealsInDowntime) ||
    (authorizedServicesQuery.data?.claims && !claimsInDowntime) ||
    (authorizedServicesQuery.data?.prescriptions && !rxInDowntime) ||
    (authorizedServicesQuery.data?.secureMessaging && !smInDowntime)
  )

  // Ensures loading component is still rendered while waiting for queries to start fetching on first mount
  const activityNotFetched =
    activityFeatureActive &&
    !appointmentsQuery.isFetched &&
    !claimsAndAppealsQuery.isFetched &&
    !foldersQuery.isFetched &&
    !prescriptionsQuery.isFetched

  const loadingActivity =
    activityNotFetched ||
    appointmentsQuery.isFetching ||
    claimsAndAppealsQuery.isFetching ||
    foldersQuery.isFetching ||
    prescriptionsQuery.isFetching

  const hasActivity =
    !!appointmentsQuery.data?.meta?.upcomingAppointmentsCount ||
    !!claimsAndAppealsQuery.data?.meta.activeClaimsCount ||
    !!foldersQuery.data?.inboxUnreadCount ||
    !!prescriptionsQuery.data?.meta.prescriptionStatusCount.isRefillable

  const claimsError = claimsAndAppealsQuery.isError || !!claimsAndAppealsQuery.data?.meta.errors?.length
  const hasActivityError = !!(
    appointmentsQuery.isError ||
    claimsError ||
    foldersQuery.isError ||
    prescriptionsQuery.isError
  )

  const aboutYouFeatureActive = !!(
    (authorizedServicesQuery.data?.militaryServiceHistory && !serviceHistoryInDowntime) ||
    (authorizedServicesQuery.data?.disabilityRating && !disabilityRatingInDowntime) ||
    (authorizedServicesQuery.data?.lettersAndDocuments && !lettersInDowntime)
  )

  // Ensures loading component is still rendered while waiting for queries to start fetching on first mount
  const aboutYouNotFetched =
    aboutYouFeatureActive &&
    !serviceHistoryQuery.isFetched &&
    !disabilityRatingQuery.isFetched &&
    !letterBeneficiaryQuery.isFetched

  const loadingAboutYou =
    aboutYouNotFetched ||
    serviceHistoryQuery.isLoading ||
    disabilityRatingQuery.isLoading ||
    letterBeneficiaryQuery.isLoading

  const hasAboutYouInfo =
    !!disabilityRatingQuery.data?.combinedDisabilityRating ||
    !!letterBeneficiaryQuery.data?.benefitInformation.monthlyAwardAmount ||
    !!serviceHistoryQuery.data?.mostRecentBranch

  const onFacilityLocator = () => {
    logAnalyticsEvent(Events.vama_find_location())
    navigateTo('Webview', {
      url: WEBVIEW_URL_FACILITY_LOCATOR,
      displayTitle: t('webview.vagov'),
      loadingMessage: t('webview.valocation.loading'),
    })
  }

  const headerButton: HeaderButton = {
    label: t('profile.title'),
    accessibilityRole: 'link',
    icon: {
      name: 'ProfileSelected',
    } as VAIconProps,
    onPress: () => navigateTo('Profile'),
  }

  const boxProps: BoxProps = {
    style: {
      shadowColor: 'black',
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
          {loadingActivity ? (
            <Box mx={theme.dimensions.standardMarginBetween}>
              <MemoizedLoadingComponent
                spinnerWidth={24}
                spinnerHeight={24}
                text={t('activity.loading')}
                inlineSpinner={true}
                spinnerColor={theme.colors.icon.inlineSpinner}
              />
            </Box>
          ) : !hasActivity && !hasActivityError ? (
            <Box mx={theme.dimensions.standardMarginBetween}>
              {activityFeatureInDowntime ? (
                <CategoryLandingAlert text={t('activity.error.cantShowAllActivity')} isError={hasActivityError} />
              ) : (
                <Box
                  flexDirection="row"
                  alignItems="center"
                  accessible={true}
                  accessibilityLabel={`${t('icon.success')} ${t('noActivity')}`}>
                  <VAIcon
                    name={'CircleCheckMark'}
                    fill={colors.vadsColorSuccessDark}
                    fill2={theme.colors.icon.transparent}
                  />
                  <TextView
                    importantForAccessibility={'no'}
                    ml={theme.dimensions.condensedMarginBetween}
                    variant="HomeScreen">
                    {t('noActivity')}
                  </TextView>
                </Box>
              )}
            </Box>
          ) : (
            <Box gap={theme.dimensions.condensedMarginBetween} mx={theme.dimensions.condensedMarginBetween}>
              {!!appointmentsQuery.data?.meta?.upcomingAppointmentsCount &&
                !!appointmentsQuery.data?.meta?.upcomingDaysLimit && (
                  <ActivityButton
                    title={t('appointments')}
                    subText={t('appointments.activityButton.subText', {
                      count: appointmentsQuery.data.meta.upcomingAppointmentsCount,
                      dayCount: appointmentsQuery.data.meta.upcomingDaysLimit,
                    })}
                    deepLink={'appointments'}
                  />
                )}
              {!claimsError && !!claimsAndAppealsQuery.data?.meta.activeClaimsCount && (
                <ActivityButton
                  title={t('claims.title')}
                  subText={t('claims.activityButton.subText', {
                    count: claimsAndAppealsQuery.data.meta.activeClaimsCount,
                  })}
                  deepLink={'claims'}
                />
              )}
              {!!foldersQuery.data?.inboxUnreadCount && (
                <ActivityButton
                  title={`${t('messages')}`}
                  subText={t('secureMessaging.activityButton.subText', { count: foldersQuery.data.inboxUnreadCount })}
                  deepLink={'messages'}
                />
              )}
              {!!prescriptionsQuery.data?.meta.prescriptionStatusCount.isRefillable && (
                <ActivityButton
                  title={t('prescription.title')}
                  subText={t('prescriptions.activityButton.subText', {
                    count: prescriptionsQuery.data?.meta.prescriptionStatusCount.isRefillable,
                  })}
                  deepLink={'prescriptions'}
                />
              )}
              {(hasActivityError || activityFeatureInDowntime) && (
                <CategoryLandingAlert text={t('activity.error.cantShowAllActivity')} isError={hasActivityError} />
              )}
            </Box>
          )}
          {!!cernerFacilities.length && (
            <Box mx={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween}>
              <TextView variant="ActivityFooter" accessibilityLabel={a11yLabelVA(t('activity.informationNotIncluded'))}>
                {t('activity.informationNotIncluded')}
              </TextView>
            </Box>
          )}
        </Box>
        <Box mt={theme.dimensions.formMarginBetween}>
          <TextView
            mx={theme.dimensions.gutter}
            mb={
              !loadingAboutYou && !hasAboutYouInfo
                ? theme.dimensions.condensedMarginBetween
                : theme.dimensions.standardMarginBetween
            }
            variant={'HomeScreenHeader'}
            accessibilityRole="header">
            {t('aboutYou')}
          </TextView>
          {loadingAboutYou ? (
            <Box mx={theme.dimensions.standardMarginBetween}>
              <MemoizedLoadingComponent
                spinnerWidth={24}
                spinnerHeight={24}
                text={t('aboutYou.loading')}
                inlineSpinner={true}
                spinnerColor={theme.colors.icon.inlineSpinner}
              />
            </Box>
          ) : !hasAboutYouInfo ? (
            <Box mx={theme.dimensions.condensedMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
              <CategoryLandingAlert text={t('aboutYou.noInformation')} />
            </Box>
          ) : (
            <Box>
              <Nametag />
              <Box backgroundColor={theme.colors.background.veteranStatusHome as BackgroundVariant} {...boxProps}>
                {!!disabilityRatingQuery.data?.combinedDisabilityRating && (
                  <Box
                    pt={theme.dimensions.standardMarginBetween}
                    pb={
                      letterBeneficiaryQuery.data?.benefitInformation.monthlyAwardAmount
                        ? 0
                        : theme.dimensions.standardMarginBetween
                    }
                    pl={theme.dimensions.standardMarginBetween}>
                    <TextView
                      accessibilityLabel={`${t('disabilityRating.title')} ${t('disabilityRatingDetails.percentage', { rate: disabilityRatingQuery.data.combinedDisabilityRating })} ${t('disabilityRating.serviceConnected')}`}
                      variant={'VeteranStatusBranch'}>
                      {t('disabilityRating.title')}
                    </TextView>
                    <TextView
                      accessible={false}
                      importantForAccessibility={'no'}
                      variant={
                        'NametagNumber'
                      }>{`${t('disabilityRatingDetails.percentage', { rate: disabilityRatingQuery.data.combinedDisabilityRating })}`}</TextView>
                    <TextView accessible={false} importantForAccessibility={'no'} variant={'VeteranStatusProof'}>
                      {t('disabilityRating.serviceConnected')}
                    </TextView>
                  </Box>
                )}
                {!!letterBeneficiaryQuery.data?.benefitInformation.monthlyAwardAmount &&
                  !!disabilityRatingQuery.data?.combinedDisabilityRating && (
                    <Box
                      mx={theme.dimensions.standardMarginBetween}
                      my={theme.dimensions.condensedMarginBetween}
                      borderBottomWidth={1}
                      borderColor={theme.colors.border.aboutYou as BorderColorVariant}
                    />
                  )}
                {!!letterBeneficiaryQuery.data?.benefitInformation.monthlyAwardAmount && (
                  <Box
                    pt={
                      disabilityRatingQuery.data?.combinedDisabilityRating ? 0 : theme.dimensions.standardMarginBetween
                    }
                    pl={theme.dimensions.standardMarginBetween}
                    pb={theme.dimensions.standardMarginBetween}>
                    <TextView
                      accessibilityLabel={`${t('monthlyCompensationPayment')} $${roundToHundredthsPlace(letterBeneficiaryQuery.data.benefitInformation.monthlyAwardAmount)}`}
                      variant={'VeteranStatusBranch'}>
                      {t('monthlyCompensationPayment')}
                    </TextView>
                    <TextView
                      accessible={false}
                      importantForAccessibility={'no'}
                      variant={
                        'NametagNumber'
                      }>{`$${roundToHundredthsPlace(letterBeneficiaryQuery.data.benefitInformation.monthlyAwardAmount)}`}</TextView>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
        <Box mt={theme.dimensions.formMarginBetween} mb={theme.dimensions.formMarginBetween}>
          <TextView
            mx={theme.dimensions.gutter}
            mb={theme.dimensions.standardMarginBetween}
            variant={'HomeScreenHeader'}
            accessibilityLabel={a11yLabelVA(t('vaResources'))}
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
        name="AccountSecurity"
        component={AccountSecurity}
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
    </HomeScreenStack.Navigator>
  )
}

export default HomeStackScreen
