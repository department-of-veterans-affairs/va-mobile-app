import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import DebugScreen from './SettingsScreen/DebugScreen'
import HowDoIUpdateScreen from './PersonalInformationScreen/HowDoIUpdateScreen/HowDoIUpdateScreen'
import HowWillYouScreen from './PersonalInformationScreen/HowWillYouScreen'
import IncorrectServiceInfo from './MilitaryInformationScreen/IncorrectServiceInfo'
import ManageYourAccount from './SettingsScreen/ManageYourAccount/ManageYourAccount'
import MilitaryInformationScreen from './MilitaryInformationScreen'
import NotificationsSettingsScreen from './SettingsScreen/NotificationsSettingsScreen/NotificationsSettingsScreen'
import PersonalInformationScreen from './PersonalInformationScreen'
import RemoteConfigScreen from './SettingsScreen/DebugScreen/RemoteConfigScreen'
import SandboxScreen from './SettingsScreen/DebugScreen/SandboxScreen/SandboxScreen'
import SettingsScreen from './SettingsScreen'

export type ProfileStackParamList = {
  Profile: undefined
  Settings: undefined
  ManageYourAccount: undefined
  Debug: undefined
  RemoteConfig: undefined
  PersonalInformation: undefined
  MilitaryInformation: undefined
  NotificationsSettings: undefined
  HowDoIUpdate: undefined
  HowWillYou: undefined
  IncorrectServiceInfo: undefined
  Sandbox: undefined
}

const ProfileStack = createStackNavigator<ProfileStackParamList>()

export const getProfileScreens = (t: TFunction): Array<ReactNode> => {
  return [
    <ProfileStack.Screen key={'Settings'} name="Settings" component={SettingsScreen} options={{ title: t('settings.title') }} />,
    <ProfileStack.Screen key={'ManageYourAccount'} name="ManageYourAccount" component={ManageYourAccount} />,
    <ProfileStack.Screen key={'Debug'} name="Debug" component={DebugScreen} options={{ title: t(`${NAMESPACE.SETTINGS}:debug.title`) }} />,
    <ProfileStack.Screen key={'RemoteConfig'} name="RemoteConfig" component={RemoteConfigScreen} options={{ title: t('Remote Config') }} />,
    <ProfileStack.Screen key={'Sandbox'} name="Sandbox" component={SandboxScreen} options={{ title: t('Sandbox') }} />,
    <ProfileStack.Screen key={'PersonalInformation'} name="PersonalInformation" component={PersonalInformationScreen} options={{ title: t('personalInformation.headerTitle') }} />,
    <ProfileStack.Screen key={'MilitaryInformation'} name="MilitaryInformation" component={MilitaryInformationScreen} options={{ title: t('militaryInformation.title') }} />,
    <ProfileStack.Screen
      key={'NotificationsSettings'}
      name="NotificationsSettings"
      component={NotificationsSettingsScreen}
      options={{ title: t('notifications.settings.title') }}
    />,
    <ProfileStack.Screen key={'HowDoIUpdate'} name="HowDoIUpdate" component={HowDoIUpdateScreen} />,
    <ProfileStack.Screen key={'HowWillYou'} name="HowWillYou" component={HowWillYouScreen} />,
    <ProfileStack.Screen key={'IncorrectServiceInfo'} name="IncorrectServiceInfo" component={IncorrectServiceInfo} />,
  ]
}
