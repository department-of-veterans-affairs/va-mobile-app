import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'

import { FULLSCREEN_SUBTASK_OPTIONS, LARGE_PANEL_OPTIONS } from 'constants/screens'
import { PhoneData, PhoneType } from 'api/types'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import EditEmailScreen from './ProfileScreen/ContactInformationScreen/EditEmailScreen'
import EditPhoneNumberScreen from './ProfileScreen/ContactInformationScreen/EditPhoneNumberScreen'
import GenderIdentityScreen from './ProfileScreen/PersonalInformationScreen/GenderIdentityScreen'
import HowDoIUpdateScreen from './ProfileScreen/PersonalInformationScreen/HowDoIUpdateScreen/HowDoIUpdateScreen'
import HowWillYouScreen from './ProfileScreen/ContactInformationScreen/HowWillYouScreen'
import IncorrectServiceInfo from './ProfileScreen/MilitaryInformationScreen/IncorrectServiceInfo'
import PreferredNameScreen from './ProfileScreen/PersonalInformationScreen/PreferredNameScreen'
import VeteranStatusScreen from './VeteranStatusScreen/VeteranStatusScreen'
import VeteransCrisisLineScreen from './VeteransCrisisLineScreen/VeteransCrisisLineScreen'
import WhatToKnowScreen from './ProfileScreen/PersonalInformationScreen/GenderIdentityScreen/WhatToKnowScreen'

export type HomeStackParamList = WebviewStackParams & {
  Home: undefined
  Profile: undefined
  ContactVA: undefined
  VeteranStatus: undefined
  VeteransCrisisLine: undefined
  Developer: undefined
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

export const getHomeScreens = () => {
  return [
    <HomeStack.Screen key={'VeteransCrisisLine'} name="VeteransCrisisLine" component={VeteransCrisisLineScreen} options={LARGE_PANEL_OPTIONS} />,
    <HomeStack.Screen key={'VeteranStatus'} name="VeteranStatus" component={VeteranStatusScreen} options={LARGE_PANEL_OPTIONS} />,
    <HomeStack.Screen key={'PreferredName'} name="PreferredName" component={PreferredNameScreen} options={FULLSCREEN_SUBTASK_OPTIONS} />,
    <HomeStack.Screen key={'EditPhoneNumber'} name="EditPhoneNumber" component={EditPhoneNumberScreen} options={FULLSCREEN_SUBTASK_OPTIONS} />,
    <HomeStack.Screen key={'EditEmail'} name="EditEmail" component={EditEmailScreen} options={FULLSCREEN_SUBTASK_OPTIONS} />,
    <HomeStack.Screen key={'GenderIdentity'} name="GenderIdentity" component={GenderIdentityScreen} options={FULLSCREEN_SUBTASK_OPTIONS} />,
    <HomeStack.Screen key={'HowDoIUpdate'} name="HowDoIUpdate" component={HowDoIUpdateScreen} options={LARGE_PANEL_OPTIONS} />,
    <HomeStack.Screen key={'HowWillYou'} name="HowWillYou" component={HowWillYouScreen} options={LARGE_PANEL_OPTIONS} />,
    <HomeStack.Screen key={'IncorrectServiceInfo'} name="IncorrectServiceInfo" component={IncorrectServiceInfo} options={LARGE_PANEL_OPTIONS} />,
    <HomeStack.Screen key={'WhatToKnow'} name="WhatToKnow" component={WhatToKnowScreen} options={LARGE_PANEL_OPTIONS} />,
  ]
}
