import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { ReactNode } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { PhoneData, PhoneType } from 'store/api/types'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import DebugScreen from './ProfileScreen/SettingsScreen/DebugScreen'
import EditEmailScreen from './ProfileScreen/PersonalInformationScreen/EditEmailScreen/EditEmailScreen'
import EditPhoneNumberScreen from './ProfileScreen/PersonalInformationScreen/EditPhoneNumberScreen/EditPhoneNumberScreen'
import HowDoIUpdateScreen from './ProfileScreen/PersonalInformationScreen/HowDoIUpdateScreen/HowDoIUpdateScreen'
import HowWillYouScreen from './ProfileScreen/PersonalInformationScreen/HowWillYouScreen'
import IncorrectServiceInfo from './ProfileScreen/MilitaryInformationScreen/IncorrectServiceInfo'
import ManageYourAccount from './ProfileScreen/SettingsScreen/ManageYourAccount/ManageYourAccount'
import NotificationsSettingsScreen from './ProfileScreen/SettingsScreen/NotificationsSettingsScreen/NotificationsSettingsScreen'
import RemoteConfigScreen from './ProfileScreen/SettingsScreen/DebugScreen/RemoteConfigScreen'
import SandboxScreen from './ProfileScreen/SettingsScreen/DebugScreen/SandboxScreen/SandboxScreen'
import SettingsScreen from './ProfileScreen/SettingsScreen'
import VeteransCrisisLineScreen from './VeteransCrisisLineScreen/VeteransCrisisLineScreen'

export type HomeStackParamList = WebviewStackParams & {
  Home: undefined
  Profile: undefined
  ContactVA: undefined
  VeteransCrisisLine: undefined
  Debug: undefined
  EditEmail: undefined
  EditPhoneNumber: { displayTitle: string; phoneType: PhoneType; phoneData: PhoneData }
  HowDoIUpdate: undefined
  HowWillYou: undefined
  IncorrectServiceInfo: undefined
  ManageYourAccount: undefined
  MilitaryInformation: undefined
  NotificationsSettings: undefined
  PersonalInformation: undefined
  RemoteConfig: undefined
  Sandbox: undefined
  Settings: undefined
}

const HomeStack = createStackNavigator<HomeStackParamList>()

export const getHomeScreens = (): Array<ReactNode> => {
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  return [
    <HomeStack.Screen
      key={'VeteransCrisisLine'}
      name="VeteransCrisisLine"
      component={VeteransCrisisLineScreen}
      options={{ headerShown: false, presentation: 'modal', ...TransitionPresets.ModalTransition }}
    />,
    <HomeStack.Screen key={'Settings'} name="Settings" component={SettingsScreen} options={{ headerShown: false }} />,
    <HomeStack.Screen key={'ManageYourAcount'} name="ManageYourAccount" component={ManageYourAccount} options={{ headerShown: false }} />,
    <HomeStack.Screen key={'Debug'} name="Debug" component={DebugScreen} options={{ title: tc('debug.title') }} />,
    <HomeStack.Screen key={'RemoteConfig'} name="RemoteConfig" component={RemoteConfigScreen} options={{ title: 'Remote Config' }} />,
    <HomeStack.Screen key={'Sandbox'} name="Sandbox" component={SandboxScreen} options={{ title: 'Sandbox' }} />,
    <HomeStack.Screen key={'EditPhoneNumber'} name="EditPhoneNumber" component={EditPhoneNumberScreen} options={{ headerShown: false }} />,
    <HomeStack.Screen key={'EditEmail'} name="EditEmail" component={EditEmailScreen} options={{ headerShown: false }} />,
    <HomeStack.Screen key={'NotificationsSettings'} name="NotificationsSettings" component={NotificationsSettingsScreen} options={{ headerShown: false }} />,
    <HomeStack.Screen
      key={'HowDoIUpdate'}
      name="HowDoIUpdate"
      component={HowDoIUpdateScreen}
      options={{ presentation: 'modal', ...TransitionPresets.ModalTransition, headerShown: false }}
    />,
    <HomeStack.Screen
      key={'HowWillYou'}
      name="HowWillYou"
      component={HowWillYouScreen}
      options={{ presentation: 'modal', ...TransitionPresets.ModalTransition, headerShown: false }}
    />,
    <HomeStack.Screen
      key={'IncorrectServiceInfo'}
      name="IncorrectServiceInfo"
      component={IncorrectServiceInfo}
      options={{ presentation: 'modal', ...TransitionPresets.ModalTransition, headerShown: false }}
    />,
  ]
}
