import React from 'react'
import { useTranslation } from 'react-i18next'

import { useIsFocused } from '@react-navigation/native'
import { CardStyleInterpolators, StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { useAppointments } from 'api/appointments'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { usePrescriptions } from 'api/prescriptions'
import { useFolders } from 'api/secureMessaging'
import { AnnouncementBanner, Box, CategoryLanding, CategoryLandingAlert, LargeNavButton } from 'components'
import { Events } from 'constants/analytics'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { CloseSnackbarOnNavigation } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { FEATURE_LANDING_TEMPLATE_OPTIONS } from 'constants/screens'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'
import { screenContentAllowed } from 'utils/waygateConfig'

import Appointments from './Appointments'
import { getUpcomingAppointmentDateRange } from './Appointments/Appointments'
import PastAppointmentDetails from './Appointments/PastAppointments/PastAppointmentDetails'
import UpcomingAppointmentDetails from './Appointments/UpcomingAppointments/UpcomingAppointmentDetails'
import CernerAlert from './CernerAlert'
import { HealthStackParamList } from './HealthStackScreens'
import PrescriptionDetails from './Pharmacy/PrescriptionDetails/PrescriptionDetails'
import PrescriptionHistory from './Pharmacy/PrescriptionHistory/PrescriptionHistory'
import SecureMessaging from './SecureMessaging'
import FolderMessages from './SecureMessaging/FolderMessages/FolderMessages'
import ViewMessageScreen from './SecureMessaging/ViewMessage/ViewMessageScreen'
import VaccineDetailsScreen from './Vaccines/VaccineDetails/VaccineDetailsScreen'
import VaccineListScreen from './Vaccines/VaccineList/VaccineListScreen'

const { WEBVIEW_URL_CORONA_FAQ, LINK_URL_APPLY_FOR_HEALTH_CARE } = getEnv()

type HealthScreenProps = StackScreenProps<HealthStackParamList, 'Health'>

export function HealthScreen({}: HealthScreenProps) {
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const isScreenContentAllowed = screenContentAllowed('WG_Health')
  const isFocused = useIsFocused()

  const appointmentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appointments)
  const smInDowntime = useDowntime(DowntimeFeatureTypeConstants.secureMessaging)
  const rxInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)

  const { data: userAuthorizedServices } = useAuthorizedServices({ enabled: isScreenContentAllowed })
  const {
    data: prescriptionData,
    isFetching: fetchingPrescriptions,
    isError: prescriptionsError,
  } = usePrescriptions({
    enabled: userAuthorizedServices?.prescriptions && !rxInDowntime,
  })
  const upcomingAppointmentDateRange = getUpcomingAppointmentDateRange()
  const {
    data: apptsData,
    isLoading: loadingAppointments,
    isError: appointmentsError,
  } = useAppointments(
    upcomingAppointmentDateRange.startDate,
    upcomingAppointmentDateRange.endDate,
    TimeFrameTypeConstants.UPCOMING,
    1,
    {
      enabled: userAuthorizedServices?.appointments && !appointmentsInDowntime,
    },
  )
  const upcomingAppointmentsCount = apptsData?.meta?.upcomingAppointmentsCount
  const upcomingDaysLimit = apptsData?.meta?.upcomingDaysLimit
  const {
    data: foldersData,
    isFetching: loadingInbox,
    isError: inboxError,
  } = useFolders({
    enabled: isFocused && isScreenContentAllowed && userAuthorizedServices?.secureMessaging && !smInDowntime,
  })
  const unreadMessageCount = foldersData?.inboxUnreadCount || 0

  const featureInDowntime = appointmentsInDowntime || smInDowntime || rxInDowntime
  const activityError = appointmentsError || inboxError || prescriptionsError
  const showAlert = featureInDowntime || activityError
  const alertMessage = featureInDowntime ? t('health.activity.downtime') : t('health.activity.error')

  const enrolledInVAHealthCare =
    userAuthorizedServices?.appointments ||
    userAuthorizedServices?.secureMessaging ||
    userAuthorizedServices?.prescriptions ||
    userAuthorizedServices?.scheduleAppointments

  const onCoronaVirusFAQ = () => {
    logAnalyticsEvent(Events.vama_covid_links('health_screen'))
    navigateTo('Webview', {
      url: WEBVIEW_URL_CORONA_FAQ,
      displayTitle: t('webview.vagov'),
      loadingMessage: t('webview.covidUpdates.loading'),
    })
  }

  return (
    <CategoryLanding title={t('health.title')} testID="healthCategoryTestID">
      <Box mb={!CernerAlert ? theme.dimensions.contentMarginBottom : theme.dimensions.standardMarginBetween}>
        <LargeNavButton
          title={t('appointments')}
          onPress={() => navigateTo('Appointments')}
          showLoading={loadingAppointments}
          subText={
            upcomingAppointmentsCount && upcomingDaysLimit
              ? t('appointments.activityButton.subText', {
                  count: upcomingAppointmentsCount,
                  dayCount: upcomingDaysLimit,
                })
              : undefined
          }
        />
        <LargeNavButton
          title={t('secureMessaging.title')}
          onPress={() => navigateTo('SecureMessaging', { activeTab: 0 })}
          showLoading={loadingInbox}
          subText={
            unreadMessageCount ? t('secureMessaging.activityButton.subText', { count: unreadMessageCount }) : undefined
          }
        />
        {featureEnabled('prescriptions') && (
          <LargeNavButton
            title={t('prescription.title')}
            onPress={() => navigateTo('PrescriptionHistory')}
            showLoading={fetchingPrescriptions}
            testID="prescriptionsNavButtonTestID"
            subText={
              prescriptionData?.meta.prescriptionStatusCount.isRefillable
                ? t('prescriptions.activityButton.subText', {
                    count: prescriptionData?.meta.prescriptionStatusCount.isRefillable,
                  })
                : undefined
            }
          />
        )}
        <LargeNavButton
          title={t('vaVaccines.buttonTitle')}
          a11yHint={t('vaVaccines.a11yHint')}
          onPress={() => navigateTo('VaccineList')}
        />
        <LargeNavButton title={t('covid19Updates.title')} onPress={onCoronaVirusFAQ} />
        {showAlert && <CategoryLandingAlert text={alertMessage} isError={activityError} />}
      </Box>
      {CernerAlert && (
        <Box mb={theme.dimensions.contentMarginBottom}>
          <CernerAlert />
        </Box>
      )}
      {!enrolledInVAHealthCare && (
        <Box mb={theme.dimensions.contentMarginBottom}>
          <AnnouncementBanner
            title={t('applyForHealthCare')}
            link={LINK_URL_APPLY_FOR_HEALTH_CARE}
            a11yLabel={a11yLabelVA(t('applyForHealthCare'))}
          />
        </Box>
      )}
    </CategoryLanding>
  )
}

