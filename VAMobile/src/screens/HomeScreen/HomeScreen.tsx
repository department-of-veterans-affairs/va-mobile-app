import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, CategoryLanding, EncourageUpdateAlert, FocusedNavHeaderText, SimpleList, SimpleListItemObj, TextView, VAIconProps } from 'components'
import { CloseSnackbarOnNavigation } from 'constants/common'
import { DateTime } from 'luxon'
import { Events } from 'constants/analytics'
import { HomeStackParamList } from './HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, getProfileInfo } from 'store/slices/personalInformationSlice'
import { RootState } from 'store'
import { ScreenIDTypesConstants, UserGreetingTimeConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { logCOVIDClickAnalytics } from 'store/slices/vaccineSlice'
import { stringToTitleCase } from 'utils/formattingUtils'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'
import { useDemographics } from 'api/demographics/getDemographics'
import { useSelector } from 'react-redux'
import ContactInformationScreen from './ProfileScreen/ContactInformationScreen'
import ContactVAScreen from './ContactVAScreen/ContactVAScreen'
import DeveloperScreen from './ProfileScreen/SettingsScreen/DeveloperScreen'
import HapticsDemoScreen from './ProfileScreen/SettingsScreen/DeveloperScreen/HapticsDemoScreen'
import ManageYourAccount from './ProfileScreen/SettingsScreen/ManageYourAccount/ManageYourAccount'
import MilitaryInformationScreen from './ProfileScreen/MilitaryInformationScreen'
import Nametag from 'components/Nametag'
import NotificationsSettingsScreen from './ProfileScreen/SettingsScreen/NotificationsSettingsScreen/NotificationsSettingsScreen'
import PersonalInformationScreen from './ProfileScreen/PersonalInformationScreen'
import ProfileScreen from './ProfileScreen/ProfileScreen'
import RemoteConfigScreen from './ProfileScreen/SettingsScreen/DeveloperScreen/RemoteConfigScreen'
import SandboxScreen from './ProfileScreen/SettingsScreen/DeveloperScreen/SandboxScreen/SandboxScreen'
import SettingsScreen from './ProfileScreen/SettingsScreen'
import getEnv from 'utils/env'

const { WEBVIEW_URL_CORONA_FAQ, WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>

export const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()

  const { t } = useTranslation(NAMESPACE.COMMON)

  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const { profile } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const { data: demographics, isLoading: loadingDemographics } = useDemographics()
  const name = loadingDemographics ? '' : demographics?.preferredName || profile?.firstName || ''

  useEffect(() => {
    // Fetch the profile information
    if (name === '') {
      dispatch(getProfileInfo(ScreenIDTypesConstants.PROFILE_SCREEN_ID))
    }
  }, [dispatch, name])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (headerTitle) => <FocusedNavHeaderText headerTitle={headerTitle.children} />,
    })
  }, [navigation])

  const onContactVA = navigateTo('ContactVA')
  const onFacilityLocator = () => {
    logAnalyticsEvent(Events.vama_find_location())
    navigation.navigate('Webview', {
      url: WEBVIEW_URL_FACILITY_LOCATOR,
      displayTitle: t('webview.vagov'),
      loadingMessage: t('webview.valocation.loading'),
    })
  }
  const onCoronaVirusFAQ = () => {
    dispatch(logCOVIDClickAnalytics('home_screen'))
    navigation.navigate('Webview', { url: WEBVIEW_URL_CORONA_FAQ, displayTitle: t('webview.vagov'), loadingMessage: t('webview.covidUpdates.loading') })
  }

  const buttonDataList: Array<SimpleListItemObj> = [
    { text: t('contactVA.title'), a11yHintText: a11yLabelVA(t('contactVA.a11yHint')), onPress: onContactVA, testId: a11yLabelVA(t('contactVA.title')) },
    {
      text: t('findLocation.title'),
      a11yHintText: a11yLabelVA(t('findLocation.a11yHint')),
      onPress: onFacilityLocator,
      testId: a11yLabelVA(t('findLocation.title')),
    },
    { text: t('coronavirusFaqs.title'), a11yHintText: t('coronavirusFaqs.a11yHint'), onPress: onCoronaVirusFAQ, testId: a11yLabelVA(t('coronavirusFaqs.title')) },
  ]

  let greeting
  const currentHour = DateTime.now().toObject()?.hour
  if (currentHour === undefined) {
    greeting = null
  } else if (currentHour < UserGreetingTimeConstants.EVENING) {
    greeting = t('greetings.evening')
  } else if (currentHour < UserGreetingTimeConstants.MORNING) {
    greeting = t('greetings.morning')
  } else if (currentHour < UserGreetingTimeConstants.AFTERNOON) {
    greeting = t('greetings.afternoon')
  } else {
    greeting = t('greetings.evening')
  }
  const heading = `${greeting}${name ? `, ${stringToTitleCase(name)}` : ''}`

  const profileIconProps: VAIconProps = {
    name: 'ProfileSelected',
  }

  const headerButton = {
    label: t('profile.title'),
    icon: profileIconProps,
    onPress: navigateTo('Profile'),
  }

  return (
    <CategoryLanding headerButton={headerButton}>
      <Box flex={1} justifyContent="flex-start">
        <Box mx={theme.dimensions.gutter} mb={theme.dimensions.cardPadding}>
          <TextView variant={'MobileBodyBold'} accessibilityRole={'header'}>
            {heading}
          </TextView>
        </Box>
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

const HomeScreenStack = createStackNavigator()

/**
 * Stack screen for the Home tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
const HomeStackScreen: FC<HomeStackScreenProps> = () => {
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
      <HomeScreenStack.Screen name="ContactVA" component={ContactVAScreen} options={{ headerShown: false }} />
      <HomeScreenStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <HomeScreenStack.Screen name="PersonalInformation" component={PersonalInformationScreen} options={{ headerShown: false }} />
      <HomeScreenStack.Screen name="ContactInformation" component={ContactInformationScreen} options={{ headerShown: false }} />
      <HomeScreenStack.Screen name="MilitaryInformation" component={MilitaryInformationScreen} options={{ headerShown: false }} />
      <HomeScreenStack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <HomeScreenStack.Screen name="ManageYourAccount" component={ManageYourAccount} options={{ headerShown: false }} />
      <HomeScreenStack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} options={{ headerShown: false }} />
      <HomeScreenStack.Screen name="Developer" component={DeveloperScreen} options={{ headerShown: false }} />
      <HomeScreenStack.Screen name="RemoteConfig" component={RemoteConfigScreen} options={{ headerShown: false }} />
      <HomeScreenStack.Screen name="Sandbox" component={SandboxScreen} options={{ headerShown: false }} />
      <HomeScreenStack.Screen name="HapticsDemoScreen" component={HapticsDemoScreen} options={{ headerShown: false }} />
    </HomeScreenStack.Navigator>
  )
}

export default HomeStackScreen
