import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, CategoryLanding, FocusedNavHeaderText, LargeNavButton } from 'components'
import { CloseSnackbarOnNavigation } from 'constants/common'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { HealthStackParamList } from './HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionState, loadAllPrescriptions } from 'store/slices'
import { RootState } from 'store'
import { featureEnabled } from 'utils/remoteConfig'
import { getInbox } from 'store/slices/secureMessagingSlice'
import { getInboxUnreadCount } from './SecureMessaging/SecureMessaging'
import { logCOVIDClickAnalytics } from 'store/slices/vaccineSlice'
import { useAppDispatch, useDowntime, useHasCernerFacilities, useRouteNavigation, useTheme } from 'utils/hooks'
import { useHeaderStyles } from 'utils/hooks/headerStyles'
import { useSelector } from 'react-redux'
import Appointments from './Appointments'
import CernerAlert from './CernerAlert'
import FolderMessages from './SecureMessaging/FolderMessages/FolderMessages'
import PastAppointmentDetails from './Appointments/PastAppointments/PastAppointmentDetails'
import PrescriptionDetails from './Pharmacy/PrescriptionDetails/PrescriptionDetails'
import PrescriptionHistory from './Pharmacy/PrescriptionHistory/PrescriptionHistory'
import SecureMessaging from './SecureMessaging'
import UpcomingAppointmentDetails from './Appointments/UpcomingAppointments/UpcomingAppointmentDetails'
import VaccineDetailsScreen from './Vaccines/VaccineDetails/VaccineDetailsScreen'
import VaccineListScreen from './Vaccines/VaccineList/VaccineListScreen'
import ViewMessageScreen from './SecureMessaging/ViewMessage/ViewMessageScreen'
import getEnv from 'utils/env'

const { WEBVIEW_URL_CORONA_FAQ } = getEnv()

type HealthScreenProps = StackScreenProps<HealthStackParamList, 'Health'>

export const HealthScreen: FC<HealthScreenProps> = ({ navigation }) => {
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const { t: th } = useTranslation(NAMESPACE.HOME)
  const dispatch = useAppDispatch()

  const unreadCount = useSelector<RootState, number>(getInboxUnreadCount)
  const hasCernerFacilities = useHasCernerFacilities()
  const { prescriptionsNeedLoad } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)

  const onAppointments = navigateTo('Appointments')
  const onSecureMessaging = navigateTo('SecureMessaging')
  const onVaVaccines = navigateTo('VaccineList')
  const pharmacyNavHandler = navigateTo('PrescriptionHistory')
  const onPharmacy = () => {
    // If rx list is already loaded, reload it to ensure freshness
    if (!prescriptionsNeedLoad) {
      dispatch(loadAllPrescriptions(ScreenIDTypesConstants.HEALTH_SCREEN_ID))
    }
    pharmacyNavHandler()
  }
  const onCoronaVirusFAQ = () => {
    dispatch(logCOVIDClickAnalytics('health_screen'))
    navigation.navigate('Webview', { url: WEBVIEW_URL_CORONA_FAQ, displayTitle: tc('webview.vagov'), loadingMessage: th('webview.covidUpdates.loading') })
  }
  const smNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.secureMessaging)

  useEffect(() => {
    if (smNotInDowntime) {
      // fetch inbox metadata to display unread messages count tag
      dispatch(getInbox(ScreenIDTypesConstants.HEALTH_SCREEN_ID))
    }
  }, [dispatch, smNotInDowntime])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (headerTitle) => <FocusedNavHeaderText headerTitle={headerTitle.children} />,
    })
  }, [navigation])

  return (
    <CategoryLanding title={tc('health')}>
      <Box mb={!hasCernerFacilities ? theme.dimensions.contentMarginBottom : theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <LargeNavButton
          title={t('appointments.title')}
          a11yHint={t('appointments.a11yHint')}
          onPress={onAppointments}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
        <LargeNavButton
          title={t('secureMessaging.title')}
          a11yHint={t('secureMessaging.a11yHint')}
          onPress={onSecureMessaging}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
          tagCount={unreadCount}
          tagCountA11y={t('secureMessaging.tag.a11y', { unreadCount })}
        />
        {featureEnabled('prescriptions') && (
          <LargeNavButton
            title={t('prescription.title')}
            a11yHint={t('prescription.A11yHint')}
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
          onPress={onVaVaccines}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
        <LargeNavButton
          title={t('covid19Updates.title')}
          a11yHint={t('covid19Updates.a11yHint')}
          onPress={onCoronaVirusFAQ}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
      </Box>
      <Box mb={hasCernerFacilities ? theme.dimensions.contentMarginBottom : 0}>
        <CernerAlert />
      </Box>
    </CategoryLanding>
  )
}

type HealthStackScreenProps = Record<string, unknown>

const HealthScreenStack = createStackNavigator()

/**
 * Stack screen for the Health tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
const HealthStackScreen: FC<HealthStackScreenProps> = () => {
  const headerStyles = useHeaderStyles()

  return (
    <HealthScreenStack.Navigator
      screenOptions={headerStyles}
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
      <HealthScreenStack.Screen name="Appointments" component={Appointments} options={{ headerShown: false }} />
      <HealthScreenStack.Screen name="FolderMessages" component={FolderMessages} options={{ headerShown: false }} />
      <HealthScreenStack.Screen name="PastAppointmentDetails" component={PastAppointmentDetails} options={{ headerShown: false }} />
      <HealthScreenStack.Screen name="PrescriptionDetails" component={PrescriptionDetails} options={{ headerShown: false }} />
      <HealthScreenStack.Screen name="PrescriptionHistory" component={PrescriptionHistory} options={{ headerShown: false }} />
      <HealthScreenStack.Screen name="SecureMessaging" component={SecureMessaging} options={{ headerShown: false }} />
      <HealthScreenStack.Screen name="UpcomingAppointmentDetails" component={UpcomingAppointmentDetails} options={{ headerShown: false }} />
      <HealthScreenStack.Screen name="VaccineDetails" component={VaccineDetailsScreen} options={{ headerShown: false }} />
      <HealthScreenStack.Screen name="VaccineList" component={VaccineListScreen} options={{ headerShown: false }} />
      <HealthScreenStack.Screen name="ViewMessageScreen" component={ViewMessageScreen} options={{ headerShown: false }} />
    </HealthScreenStack.Navigator>
  )
}

export default HealthStackScreen
