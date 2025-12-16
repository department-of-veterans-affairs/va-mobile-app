import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { InView } from 'react-native-intersection-observer'
import { useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Button, ButtonVariants, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { Icon, IconProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'
import { colors as DSColors } from '@department-of-veterans-affairs/mobile-tokens'
import { DateTime } from 'luxon'

import { useAppointments } from 'api/appointments'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useClaimsAndAppeals } from 'api/claimsAndAppeals'
import { useDebts } from 'api/debts'
import { useDisabilityRating } from 'api/disabilityRating'
import { useFacilitiesInfo } from 'api/facilities/getFacilitiesInfo'
import { useMedicalCopays } from 'api/medicalCopays'
import { useServiceHistory } from 'api/militaryService'
import { usePayments } from 'api/payments'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { usePrescriptions } from 'api/prescriptions'
import { useFolders } from 'api/secureMessaging'
import { ServiceHistoryData } from 'api/types'
import {
  ActivityButton,
  AnnouncementBanner,
  BackgroundVariant,
  Box,
  BoxProps,
  CategoryLanding,
  CategoryLandingAlert,
  EmailConfirmationAlert,
  EncourageUpdateAlert,
  HeaderButton,
  LinkRow,
  LoadingComponent,
  Nametag,
  ObfuscatedTextView,
  TextView,
} from 'components'
import { Events } from 'constants/analytics'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { NAMESPACE } from 'constants/namespaces'
import { FEATURE_LANDING_TEMPLATE_OPTIONS } from 'constants/screens'
import ContactVAScreen from 'screens/HomeScreen/ContactVAScreen/ContactVAScreen'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import PaymentBreakdownModal from 'screens/HomeScreen/PaymentBreakdownModal/PaymentBreakdownModal'
import ContactInformationScreen from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen'
import MilitaryInformationScreen from 'screens/HomeScreen/ProfileScreen/MilitaryInformationScreen'
import PersonalInformationScreen from 'screens/HomeScreen/ProfileScreen/PersonalInformationScreen'
import ProfileScreen from 'screens/HomeScreen/ProfileScreen/ProfileScreen'
import SettingsScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen'
import AccountSecurity from 'screens/HomeScreen/ProfileScreen/SettingsScreen/AccountSecurity/AccountSecurity'
import DeveloperScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen'
import DemoModeUsersScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen/DemoModeUsersScreen'
import OverrideAPIScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen/OverrideApiScreen'
import RemoteConfigScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen/RemoteConfigScreen'
import RemoteConfigTestScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen/RemoteConfigTestScreen'
import GiveFeedbackScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/GiveFeedback/GiveFeedback'
import FeedbackSentScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/GiveFeedback/SendUsFeedback/FeedbackSent/FeedbackSent'
import SendUsFeedbackScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/GiveFeedback/SendUsFeedback/SendUsFeedback'
import NotificationsSettingsScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/NotificationsSettingsScreen/NotificationsSettingsScreen'
import { RootState } from 'store'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { AnalyticsState } from 'store/slices'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import { getPastAppointmentDateRange, getUpcomingAppointmentDateRange } from 'utils/appointments'
import { isValidDisabilityRating } from 'utils/claims'
import getEnv from 'utils/env'
import { formatDateUtc, numberToUSDollars } from 'utils/formattingUtils'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

const { WEBVIEW_URL_FACILITY_LOCATOR, LINK_URL_ABOUT_PACT_ACT } = getEnv()

const MemoizedLoadingComponent = React.memo(LoadingComponent)
type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>

export function HomeScreen({}: HomeScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const isFocused = useIsFocused()
  const ref = useRef(null)

  const authorizedServicesQuery = useAuthorizedServices()
  const appointmentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appointments)
  const claimsInDowntime = useDowntime(DowntimeFeatureTypeConstants.claims)
  const appealsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appeals)
  const rxInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const smInDowntime = useDowntime(DowntimeFeatureTypeConstants.secureMessaging)
  const serviceHistoryInDowntime = useDowntime(DowntimeFeatureTypeConstants.militaryServiceHistory)
  const disabilityRatingInDowntime = useDowntime(DowntimeFeatureTypeConstants.disabilityRating)
  const paymentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.payments)

  const upcomingAppointmentDateRange = getUpcomingAppointmentDateRange()
  const appointmentsQuery = useAppointments(
    upcomingAppointmentDateRange.startDate,
    upcomingAppointmentDateRange.endDate,
    TimeFrameTypeConstants.UPCOMING,
    {
      enabled: isFocused,
    },
  )

  const pastAppointmentsRange = getPastAppointmentDateRange()
  const pastAppointmentsQuery = useAppointments(
    pastAppointmentsRange.startDate,
    pastAppointmentsRange.endDate,
    TimeFrameTypeConstants.PAST_THREE_MONTHS,
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
  const paymentHistoryQuery = usePayments('', 1)
  const personalInformationQuery = usePersonalInformation()

  const { summary: copaysSummary, isLoading: copaysLoading, error: copaysError } = useMedicalCopays({ enabled: true })
  const { summary: debtsSummary, isLoading: debtsLoading, error: debtsError } = useDebts()

  const showCopays = !copaysLoading && !copaysError && copaysSummary.count > 0 && copaysSummary.amountDue > 0
  const showDebts = !debtsLoading && !debtsError && debtsSummary.count > 0

  const { loginTimestamp } = useSelector<RootState, AnalyticsState>((state) => state.analytics)

  const [showDisabilityRating, setShowDisabilityRating] = useState(false)
  const [showCompensation, setShowCompensation] = useState(false)
  const [paymentBreakdownVisible, setPaymentBreakdownVisible] = useState(false)

  useEffect(() => {
    if (appointmentsQuery.isFetched && appointmentsQuery.data?.meta) {
      logAnalyticsEvent(Events.vama_hs_appts_load_time(DateTime.now().toMillis() - loginTimestamp))
    }
  }, [appointmentsQuery.data, appointmentsQuery.isFetched, loginTimestamp])

  useEffect(() => {
    if (foldersQuery.isFetched && foldersQuery.data) {
      logAnalyticsEvent(Events.vama_hs_sm_load_time(DateTime.now().toMillis() - loginTimestamp))
    }
  }, [foldersQuery.isFetched, foldersQuery.data, loginTimestamp])

  useEffect(() => {
    if (prescriptionsQuery.isFetched && prescriptionsQuery.data?.meta.prescriptionStatusCount.isRefillable) {
      logAnalyticsEvent(Events.vama_hs_rx_load_time(DateTime.now().toMillis() - loginTimestamp))
    }
  }, [prescriptionsQuery.isFetched, prescriptionsQuery.data, loginTimestamp])

  useEffect(() => {
    if (claimsAndAppealsQuery.isFetched && claimsAndAppealsQuery.data?.meta.activeClaimsCount) {
      logAnalyticsEvent(Events.vama_hs_claims_load_time(DateTime.now().toMillis() - loginTimestamp))
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

  const recurringPayment = {
    amount: paymentHistoryQuery.data?.meta.recurringPayment.amount,
    date: paymentHistoryQuery.data?.meta.recurringPayment.date,
  }

  const hasRecurringPaymentInfo = !!recurringPayment.amount && !!recurringPayment.date
  const hasDisabilityRating = isValidDisabilityRating(disabilityRatingQuery.data?.combinedDisabilityRating)

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
    !pastAppointmentsQuery.isFetched &&
    !claimsAndAppealsQuery.isFetched &&
    !foldersQuery.isFetched &&
    !prescriptionsQuery.isFetched

  const loadingActivity =
    activityNotFetched ||
    appointmentsQuery.isFetching ||
    pastAppointmentsQuery.isFetching ||
    claimsAndAppealsQuery.isFetching ||
    foldersQuery.isFetching ||
    prescriptionsQuery.isFetching

  const hasActivity =
    !!appointmentsQuery.data?.meta?.upcomingAppointmentsCount ||
    !!claimsAndAppealsQuery.data?.meta.activeClaimsCount ||
    !!foldersQuery.data?.inboxUnreadCount ||
    !!pastAppointmentsQuery.data?.meta?.travelPayEligibleCount ||
    !!prescriptionsQuery.data?.meta.prescriptionStatusCount.isRefillable

  const claimsError = claimsAndAppealsQuery.isError || !!claimsAndAppealsQuery.data?.meta.errors?.length
  const hasActivityError = !!(
    appointmentsQuery.isError ||
    pastAppointmentsQuery.isError ||
    claimsError ||
    foldersQuery.isError ||
    prescriptionsQuery.isError
  )

  const aboutYouFeatureActive = !!(
    (authorizedServicesQuery.data?.militaryServiceHistory && !serviceHistoryInDowntime) ||
    (authorizedServicesQuery.data?.disabilityRating && !disabilityRatingInDowntime) ||
    (authorizedServicesQuery.data?.paymentHistory && !paymentsInDowntime)
  )

  // Ensures loading component is still rendered while waiting for queries to start fetching on first mount
  const aboutYouNotFetched =
    aboutYouFeatureActive &&
    !serviceHistoryQuery.isFetched &&
    !disabilityRatingQuery.isFetched &&
    !paymentHistoryQuery.isFetched

  const loadingAboutYou =
    aboutYouNotFetched ||
    serviceHistoryQuery.isLoading ||
    disabilityRatingQuery.isLoading ||
    paymentHistoryQuery.isLoading

  const hasAboutYouInfo = hasDisabilityRating || hasRecurringPaymentInfo || !!serviceHistoryQuery.data?.mostRecentBranch

  const aboutYouFeatureInDowntime = !!(
    (authorizedServicesQuery.data?.militaryServiceHistory && serviceHistoryInDowntime) ||
    (authorizedServicesQuery.data?.disabilityRating && disabilityRatingInDowntime) ||
    (authorizedServicesQuery.data?.paymentHistory && paymentsInDowntime)
  )

  const hasAboutYouError = !!(
    disabilityRatingQuery.isError ||
    paymentHistoryQuery.isError ||
    serviceHistoryQuery.isError
  )

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
      name: 'AccountCircle',
      fill: theme.colors.icon.active,
    } as IconProps,
    onPress: () => navigateTo('Profile'),
    testID: 'toProfileScreenID',
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
        {featureEnabled('showEmailConfirmationAlert') && <EmailConfirmationAlert />}
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <InView
            triggerOnce={true}
            onChange={() => {
              if (featureEnabled('hsScrollAnalytics')) logAnalyticsEvent(Events.vama_hs_scroll_activity)
            }}>
            <TextView
              mx={theme.dimensions.gutter}
              mb={theme.dimensions.standardMarginBetween}
              variant={'HomeScreenHeader'}
              accessibilityRole="header">
              {t('activity')}
            </TextView>
          </InView>
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
                // eslint-disable-next-line react-native-a11y/has-accessibility-hint
                <Box
                  flexDirection="row"
                  alignItems="center"
                  accessible={true}
                  accessibilityLabel={`${t('icon.success')} ${t('noActivity')}`}>
                  <Icon name={'CheckCircle'} fill={DSColors.vadsColorSuccessDark} width={30} height={30} />
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
                    title={t('upcomingAppointments')}
                    subText={t('upcomingAppointments.activityButton.subText', {
                      count: appointmentsQuery.data.meta.upcomingAppointmentsCount,
                      dayCount: appointmentsQuery.data.meta.upcomingDaysLimit,
                    })}
                    deepLink={'appointments'}
                  />
                )}
              {featureEnabled('travelPaySMOC') && !!pastAppointmentsQuery.data?.meta?.travelPayEligibleCount && (
                <ActivityButton
                  title={t('pastAppointments')}
                  subText={t('pastAppointments.activityButton.subText', {
                    count: pastAppointmentsQuery.data.meta.travelPayEligibleCount,
                  })}
                  deepLink={'pastAppointments'}
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
              {featureEnabled('overpayCopay') && showCopays && (
                <ActivityButton
                  title={t('copays.title')}
                  subText={t('copays.activityButton.subText', {
                    amount: numberToUSDollars(copaysSummary.amountDue),
                    count: copaysSummary.count,
                  })}
                  deepLink={'copays'}
                />
              )}
              {featureEnabled('overpayCopay') && showDebts && (
                <ActivityButton
                  title={t('debts.title')}
                  subText={t('debts.activityButton.subText', {
                    count: debtsSummary.count,
                  })}
                  deepLink={'debts'}
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
              {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
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
          <Nametag />
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
          ) : !hasAboutYouInfo && !hasAboutYouError ? (
            <Box mx={theme.dimensions.condensedMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
              <CategoryLandingAlert text={t('aboutYou.noInformation')} />
            </Box>
          ) : (
            <Box>
              <Box backgroundColor={theme.colors.background.veteranStatusHome as BackgroundVariant} {...boxProps}>
                {hasDisabilityRating && (
                  <Box
                    pt={theme.dimensions.standardMarginBetween}
                    pb={hasRecurringPaymentInfo ? 0 : theme.dimensions.standardMarginBetween}
                    px={theme.dimensions.standardMarginBetween}>
                    <TextView
                      accessibilityRole="header"
                      pb={theme.dimensions.condensedMarginBetween}
                      variant={'HomeScreenHeader'}>
                      {t('disabilityRating.title')}
                    </TextView>
                    <Box
                      accessible={true}
                      accessibilityHint={
                        showDisabilityRating
                          ? t('disabilityRating.title.unobfuscatedLabel')
                          : t('disabilityRating.title.obfuscatedLabel')
                      }
                      accessibilityLabel={
                        showDisabilityRating
                          ? `${t('disabilityRatingDetails.percentage', { rate: disabilityRatingQuery.data?.combinedDisabilityRating })} ${t('disabilityRating.serviceConnected')}`
                          : t('disabilityRating.title.obfuscatedLabel')
                      }>
                      <ObfuscatedTextView
                        showText={showDisabilityRating}
                        obfuscatedText={t('disabilityRatingDetails.percentage.obfuscated')}
                        revealedText={t('disabilityRatingDetails.percentage', {
                          rate: disabilityRatingQuery.data?.combinedDisabilityRating,
                        })}
                        obfuscatedTextProps={{
                          variant: 'NametagNumber',
                          color: 'disabled',
                        }}
                        revealedTextProps={{
                          variant: 'NametagNumber',
                          color: 'primary',
                        }}
                      />
                      <ObfuscatedTextView
                        showText={showDisabilityRating}
                        obfuscatedText={t('disabilityRating.serviceConnected.obfuscated')}
                        revealedText={t('disabilityRating.serviceConnected')}
                        revealedTextProps={{ variant: 'VeteranStatusProof', color: 'primary' }}
                        obfuscatedTextProps={{ variant: 'VeteranStatusProof', color: 'disabled' }}
                      />
                    </Box>
                    <Box pt={theme.dimensions.standardMarginBetween}>
                      <Button
                        onPress={() => {
                          setShowDisabilityRating(!showDisabilityRating)
                          logAnalyticsEvent(Events.vama_obf_textview('disabilityRating', !showDisabilityRating))
                        }}
                        label={showDisabilityRating ? t('hide') : t('show')}
                        testID={'showDisabilityTestID'}
                        buttonType={ButtonVariants.Primary}
                      />
                    </Box>
                  </Box>
                )}
                {hasRecurringPaymentInfo && hasDisabilityRating && (
                  <Box mx={theme.dimensions.standardMarginBetween} my={theme.dimensions.standardMarginBetween} />
                )}
                {hasRecurringPaymentInfo && (
                  <Box
                    pt={hasDisabilityRating ? 0 : theme.dimensions.standardMarginBetween}
                    px={theme.dimensions.standardMarginBetween}
                    pb={theme.dimensions.standardMarginBetween}>
                    <TextView
                      pb={theme.dimensions.condensedMarginBetween}
                      accessibilityRole={'header'}
                      variant={'HomeScreenHeader'}>
                      {t('monthlyCompensationPayment')}
                    </TextView>
                    <Box
                      accessible={true}
                      accessibilityHint={
                        showCompensation
                          ? t('monthlyCompensationPayment.unobfuscated')
                          : t('monthlyCompensationPayment.obfuscated')
                      }
                      accessibilityLabel={
                        showCompensation
                          ? `${recurringPayment.amount} ${t('monthlyCompensationPayment.depositedOn')} ${formatDateUtc(recurringPayment.date as string, 'MMMM d, yyyy')}`
                          : t('monthlyCompensationPayment.obfuscated')
                      }>
                      <ObfuscatedTextView
                        showText={showCompensation}
                        obfuscatedText={t('monthlyCompensationPayment.amount.obfuscated')}
                        revealedText={recurringPayment.amount || ''}
                        revealedTextProps={{
                          variant: 'NametagNumber',
                          color: 'primary',
                        }}
                        obfuscatedTextProps={{
                          variant: 'NametagNumber',
                          color: 'disabled',
                        }}
                      />
                      <ObfuscatedTextView
                        showText={showCompensation}
                        obfuscatedText={t('monthlyCompensationPayment.depositedOn.obfuscated')}
                        revealedText={`${t('monthlyCompensationPayment.depositedOn')} ${formatDateUtc(recurringPayment.date as string, 'MMMM d, yyyy')}`}
                        revealedTextProps={{
                          variant: 'VeteranStatusProof',
                          color: 'primary',
                        }}
                        obfuscatedTextProps={{
                          variant: 'VeteranStatusProof',
                          color: 'disabled',
                        }}
                      />
                    </Box>
                    <Box pt={theme.dimensions.standardMarginBetween}>
                      <Button
                        onPress={() => {
                          setShowCompensation(!showCompensation)
                          logAnalyticsEvent(Events.vama_obf_textview('latestPayment', !showCompensation))
                        }}
                        label={showCompensation ? t('hide') : t('show')}
                        buttonType={ButtonVariants.Primary}
                        testID={'showCompensationTestID'}
                      />
                      <Box mt={theme.dimensions.condensedMarginBetween} />
                      <View ref={ref} accessibilityRole="button">
                        <Button
                          onPress={() => {
                            setPaymentBreakdownVisible(true)
                            logAnalyticsEvent(Events.vama_payment_bd_details())
                          }}
                          label={t('monthlyCompensationPayment.seeDetails')}
                          buttonType={ButtonVariants.Secondary}
                          testID={'seePaymentBreakdownButtonTestID'}
                        />
                      </View>
                    </Box>
                  </Box>
                )}
              </Box>
              {(hasAboutYouError || aboutYouFeatureInDowntime) && (
                <CategoryLandingAlert text={t('aboutYou.error.cantShowAllInfo')} isError={hasAboutYouError} />
              )}
            </Box>
          )}
        </Box>
        <Box mt={theme.dimensions.formMarginBetween} mb={theme.dimensions.formMarginBetween}>
          <InView
            triggerOnce={true}
            onChange={() => {
              if (featureEnabled('hsScrollAnalytics')) logAnalyticsEvent(Events.vama_hs_scroll_resources)
            }}>
            {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
            <TextView
              mx={theme.dimensions.gutter}
              mb={theme.dimensions.standardMarginBetween}
              variant={'HomeScreenHeader'}
              accessibilityLabel={a11yLabelVA(t('vaResources'))}
              accessibilityRole="header">
              {t('vaResources')}
            </TextView>
          </InView>
          <Box mx={theme.dimensions.condensedMarginBetween}>
            <LinkRow title={t('contactUs')} onPress={() => navigateTo('ContactVA')} />
            <LinkRow
              title={t('findLocation.title')}
              titleA11yLabel={a11yLabelVA(t('findLocation.title'))}
              onPress={onFacilityLocator}
            />
          </Box>
        </Box>
        <InView
          triggerOnce={true}
          onChange={() => {
            if (featureEnabled('hsScrollAnalytics')) logAnalyticsEvent(Events.vama_hs_scroll_banner)
          }}>
          <Box mb={theme.dimensions.contentMarginBottom}>
            <AnnouncementBanner
              title={t('learnAboutPACT')}
              link={LINK_URL_ABOUT_PACT_ACT}
              a11yLabel={a11yLabelVA(t('learnAboutPACT'))}
            />
          </Box>
        </InView>
      </Box>
      <PaymentBreakdownModal ref={ref} visible={paymentBreakdownVisible} setVisible={setPaymentBreakdownVisible} />
    </CategoryLanding>
  )
}

type HomeStackScreenProps = Record<string, unknown>

const HomeScreenStack = createStackNavigator<HomeStackParamList>()

/**
 * Stack screen for the Home tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
function HomeStackScreen({}: HomeStackScreenProps) {
  const snackbar = useSnackbar()
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
            snackbar.hide()
          }
        },
        blur: () => {
          snackbar.hide()
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
        name="GiveFeedback"
        component={GiveFeedbackScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HomeScreenStack.Screen
        name="SendUsFeedback"
        component={SendUsFeedbackScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HomeScreenStack.Screen
        name="FeedbackSent"
        component={FeedbackSentScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
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
        name="DemoModeUsers"
        component={DemoModeUsersScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HomeScreenStack.Screen
        name="OverrideAPI"
        component={OverrideAPIScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HomeScreenStack.Screen
        name="RemoteConfig"
        component={RemoteConfigScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HomeScreenStack.Screen
        name="RemoteConfigTestScreen"
        component={RemoteConfigTestScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
    </HomeScreenStack.Navigator>
  )
}

export default HomeStackScreen
