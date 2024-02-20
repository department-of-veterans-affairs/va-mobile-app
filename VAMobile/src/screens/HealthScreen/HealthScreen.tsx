import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { CardStyleInterpolators, StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { Box, CategoryLanding, LargeNavButton } from 'components'
import { CloseSnackbarOnNavigation } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { FEATURE_LANDING_TEMPLATE_OPTIONS } from 'constants/screens'
import { RootState } from 'store'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { loadAllPrescriptions } from 'store/slices'
import { logCOVIDClickAnalytics } from 'store/slices/vaccineSlice'
import getEnv from 'utils/env'
import { useAppDispatch, useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'
import { screenContentAllowed } from 'utils/waygateConfig'

import Appointments from './Appointments'
import PastAppointmentDetails from './Appointments/PastAppointments/PastAppointmentDetails'
import UpcomingAppointmentDetails from './Appointments/UpcomingAppointments/UpcomingAppointmentDetails'
import CernerAlert from './CernerAlert'
import { HealthStackParamList } from './HealthStackScreens'
import PrescriptionDetails from './Pharmacy/PrescriptionDetails/PrescriptionDetails'
import PrescriptionHistory from './Pharmacy/PrescriptionHistory/PrescriptionHistory'
import SecureMessaging from './SecureMessaging'
import FolderMessages from './SecureMessaging/FolderMessages/FolderMessages'
import { getInboxUnreadCount } from './SecureMessaging/SecureMessaging'
import ViewMessageScreen from './SecureMessaging/ViewMessage/ViewMessageScreen'
import VaccineDetailsScreen from './Vaccines/VaccineDetails/VaccineDetailsScreen'
import VaccineListScreen from './Vaccines/VaccineList/VaccineListScreen'

const { WEBVIEW_URL_CORONA_FAQ } = getEnv()

type HealthScreenProps = StackScreenProps<HealthStackParamList, 'Health'>

export function HealthScreen({}: HealthScreenProps) {
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()
  const isScreenContentAllowed = screenContentAllowed('WG_Health')

  const unreadCount = useSelector<RootState, number>(getInboxUnreadCount)
  const { data: userAuthorizedServices } = useAuthorizedServices({ enabled: isScreenContentAllowed })

  const onPharmacy = () => {
    // always reload to ensure freshness
    dispatch(loadAllPrescriptions(ScreenIDTypesConstants.HEALTH_SCREEN_ID))
    navigateTo('PrescriptionHistory')
  }
  const onCoronaVirusFAQ = () => {
    dispatch(logCOVIDClickAnalytics('health_screen'))
    navigateTo('Webview', {
      url: WEBVIEW_URL_CORONA_FAQ,
      displayTitle: t('webview.vagov'),
      loadingMessage: t('webview.covidUpdates.loading'),
    })
  }

  const smNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.secureMessaging)

  return (
    <CategoryLanding title={t('health.title')} testID="healthCategoryTestID">
      <Box
        mb={!CernerAlert ? theme.dimensions.contentMarginBottom : theme.dimensions.standardMarginBetween}
        mx={theme.dimensions.gutter}>
        <LargeNavButton
          title={t('appointments')}
          onPress={() => navigateTo('Appointments')}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
        <LargeNavButton
          title={t('secureMessaging.title')}
          onPress={() => navigateTo('SecureMessaging')}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
          tagCount={userAuthorizedServices?.secureMessaging && smNotInDowntime ? unreadCount : undefined}
          tagCountA11y={t('secureMessaging.tag.a11y', { unreadCount })}
        />
        {featureEnabled('prescriptions') && (
          <LargeNavButton
            title={t('prescription.title')}
            onPress={onPharmacy}
            borderWidth={theme.dimensions.buttonBorderWidth}
            borderColor={'secondary'}
            borderColorActive={'primaryDarkest'}
            borderStyle={'solid'}
          />
        )}
        <LargeNavButton
          title={t('vaVaccines.buttonTitle')}
          a11yHint={t('vaVaccines.a11yHint')}
          onPress={() => navigateTo('VaccineList')}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
        <LargeNavButton
          title={t('covid19Updates.title')}
          onPress={onCoronaVirusFAQ}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
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
