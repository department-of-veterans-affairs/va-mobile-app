import { ScrollView } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, ButtonListItemObj } from 'components'
import { ButtonList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, StoreState } from 'store/reducers'
import { PhoneData, PhoneType } from 'store/api/types'
import { getProfileInfo } from 'store/actions'
import { profileAddressType } from './AddressSummary'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles } from 'utils/hooks'
import { useTranslation } from 'utils/hooks'
import DebugScreen from './SettingsScreen/DebugScreen'
import DirectDepositScreen from './DirectDepositScreen'
import EditAddressScreen from './EditAddressScreen'
import EditDirectDepositScreen from './DirectDepositScreen/EditDirectDepositScreen'
import EditEmailScreen from './PersonalInformationScreen/EditEmailScreen/EditEmailScreen'
import EditPhoneNumberScreen from './PersonalInformationScreen/EditPhoneNumberScreen/EditPhoneNumberScreen'
import HowDoIUpdateScreen from './PersonalInformationScreen/HowDoIUpdateScreen/HowDoIUpdateScreen'
import HowWillYouScreen from './PersonalInformationScreen/HowWillYouScreen'
import IncorrectServiceInfo from './MilitaryInformationScreen/IncorrectServiceInfo'
import MilitaryInformationScreen from './MilitaryInformationScreen'
import PersonalInformationScreen from './PersonalInformationScreen'
import ProfileBanner from './ProfileBanner'
import SettingsScreen from './SettingsScreen'

export type ProfileStackParamList = {
  Profile: undefined
  Settings: undefined
  DirectDeposit: undefined
  Debug: undefined
  PersonalInformation: undefined
  EditEmail: undefined
  MilitaryInformation: undefined
  HowDoIUpdate: undefined
  HowWillYou: undefined
  IncorrectServiceInfo: undefined
  EditPhoneNumber: { displayTitle: string; phoneType: PhoneType; phoneData: PhoneData }
  EditAddress: { displayTitle: string; addressType: profileAddressType }
  EditDirectDeposit: undefined
}

type IProfileScreen = StackScreenProps<ProfileStackParamList, 'Profile'>

const ProfileStack = createStackNavigator<ProfileStackParamList>()

const ProfileScreen: FC<IProfileScreen> = ({ navigation }) => {
  const dispatch = useDispatch()
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)

  useEffect(() => {
    dispatch(getProfileInfo())
  }, [dispatch])

  const onPersonalAndContactInformation = (): void => {
    navigation.navigate('PersonalInformation')
  }

  const onMilitaryInformation = (): void => {
    navigation.navigate('MilitaryInformation')
  }

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
        <ButtonList items={buttonDataList} translationNameSpace={NAMESPACE.PROFILE} />
      </Box>
    </ScrollView>
  )
}

type IProfileStackScreen = {}

const ProfileStackScreen: FC<IProfileStackScreen> = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const ts = useTranslation(NAMESPACE.SETTINGS)
  const headerStyles = useHeaderStyles()

  return (
    <ProfileStack.Navigator screenOptions={headerStyles}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: t('title') }} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings.title') }} />
      <ProfileStack.Screen name="DirectDeposit" component={DirectDepositScreen} options={{ title: t('directDeposit.title') }} />
      <ProfileStack.Screen name="Debug" component={DebugScreen} options={{ title: ts('debug.title') }} />
      <ProfileStack.Screen name="PersonalInformation" component={PersonalInformationScreen} options={{ title: t('personalInformation.headerTitle') }} />
      <ProfileStack.Screen name="MilitaryInformation" component={MilitaryInformationScreen} options={{ title: t('militaryInformation.title') }} />
      <ProfileStack.Screen name="HowDoIUpdate" component={HowDoIUpdateScreen} />
      <ProfileStack.Screen name="HowWillYou" component={HowWillYouScreen} />
      <ProfileStack.Screen name="IncorrectServiceInfo" component={IncorrectServiceInfo} />
      <ProfileStack.Screen name="EditEmail" component={EditEmailScreen} options={{ title: t('personalInformation.email') }} />
      <ProfileStack.Screen name="EditPhoneNumber" component={EditPhoneNumberScreen} />
      <ProfileStack.Screen name="EditAddress" component={EditAddressScreen} />
      <ProfileStack.Screen name="EditDirectDeposit" component={EditDirectDepositScreen} options={{ title: t('directDeposit.title') }} />
    </ProfileStack.Navigator>
  )
}

export default ProfileStackScreen