type HealthStackScreenProps = Record<string, unknown>

const HealthScreenStack = createStackNavigator<HealthStackParamList>()

/**
 * Stack screen for the Health tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
function HealthStackScreen({}: HealthStackScreenProps) {
  const screenOptions = {
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  }
  return (
    <HealthScreenStack.Navigator
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
      <HealthScreenStack.Screen name="Health" component={HealthScreen} options={{ headerShown: false }} />
      <HealthScreenStack.Screen
        name="Appointments"
        component={Appointments}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HealthScreenStack.Screen name="FolderMessages" component={FolderMessages} options={{ headerShown: false }} />
      <HealthScreenStack.Screen
        name="PastAppointmentDetails"
        component={PastAppointmentDetails}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HealthScreenStack.Screen
        name="PrescriptionDetails"
        component={PrescriptionDetails}
        options={{ headerShown: false }}
      />
      <HealthScreenStack.Screen
        name="PrescriptionHistory"
        component={PrescriptionHistory}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HealthScreenStack.Screen
        name="SecureMessaging"
        component={SecureMessaging}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HealthScreenStack.Screen
        name="UpcomingAppointmentDetails"
        component={UpcomingAppointmentDetails}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HealthScreenStack.Screen
        name="VaccineDetails"
        component={VaccineDetailsScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HealthScreenStack.Screen
        name="VaccineList"
        component={VaccineListScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HealthScreenStack.Screen name="ViewMessage" component={ViewMessageScreen} options={{ headerShown: false }} />
    </HealthScreenStack.Navigator>
  )
}

export default HealthStackScreen
