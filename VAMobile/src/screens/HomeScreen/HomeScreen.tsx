import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { DateTime } from 'luxon'

import { useAppointments } from 'api/appointments'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useClaimsAndAppeals } from 'api/claimsAndAppeals'
import { useServiceHistory } from 'api/militaryService'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { usePrescriptions } from 'api/prescriptions'
import { useFolders } from 'api/secureMessaging'
import { ServiceHistoryData } from 'api/types'
import {
  Box,
  CategoryLanding,
  EncourageUpdateAlert,
  Nametag,
  SimpleList,
  SimpleListItemObj,
  TextView,
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
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent, logNonFatalErrorToFirebase } from 'utils/analytics'
import getEnv from 'utils/env'
import { useAppDispatch, useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

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

const { WEBVIEW_URL_CORONA_FAQ, WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>

export function HomeScreen({}: HomeScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const smInDowntime = useDowntime(DowntimeFeatureTypeConstants.secureMessaging)

  const { loginTimestamp } = useSelector<RootState, AnalyticsState>((state) => state.analytics)
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const upcomingAppointmentDateRange = getUpcomingAppointmentDateRange()
  const { data: apptsData, isFetched: apptsPrefetch } = useAppointments(
    upcomingAppointmentDateRange.startDate,
    upcomingAppointmentDateRange.endDate,
    TimeFrameTypeConstants.UPCOMING,
    1,
    {
      enabled: featureEnabled('homeScreenPrefetch'),
    },
  )
  const { data: claimsData, isFetched: claimsPrefetch } = useClaimsAndAppeals('ACTIVE', 1, {
    enabled: featureEnabled('homeScreenPrefetch'),
  })
  const { data: foldersData, isFetched: smPrefetch } = useFolders({
    enabled: userAuthorizedServices?.secureMessaging && !smInDowntime && featureEnabled('homeScreenPrefetch'),
  })
  const { data: prescriptionData, isFetched: rxPrefetch } = usePrescriptions({
    enabled: featureEnabled('homeScreenPrefetch'),
  })
  const { data: militaryServiceHistoryAttributes } = useServiceHistory({
    enabled: false,
  })
  const { data: personalInfoData } = usePersonalInformation({ enabled: false })

  useEffect(() => {
    if (apptsPrefetch && apptsData?.meta) {
      logAnalyticsEvent(Events.vama_hs_appts_count(apptsData.meta.upcomingAppointmentsCount))
    }
  }, [apptsData, apptsPrefetch])

  useEffect(() => {
    if (smPrefetch && foldersData) {
      const inboxFolder = foldersData.data.find((folder) => folder.attributes.name === FolderNameTypeConstants.inbox)
      if (inboxFolder) {
        logAnalyticsEvent(Events.vama_hs_sm_count(inboxFolder.attributes.unreadCount))
      }
    }
  }, [smPrefetch, foldersData])

  useEffect(() => {
    if (rxPrefetch && prescriptionData?.meta.prescriptionStatusCount.isRefillable) {
      logAnalyticsEvent(Events.vama_hs_rx_count(prescriptionData.meta.prescriptionStatusCount.isRefillable))
    }
  }, [rxPrefetch, prescriptionData])

  useEffect(() => {
    if (claimsPrefetch && claimsData?.meta.activeClaimsCount) {
      logAnalyticsEvent(Events.vama_hs_claims_count(claimsData?.meta.activeClaimsCount))
    }
  }, [claimsPrefetch, claimsData])

  useEffect(() => {
    if (apptsPrefetch && claimsPrefetch && rxPrefetch && smPrefetch) {
      logAnalyticsEvent(Events.vama_hs_load_time(DateTime.now().toMillis() - loginTimestamp))
    }
  }, [dispatch, apptsPrefetch, claimsPrefetch, rxPrefetch, smPrefetch, loginTimestamp])

  useEffect(() => {
    const SERVICE_INDICATOR_KEY = `@store_service_indicator${personalInfoData?.id}`
    const serviceHistory = militaryServiceHistoryAttributes?.serviceHistory || ([] as ServiceHistoryData)

    const setServiceIndicators = async (serviceIndicators: string): Promise<void> => {
      try {
        serviceHistory.forEach((service) => {
          if (service.honorableServiceIndicator === 'Y') {
            logAnalyticsEvent(Events.vama_vet_status_yStatus())
          } else if (service.honorableServiceIndicator === 'N') {
            logAnalyticsEvent(Events.vama_vet_status_nStatus())
          } else if (service.honorableServiceIndicator === 'Z') {
            logAnalyticsEvent(Events.vama_vet_status_zStatus(service.characterOfDischarge))
          }
        })
        await AsyncStorage.setItem(SERVICE_INDICATOR_KEY, serviceIndicators)
        console.log('setStorage: ', SERVICE_INDICATOR_KEY, serviceIndicators)
      } catch (err) {
        logNonFatalErrorToFirebase(err, 'loadOverrides: AsyncStorage error')
      }
    }

    const checkServiceIndicators = async (serviceIndicators: string): Promise<void> => {
      if (!serviceIndicators) {
        return
      }

      try {
        const asyncServiceIndicators = await AsyncStorage.getItem(SERVICE_INDICATOR_KEY)
        if (!asyncServiceIndicators || asyncServiceIndicators !== serviceIndicators) {
          console.log('asyncServiceIndicators: ', asyncServiceIndicators)
          setServiceIndicators(serviceIndicators)
        }
      } catch (err) {
        logNonFatalErrorToFirebase(err, 'loadOverrides: AsyncStorage error')
      }
    }

    if (serviceHistory) {
      let serviceIndicators = ''
      serviceHistory.forEach((service) => {
        console.log('service: ', JSON.stringify(service, undefined, 2))
        serviceIndicators = serviceIndicators.concat(service.honorableServiceIndicator)
      })
      console.log('serviceIndicators: ', serviceIndicators)
      checkServiceIndicators(serviceIndicators)
    }
  }, [militaryServiceHistoryAttributes?.serviceHistory, personalInfoData?.id])

  const navigateTo = useRouteNavigation()

  const onContactVA = () => {
    navigateTo('ContactVA')
  }

  const onFacilityLocator = () => {
    logAnalyticsEvent(Events.vama_find_location())
    navigateTo('Webview', {
      url: WEBVIEW_URL_FACILITY_LOCATOR,
      displayTitle: t('webview.vagov'),
      loadingMessage: t('webview.valocation.loading'),
    })
  }

  const onCoronaVirusFAQ = () => {
    logAnalyticsEvent(Events.vama_covid_links('home_screen'))
    navigateTo('Webview', {
      url: WEBVIEW_URL_CORONA_FAQ,
      displayTitle: t('webview.vagov'),
      loadingMessage: t('webview.covidUpdates.loading'),
    })
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

  const onProfile = () => {
    navigateTo('Profile')
  }

  const headerButton = {
    label: t('profile.title'),
    icon: profileIconProps,
    onPress: onProfile,
  }

  return (
    <CategoryLanding headerButton={headerButton} testID="homeScreenID">
      <Box>
        <EncourageUpdateAlert />
        <Nametag />
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
