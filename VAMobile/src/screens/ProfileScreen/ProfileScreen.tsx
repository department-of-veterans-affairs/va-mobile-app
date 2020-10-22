import { ScrollView } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { AuthState, StoreState } from 'store/reducers'
import { Box, ButtonListItemObj } from 'components'
import { ButtonList } from 'components'
import { NAMESPACE, i18n_NS } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles } from 'utils/hooks'
import { useTranslation } from 'utils/hooks'
import DebugScreen from './SettingsScreen/DebugScreen'
import DirectDepositScreen from './DirectDepositScreen'
import HowDoIUpdate from './PersonalInformationScreen/HowDoIUpdate/HowDoIUpdate'
import PersonalInformationScreen from './PersonalInformationScreen'
import ProfileBanner from './ProfileBanner'
import SettingsScreen from './SettingsScreen'

export type ProfileStackParamList = {
  Profile: undefined
  Settings: undefined
  DirectDeposit: undefined
  Debug: undefined
  PersonalInformation: undefined
  HowDoIUpdate: undefined
}

type IProfileScreen = StackScreenProps<ProfileStackParamList, 'Profile'>

const ProfileStack = createStackNavigator<ProfileStackParamList>()

const ProfileScreen: FC<IProfileScreen> = ({ navigation }) => {
  const { profile } = useSelector<StoreState, AuthState>((state) => state.auth)

  const onPersonalAndContactInformation = (): void => {
    navigation.navigate('PersonalInformation')
  }

  const onMilitaryInformation = (): void => {}

  const onDirectDeposit = (): void => {
    navigation.navigate('DirectDeposit')
  }

  const onLettersAndDocs = (): void => {}

  const onSettings = (): void => {
    navigation.navigate('Settings')
  }

  const buttonDataList: Array<ButtonListItemObj> = [
    { textIDs: 'personalInformation.title', a11yHintID: 'personalInformation.a11yHint', onPress: onPersonalAndContactInformation },
    { textIDs: 'militaryInformation.title', a11yHintID: 'militaryInformation.a11yHint', onPress: onMilitaryInformation },
    { textIDs: 'directDeposit.title', a11yHintID: 'directDeposit.a11yHint', onPress: onDirectDeposit },
    { textIDs: 'lettersAndDocs.title', a11yHintID: 'lettersAndDocs.a11yHint', onPress: onLettersAndDocs },
    { textIDs: 'settings.title', a11yHintID: 'settings.a11yHint', onPress: onSettings },
  ]

  return (
    <ScrollView {...testIdProps('Profile-screen')}>
      <ProfileBanner name={profile ? profile.full_name : ''} mostRecentBranch={profile ? profile.most_recent_branch : ''} />
      <Box mt={9}>
        <ButtonList items={buttonDataList} translationNameSpace={NAMESPACE.PROFILE as i18n_NS} />
      </Box>
    </ScrollView>
  )
}

type IProfileStackScreen = {}

const ProfileStackScreen: FC<IProfileStackScreen> = () => {
  const t = useTranslation('profile')
  const ts = useTranslation('settings')
  const headerStyles = useHeaderStyles()

  return (
    <ProfileStack.Navigator screenOptions={headerStyles}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: t('title') }} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings.title') }} />
      <ProfileStack.Screen name="DirectDeposit" component={DirectDepositScreen} options={{ title: t('directDeposit.title') }} />
      <ProfileStack.Screen name="Debug" component={DebugScreen} options={{ title: ts('debug.title') }} />
      <ProfileStack.Screen name="PersonalInformation" component={PersonalInformationScreen} options={{ title: t('personalInformation.headerTitle') }} />
      <ProfileStack.Screen name="HowDoIUpdate" component={HowDoIUpdate} options={{ title: '' }} />
    </ProfileStack.Navigator>
  )
}

export default ProfileStackScreen
