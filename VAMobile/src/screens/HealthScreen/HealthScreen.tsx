import React from 'react'
import { useTranslation } from 'react-i18next'

import { useIsFocused } from '@react-navigation/native'
import { CardStyleInterpolators, StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { useAppointments } from 'api/appointments'
import { usePrescriptions } from 'api/prescriptions'
import { useFolders } from 'api/secureMessaging'
import { Box, CategoryLanding, LargeNavButton } from 'components'
import { Events } from 'constants/analytics'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { CloseSnackbarOnNavigation } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { FEATURE_LANDING_TEMPLATE_OPTIONS } from 'constants/screens'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

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

const { WEBVIEW_URL_CORONA_FAQ } = getEnv()

type HealthScreenProps = StackScreenProps<HealthStackParamList, 'Health'>

export function HealthScreen({}: HealthScreenProps) {
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const isFocused = useIsFocused()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const { data: prescriptionData, isFetching: fetchingPrescriptions } = usePrescriptions({
    enabled: isFocused,
  })
  const upcomingAppointmentDateRange = getUpcomingAppointmentDateRange()
  const { data: apptsData, isLoading: loadingAppointments } = useAppointments(
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
  const { data: foldersData, isLoading: loadingInbox } = useFolders({
    enabled: isFocused,
  })
  const unreadMessageCount = foldersData?.inboxUnreadCount || 0

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
      </Box>
      {CernerAlert ? (
        <Box mb={theme.dimensions.contentMarginBottom}>
          <CernerAlert />
        </Box>
      ) : (
        <></>
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
