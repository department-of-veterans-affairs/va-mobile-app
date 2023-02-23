import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { FULLSCREEN_SUBTASK_OPTIONS, LARGE_PANEL_OPTIONS } from 'constants/screens'
import { PhoneData, PhoneType } from 'store/api/types'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import DebugScreen from './ProfileScreen/SettingsScreen/DeveloperScreen'
import EditEmailScreen from './ProfileScreen/ContactInformationScreen/EditEmailScreen'
import EditPhoneNumberScreen from './ProfileScreen/ContactInformationScreen/EditPhoneNumberScreen'
import GenderIdentityScreen from './ProfileScreen/PersonalInformationScreen/GenderIdentityScreen'
import HapticsDemoScreen from './ProfileScreen/SettingsScreen/DeveloperScreen/HapticsDemoScreen'
import HowDoIUpdateScreen from './ProfileScreen/PersonalInformationScreen/HowDoIUpdateScreen/HowDoIUpdateScreen'
import HowWillYouScreen from './ProfileScreen/ContactInformationScreen/HowWillYouScreen'
import IncorrectServiceInfo from './ProfileScreen/MilitaryInformationScreen/IncorrectServiceInfo'
import PreferredNameScreen from './ProfileScreen/PersonalInformationScreen/PreferredNameScreen'
import RemoteConfigScreen from './ProfileScreen/SettingsScreen/DeveloperScreen/RemoteConfigScreen'
import SandboxScreen from './ProfileScreen/SettingsScreen/DeveloperScreen/SandboxScreen/SandboxScreen'
import VeteransCrisisLineScreen from './VeteransCrisisLineScreen/VeteransCrisisLineScreen'
import WhatToKnowScreen from './ProfileScreen/PersonalInformationScreen/GenderIdentityScreen/WhatToKnowScreen'

export type HomeStackParamList = WebviewStackParams & {
  Home: undefined
  Profile: undefined
  ContactVA: undefined
  VeteransCrisisLine: undefined
  Debug: undefined
  EditEmail: undefined
  EditPhoneNumber: { displayTitle: string; phoneType: PhoneType; phoneData: PhoneData }
  GenderIdentity: undefined
  HowDoIUpdate: { screenType: string }
  HowWillYou: undefined
  IncorrectServiceInfo: undefined
  ManageYourAccount: undefined
  MilitaryInformation: undefined
  NotificationsSettings: undefined
  PersonalInformation: undefined
  PreferredName: undefined
  ContactInformation: undefined
  RemoteConfig: undefined
  Sandbox: undefined
  Settings: undefined
  HapticsDemoScreen: undefined
  WhatToKnow: undefined
}

const HomeStack = createStackNavigator<HomeStackParamList>()

export const getHomeScreens = (t: TFunction) => {
  return [
    <HomeStack.Screen key={'VeteransCrisisLine'} name="VeteransCrisisLine" component={VeteransCrisisLineScreen} options={LARGE_PANEL_OPTIONS} />,
    <HomeStack.Screen key={'Debug'} name="Debug" component={DebugScreen} options={{ title: t('debug.title') }} />,
    <HomeStack.Screen key={'RemoteConfig'} name="RemoteConfig" component={RemoteConfigScreen} options={{ title: 'Remote Config' }} />,
    <HomeStack.Screen key={'Sandbox'} name="Sandbox" component={SandboxScreen} options={{ title: 'Sandbox' }} />,
    <HomeStack.Screen key={'PreferredName'} name="PreferredName" component={PreferredNameScreen} options={FULLSCREEN_SUBTASK_OPTIONS} />,
    <HomeStack.Screen key={'HapticsDemoScreen'} name="HapticsDemoScreen" component={HapticsDemoScreen} options={{ headerShown: false }} />,
    <HomeStack.Screen key={'EditPhoneNumber'} name="EditPhoneNumber" component={EditPhoneNumberScreen} options={FULLSCREEN_SUBTASK_OPTIONS} />,
    <HomeStack.Screen key={'EditEmail'} name="EditEmail" component={EditEmailScreen} options={FULLSCREEN_SUBTASK_OPTIONS} />,
    <HomeStack.Screen key={'GenderIdentity'} name="GenderIdentity" component={GenderIdentityScreen} options={FULLSCREEN_SUBTASK_OPTIONS} />,
    <HomeStack.Screen key={'HowDoIUpdate'} name="HowDoIUpdate" component={HowDoIUpdateScreen} options={LARGE_PANEL_OPTIONS} />,
    <HomeStack.Screen key={'HowWillYou'} name="HowWillYou" component={HowWillYouScreen} options={LARGE_PANEL_OPTIONS} />,
    <HomeStack.Screen key={'IncorrectServiceInfo'} name="IncorrectServiceInfo" component={IncorrectServiceInfo} options={LARGE_PANEL_OPTIONS} />,
    <HomeStack.Screen key={'WhatToKnow'} name="WhatToKnow" component={WhatToKnowScreen} options={LARGE_PANEL_OPTIONS} />,
  ]
}
