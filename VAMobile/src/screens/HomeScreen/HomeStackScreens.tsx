import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import { PhoneData, PhoneType } from 'api/types'
import { FULLSCREEN_SUBTASK_OPTIONS, LARGE_PANEL_OPTIONS } from 'constants/screens'
import EditEmailScreen from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/EditEmailScreen'
import EditPhoneNumberScreen from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/EditPhoneNumberScreen'
import HowWillYouScreen from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/HowWillYouScreen'
import IncorrectServiceInfo from 'screens/HomeScreen/ProfileScreen/MilitaryInformationScreen/IncorrectServiceInfo'
import HowDoIUpdateScreen from 'screens/HomeScreen/ProfileScreen/PersonalInformationScreen/HowDoIUpdateScreen/HowDoIUpdateScreen'
import PreferredNameScreen from 'screens/HomeScreen/ProfileScreen/PersonalInformationScreen/PreferredNameScreen'
import WaygateEditScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/DeveloperScreen/WaygateEditScreen'
import FeedbackTermsAndConditionsScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/GiveFeedback/SendUsFeedback/FeedbackTermsAndConditions'
import InAppFeedbackScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/GiveFeedback/SendUsFeedback/InAppFeedbackScreen/InAppFeedbackScreen'
import InAppRecruitmentScreen from 'screens/HomeScreen/ProfileScreen/SettingsScreen/InAppRecruitmentScreen/InAppRecruitmentScreen'
import VeteranStatusScreen from 'screens/HomeScreen/VeteranStatusScreen/VeteranStatusScreen'
import VeteransCrisisLineScreen from 'screens/HomeScreen/VeteransCrisisLineScreen/VeteransCrisisLineScreen'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import { Waygate } from 'utils/waygateConfig'

export type HomeStackParamList = WebviewStackParams & {
  Home: undefined
  Profile: undefined
  ContactVA: undefined
  VeteranStatus: undefined
  VeteransCrisisLine: undefined
  Developer: undefined
  EditEmail: undefined
  EditPhoneNumber: { displayTitle: string; phoneType: PhoneType; phoneData: PhoneData }
  HowDoIUpdate: { screenType: string }
  HowWillYou: undefined
  InAppRecruitment: undefined
  IncorrectServiceInfo: undefined
  AccountSecurity: undefined
  MilitaryInformation: undefined
  NotificationsSettings: undefined
  PersonalInformation: undefined
  PreferredName: undefined
  ContactInformation: undefined
  OverrideAPI: undefined
  RemoteConfig: undefined
  Settings: undefined
  GiveFeedback: undefined
  SendUsFeedback: undefined
  FeedbackSent: undefined
  InAppFeedback: undefined
  TermDefinitions: undefined
  FeedbackTermsAndConditions: undefined
  WaygateEdit: { waygateName: string; waygate: Waygate }
  WhatToKnow: undefined
  DemoModeUsers: undefined
  RemoteConfigTestScreen: undefined
}

const HomeStack = createStackNavigator<HomeStackParamList>()

export const getHomeScreens = () => {
  return [
    <HomeStack.Screen
      key={'VeteransCrisisLine'}
      name="VeteransCrisisLine"
      component={VeteransCrisisLineScreen}
      options={LARGE_PANEL_OPTIONS}
    />,
    <HomeStack.Screen
      key={'VeteranStatus'}
      name="VeteranStatus"
      component={VeteranStatusScreen}
      options={LARGE_PANEL_OPTIONS}
    />,
    <HomeStack.Screen
      key={'PreferredName'}
      name="PreferredName"
      component={PreferredNameScreen}
      options={FULLSCREEN_SUBTASK_OPTIONS}
    />,
    <HomeStack.Screen
      key={'EditPhoneNumber'}
      name="EditPhoneNumber"
      component={EditPhoneNumberScreen}
      options={FULLSCREEN_SUBTASK_OPTIONS}
    />,
    <HomeStack.Screen
      key={'EditEmail'}
      name="EditEmail"
      component={EditEmailScreen}
      options={FULLSCREEN_SUBTASK_OPTIONS}
    />,
    <HomeStack.Screen
      key={'HowDoIUpdate'}
      name="HowDoIUpdate"
      component={HowDoIUpdateScreen}
      options={LARGE_PANEL_OPTIONS}
    />,
    <HomeStack.Screen
      key={'HowWillYou'}
      name="HowWillYou"
      component={HowWillYouScreen}
      options={LARGE_PANEL_OPTIONS}
    />,
    <HomeStack.Screen
      key={'InAppRecruitment'}
      name="InAppRecruitment"
      component={InAppRecruitmentScreen}
      options={LARGE_PANEL_OPTIONS}
    />,
    <HomeStack.Screen
      key={'IncorrectServiceInfo'}
      name="IncorrectServiceInfo"
      component={IncorrectServiceInfo}
      options={LARGE_PANEL_OPTIONS}
    />,
    <HomeStack.Screen
      key={'WaygateEdit'}
      name="WaygateEdit"
      component={WaygateEditScreen}
      options={FULLSCREEN_SUBTASK_OPTIONS}
    />,
    <HomeStack.Screen
      key={'FeedbackTermsAndConditions'}
      name="FeedbackTermsAndConditions"
      component={FeedbackTermsAndConditionsScreen}
      options={FULLSCREEN_SUBTASK_OPTIONS}
    />,
    <HomeStack.Screen
      key={'InAppFeedback'}
      name="InAppFeedback"
      component={InAppFeedbackScreen}
      options={FULLSCREEN_SUBTASK_OPTIONS}
    />,
  ]
}
