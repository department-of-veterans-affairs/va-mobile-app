/** AF tests for Profile tab: PersonalInformation, ContactInformation, MilitaryInformation, Settings */
import { describeAF } from './AFShared'

const AFNavigationProfile = [
  ['PersonalInformationScreen.e2e', 'WG_PersonalInformation', 'Profile', 'Personal information'],
  [
    'PersonalInformationScreen.e2e',
    'WG_HowDoIUpdate',
    'Profile',
    'Personal information',
    'How to update or fix an error in your legal name',
  ],
  ['PersonalInformationScreen.e2e', 'WG_PreferredName', 'Profile', 'Personal information', 'Preferred name'],
  ['PersonalInformationScreen.e2e', 'WG_WhatToKnow', 'Profile', 'Personal information'],
  ['ContactInformation.e2e', 'WG_ContactInformation', 'Profile', 'Contact information'],
  ['ContactInformation.e2e', 'WG_HowWillYou', 'Profile', 'Contact information', 'How we use your contact information'],
  ['ContactInformation.e2e', 'WG_EditAddress', 'Profile', 'Contact information', 'Mailing address'],
  ['ContactInformation.e2e', 'WG_EditPhoneNumber', 'Profile', 'Contact information', 'Mobile'],
  ['ContactInformation.e2e', 'WG_EditEmail', 'Profile', 'Contact information', 'Email address'],
  ['MilitaryInformation.e2e', 'WG_MilitaryInformation', 'Profile', 'Military information'],
  [
    'MilitaryInformation.e2e',
    'WG_IncorrectServiceInfo',
    'Profile',
    'Military information',
    "What if my military service information doesn't look right?",
  ],
  ['SettingsScreen.e2e', 'WG_AccountSecurity', 'Profile', 'Settings', 'Account security'],
  ['SettingsScreen.e2e', 'WG_NotificationsSettings', 'Profile', 'Settings', 'Notifications'],
  ['SettingsScreen.e2e', 'WG_InAppRecruitment', 'Profile', 'Settings', 'Give feedback'],
]

describeAF('AF Profile', AFNavigationProfile)
