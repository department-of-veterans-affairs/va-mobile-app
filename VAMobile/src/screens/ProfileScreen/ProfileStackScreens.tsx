import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import { LetterTypes, ScreenIDTypes } from 'store/api/types'
import { LettersListScreen, LettersOverviewScreen } from './Letters'
import { NAMESPACE } from 'constants/namespaces'
import BenefitSummaryServiceVerification from './Letters/BenefitSummaryServiceVerification/BenefitSummaryServiceVerification'
import DebugScreen from './SettingsScreen/DebugScreen'
import DirectDepositScreen from './DirectDepositScreen'
import DisabilityRatingsScreen from './DisabilityRatingsScreen'
import GenericLetter from './Letters/GenericLetter/GenericLetter'
import HowDoIUpdateScreen from './PersonalInformationScreen/HowDoIUpdateScreen/HowDoIUpdateScreen'
import HowWillYouScreen from './PersonalInformationScreen/HowWillYouScreen'
import IncorrectServiceInfo from './MilitaryInformationScreen/IncorrectServiceInfo'
import ManageYourAccount from './SettingsScreen/ManageYourAccount/ManageYourAccount'
import MilitaryInformationScreen from './MilitaryInformationScreen'
import NotificationsSettingsScreen from './SettingsScreen/NotificationsSettingsScreen/NotificationsSettingsScreen'
import PersonalInformationScreen from './PersonalInformationScreen'
import SettingsScreen from './SettingsScreen'

export type ProfileStackParamList = {
  Profile: undefined
  Settings: undefined
  ManageYourAccount: undefined
  DirectDeposit: undefined
  Debug: undefined
  PersonalInformation: undefined
  MilitaryInformation: undefined
  NotificationsSettings: undefined
  HowDoIUpdate: undefined
  HowWillYou: undefined
  IncorrectServiceInfo: undefined
  LettersOverview: undefined
  LettersList: undefined
  BenefitSummaryServiceVerificationLetter: undefined
  GenericLetter: {
    header: string
    description: string
    letterType: LetterTypes
    screenID: ScreenIDTypes
    descriptionA11yLabel?: string
  }
  DisabilityRatings: undefined
}

const ProfileStack = createStackNavigator<ProfileStackParamList>()

export const getProfileScreens = (t: TFunction): Array<ReactNode> => {
  return [
    <ProfileStack.Screen key={'Settings'} name="Settings" component={SettingsScreen} options={{ title: t('settings.title') }} />,
    <ProfileStack.Screen key={'ManageYourAccount'} name="ManageYourAccount" component={ManageYourAccount} />,
    <ProfileStack.Screen key={'DirectDeposit'} name="DirectDeposit" component={DirectDepositScreen} options={{ title: t('directDeposit.title') }} />,
    <ProfileStack.Screen key={'Debug'} name="Debug" component={DebugScreen} options={{ title: t(`${NAMESPACE.SETTINGS}:debug.title`) }} />,
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
    <ProfileStack.Screen key={'LettersOverview'} name="LettersOverview" component={LettersOverviewScreen} options={{ title: t('letters.overview.title') }} />,
    <ProfileStack.Screen key={'LettersList'} name="LettersList" component={LettersListScreen} options={{ title: t('letters.overview.title') }} />,
    <ProfileStack.Screen
      key={'BenefitSummaryServiceVerificationLetter'}
      name="BenefitSummaryServiceVerificationLetter"
      component={BenefitSummaryServiceVerification}
      options={{ title: t('letters.overview.title') }}
    />,
    <ProfileStack.Screen key={'GenericLetter'} name="GenericLetter" component={GenericLetter} options={{ title: t('letters.overview.title') }} />,
    <ProfileStack.Screen key={'DisabilityRatings'} name="DisabilityRatings" component={DisabilityRatingsScreen} options={{ title: t('disabilityRatingDetails.title') }} />,
  ]
}
