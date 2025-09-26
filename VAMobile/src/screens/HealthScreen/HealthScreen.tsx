import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { CardStyleInterpolators, StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'

import { useAppointments } from 'api/appointments'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useFacilitiesInfo } from 'api/facilities/getFacilitiesInfo'
import { useMedicalCopays } from 'api/medicalCopays'
import { usePrescriptions } from 'api/prescriptions'
import { useFolders } from 'api/secureMessaging'
import {
  AnnouncementBanner,
  Box,
  CategoryLanding,
  CategoryLandingAlert,
  EmailConfirmationAlert,
  LargeNavButton,
} from 'components'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { NAMESPACE } from 'constants/namespaces'
import { FEATURE_LANDING_TEMPLATE_OPTIONS } from 'constants/screens'
import { TravelClaimsScreenEntry } from 'constants/travelPay'
import AllergyDetailsScreen from 'screens/HealthScreen/Allergies/AllergyDetails/AllergyDetailsScreen'
import AllergyListScreen from 'screens/HealthScreen/Allergies/AllergyList/AllergyListScreen'
import Appointments from 'screens/HealthScreen/Appointments'
import PastAppointmentDetails from 'screens/HealthScreen/Appointments/PastAppointments/PastAppointmentDetails'
import UpcomingAppointmentDetails from 'screens/HealthScreen/Appointments/UpcomingAppointments/UpcomingAppointmentDetails'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import LabsAndTestsDetailsScreen from 'screens/HealthScreen/LabsAndTests/LabsAndTestsDetails/LabsAndTestsDetailsScreen'
import LabsAndTestsListScreen from 'screens/HealthScreen/LabsAndTests/LabsAndTestsList/LabsAndTestsListScreen'
import MedicalRecordsScreen from 'screens/HealthScreen/MedicalRecordsScreen'
import PrescriptionDetails from 'screens/HealthScreen/Pharmacy/PrescriptionDetails/PrescriptionDetails'
import PrescriptionHistory from 'screens/HealthScreen/Pharmacy/PrescriptionHistory/PrescriptionHistory'
import SecureMessaging from 'screens/HealthScreen/SecureMessaging'
import FolderMessages from 'screens/HealthScreen/SecureMessaging/FolderMessages/FolderMessages'
import ViewMessageScreen from 'screens/HealthScreen/SecureMessaging/ViewMessage/ViewMessageScreen'
import TravelPayClaimsScreen from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsScreen'
import VaccineDetailsScreen from 'screens/HealthScreen/Vaccines/VaccineDetails/VaccineDetailsScreen'
import VaccineListScreen from 'screens/HealthScreen/Vaccines/VaccineList/VaccineListScreen'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { FIRST_TIME_LOGIN, NEW_SESSION } from 'store/slices'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getUpcomingAppointmentDateRange } from 'utils/appointments'
import getEnv from 'utils/env'
import { numberToUSDollars } from 'utils/formattingUtils'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'
import { screenContentAllowed } from 'utils/waygateConfig'

const { LINK_URL_APPLY_FOR_HEALTH_CARE } = getEnv()

type HealthScreenProps = StackScreenProps<HealthStackParamList, 'Health'>

