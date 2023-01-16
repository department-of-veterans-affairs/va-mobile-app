import { TFunction } from 'i18next'
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { PhoneData, PhoneType } from 'store/api/types'
import DebugScreen from './SettingsScreen/DebugScreen'
import EditEmailScreen from './PersonalInformationScreen/EditEmailScreen/EditEmailScreen'
import EditPhoneNumberScreen from './PersonalInformationScreen/EditPhoneNumberScreen/EditPhoneNumberScreen'
import HowDoIUpdateScreen from './PersonalInformationScreen/HowDoIUpdateScreen/HowDoIUpdateScreen'
import HowWillYouScreen from './PersonalInformationScreen/HowWillYouScreen'
import IncorrectServiceInfo from './MilitaryInformationScreen/IncorrectServiceInfo'
import ManageYourAccount from './SettingsScreen/ManageYourAccount/ManageYourAccount'
import MilitaryInformationScreen from './MilitaryInformationScreen'
import NotificationsSettingsScreen from './SettingsScreen/NotificationsSettingsScreen/NotificationsSettingsScreen'
import PersonalInformationScreen from './PersonalInformationScreen'
import ProfileScreen from '.'
import RemoteConfigScreen from './SettingsScreen/DebugScreen/RemoteConfigScreen'
import SandboxScreen from './SettingsScreen/DebugScreen/SandboxScreen/SandboxScreen'
import SettingsScreen from './SettingsScreen'

export type ProfileStackParamList = {
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
  ProfileScreen: undefined
  RemoteConfig: undefined
  Sandbox: undefined
  Settings: undefined
}

const ProfileStack = createStackNavigator<ProfileStackParamList>()

export const getProfileScreens = (t: TFunction): Array<ReactNode> => {
  return [
    <ProfileStack.Screen key={'ProfileScreen'} name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />,
    <ProfileStack.Screen key={'Settings'} name="Settings" component={SettingsScreen} options={{ headerShown: false }} />,
    <ProfileStack.Screen key={'ManageYourAccount'} name="ManageYourAccount" component={ManageYourAccount} options={{ headerShown: false }} />,
    <ProfileStack.Screen key={'Debug'} name="Debug" component={DebugScreen} options={{ title: t(`${NAMESPACE.COMMON}:debug.title`) }} />,
    <ProfileStack.Screen key={'RemoteConfig'} name="RemoteConfig" component={RemoteConfigScreen} options={{ title: t('Remote Config') }} />,
    <ProfileStack.Screen key={'Sandbox'} name="Sandbox" component={SandboxScreen} options={{ title: t('Sandbox') }} />,
    <ProfileStack.Screen key={'PersonalInformation'} name="PersonalInformation" component={PersonalInformationScreen} options={{ headerShown: false }} />,
    <ProfileStack.Screen key={'EditPhoneNumber'} name="EditPhoneNumber" component={EditPhoneNumberScreen} options={{ headerShown: false }} />,
    <ProfileStack.Screen key={'EditEmail'} name="EditEmail" component={EditEmailScreen} options={{ headerShown: false }} />,
    <ProfileStack.Screen key={'MilitaryInformation'} name="MilitaryInformation" component={MilitaryInformationScreen} options={{ headerShown: false }} />,
    <ProfileStack.Screen key={'NotificationsSettings'} name="NotificationsSettings" component={NotificationsSettingsScreen} options={{ headerShown: false }} />,
    <ProfileStack.Screen
      key={'HowDoIUpdate'}
      name="HowDoIUpdate"
      component={HowDoIUpdateScreen}
      options={{ presentation: 'modal', ...TransitionPresets.ModalTransition, headerShown: false }}
    />,
    <ProfileStack.Screen
      key={'HowWillYou'}
      name="HowWillYou"
      component={HowWillYouScreen}
      options={{ presentation: 'modal', ...TransitionPresets.ModalTransition, headerShown: false }}
    />,
    <ProfileStack.Screen
      key={'IncorrectServiceInfo'}
      name="IncorrectServiceInfo"
      component={IncorrectServiceInfo}
      options={{ presentation: 'modal', ...TransitionPresets.ModalTransition, headerShown: false }}
    />,
  ]
}