// TODO: consider re-factoring this component for brevity.
export function HealthScreen({}: HealthScreenProps) {
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const isFocused = useIsFocused()
  const isScreenContentAllowed = screenContentAllowed('WG_Health')

  const { data: facilitiesInfo } = useFacilitiesInfo()
  const cernerFacilities = facilitiesInfo?.filter((f) => f.cerner) || []
  const cernerExist = cernerFacilities.length >= 1
  const allCerner = facilitiesInfo?.length === cernerFacilities.length
  const mixedCerner = cernerExist && !allCerner

  const appointmentsInDowntime = useDowntime(DowntimeFeatureTypeConstants.appointments)
  const smInDowntime = useDowntime(DowntimeFeatureTypeConstants.secureMessaging)
  const rxInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)

  const { data: userAuthorizedServices } = useAuthorizedServices()
  const {
    data: prescriptionData,
    isFetching: fetchingPrescriptions,
    isError: prescriptionsError,
  } = usePrescriptions({
    enabled: isFocused,
  })
  const upcomingAppointmentDateRange = getUpcomingAppointmentDateRange()
  const {
    data: apptsData,
    isFetching: loadingAppointments,
    isError: appointmentsError,
  } = useAppointments(
    upcomingAppointmentDateRange.startDate,
    upcomingAppointmentDateRange.endDate,
    TimeFrameTypeConstants.UPCOMING,
    {
      enabled: isFocused,
    },
  )
  const upcomingAppointmentsCount = apptsData?.meta?.upcomingAppointmentsCount
  const upcomingDaysLimit = apptsData?.meta?.upcomingDaysLimit
  const {
    data: foldersData,
    isFetching: loadingInbox,
    isError: inboxError,
  } = useFolders({
    enabled: isFocused,
  })
  const unreadMessageCount = foldersData?.inboxUnreadCount || 0

  const { summary: copaysSummary, isLoading: copaysLoading, error: copaysError } = useMedicalCopays({ enabled: true })

  const copaysSubText =
    !copaysLoading && !copaysError && copaysSummary.count > 0 && copaysSummary.amountDue > 0
      ? t('copays.activityButton.subText', {
          amount: numberToUSDollars(copaysSummary.amountDue),
          count: copaysSummary.count,
        })
      : undefined

  useEffect(() => {
    async function healthHelpScreenCheck() {
      const firstTimeLogin = await AsyncStorage.getItem(FIRST_TIME_LOGIN)
      const newSession = await AsyncStorage.getItem(NEW_SESSION)

      if (isScreenContentAllowed && cernerExist && ((firstTimeLogin && mixedCerner) || (newSession && allCerner))) {
        await AsyncStorage.setItem(FIRST_TIME_LOGIN, '')
        await AsyncStorage.setItem(NEW_SESSION, '')
      }
    }

    healthHelpScreenCheck()
  }, [allCerner, cernerExist, isScreenContentAllowed, mixedCerner])

  const featureInDowntime = appointmentsInDowntime || smInDowntime || rxInDowntime
  const activityError = appointmentsError || inboxError || prescriptionsError
  const showAlert = featureInDowntime || activityError
  const alertMessage = featureInDowntime ? t('health.activity.downtime') : t('health.activity.error')

  const enrolledInVAHealthCare =
    userAuthorizedServices?.appointments ||
    userAuthorizedServices?.secureMessaging ||
    userAuthorizedServices?.prescriptions ||
    userAuthorizedServices?.scheduleAppointments

  return (
    <CategoryLanding title={t('health.title')} testID="healthCategoryTestID">
      <Box mb={!cernerExist ? theme.dimensions.contentMarginBottom : theme.dimensions.standardMarginBetween}>
        {featureEnabled('showEmailConfirmationAlert') && <EmailConfirmationAlert />}
        <LargeNavButton
          title={t('appointments')}
          onPress={() => navigateTo('Appointments')}
          showLoading={loadingAppointments}
          subText={
            upcomingAppointmentsCount && upcomingDaysLimit
              ? t('upcomingAppointments.activityButton.subText', {
                  count: upcomingAppointmentsCount,
                  dayCount: upcomingDaysLimit,
                })
              : undefined
          }
          testID="toAppointmentsID"
        />
        {featureEnabled('overpayCopay') && (
          <LargeNavButton title={t('copays.title')} onPress={() => navigateTo('Copays')} subText={copaysSubText} />
        )}
        <LargeNavButton
          title={t('secureMessaging.title')}
          onPress={() => navigateTo('SecureMessaging', { activeTab: 0 })}
          showLoading={loadingInbox}
          subText={
            unreadMessageCount ? t('secureMessaging.activityButton.subText', { count: unreadMessageCount }) : undefined
          }
          testID="toMessageInboxID"
        />
        <LargeNavButton
          title={t('prescription.title')}
          onPress={() => navigateTo('PrescriptionHistory')}
          showLoading={fetchingPrescriptions}
          subText={
            prescriptionData?.meta.prescriptionStatusCount.isRefillable
              ? t('prescriptions.activityButton.subText', {
                  count: prescriptionData?.meta.prescriptionStatusCount.isRefillable,
                })
              : undefined
          }
          testID="toPrescriptionsID"
        />
        <LargeNavButton
          title={t('vaMedicalRecords.buttonTitle')}
          onPress={() => navigateTo('MedicalRecordsList')}
          testID="toMedicalRecordsListID"
        />
        {featureEnabled('travelPayStatusList') && (
          <LargeNavButton
            title={t('travelPay.title')}
            onPress={() => navigateTo('TravelPayClaims', { from: TravelClaimsScreenEntry.Health })}
            testID="toTravelPayClaimsID"
          />
        )}
        {showAlert && <CategoryLandingAlert text={alertMessage} isError={activityError} />}
      </Box>
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
  const snackbar = useSnackbar()
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
            snackbar.hide()
          }
        },
        blur: () => {
          snackbar.hide()
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
        name="TravelPayClaims"
        component={TravelPayClaimsScreen}
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
      <HealthScreenStack.Screen
        name="AllergyDetails"
        component={AllergyDetailsScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HealthScreenStack.Screen
        name="AllergyList"
        component={AllergyListScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HealthScreenStack.Screen
        name="MedicalRecordsList"
        component={MedicalRecordsScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HealthScreenStack.Screen
        name="LabsAndTestsList"
        component={LabsAndTestsListScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HealthScreenStack.Screen
        name="LabsAndTestsDetailsScreen"
        component={LabsAndTestsDetailsScreen}
        options={FEATURE_LANDING_TEMPLATE_OPTIONS}
      />
      <HealthScreenStack.Screen name="ViewMessage" component={ViewMessageScreen} options={{ headerShown: false }} />
    </HealthScreenStack.Navigator>
  )
}

export default HealthStackScreen
