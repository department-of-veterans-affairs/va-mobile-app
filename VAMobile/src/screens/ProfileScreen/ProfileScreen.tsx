import { ScrollView } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { AuthorizedServicesState, MilitaryServiceState, PersonalInformationState, StoreState } from 'store/reducers'
import { Box, ListItemObj, LoadingComponent } from 'components'
import { LettersListScreen, LettersOverviewScreen } from './Letters'
import { List } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getProfileInfo, getServiceHistory } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles, useRouteNavigation, useTheme } from 'utils/hooks'
import { useTranslation } from 'utils/hooks'
import BenefitSummaryServiceVerification from './Letters/BenefitSummaryServiceVerification/BenefitSummaryServiceVerification'
import DebugScreen from './SettingsScreen/DebugScreen'
import DirectDepositScreen from './DirectDepositScreen'
import HowDoIUpdateScreen from './PersonalInformationScreen/HowDoIUpdateScreen/HowDoIUpdateScreen'
import HowWillYouScreen from './PersonalInformationScreen/HowWillYouScreen'
import IncorrectServiceInfo from './MilitaryInformationScreen/IncorrectServiceInfo'
import ManageYourAccount from './SettingsScreen/ManageYourAccount/ManageYourAccount'
import MilitaryInformationScreen from './MilitaryInformationScreen'
import PersonalInformationScreen from './PersonalInformationScreen'
import ProfileBanner from './ProfileBanner'
import ServiceVerificationLetter from './Letters/ServiceVerificationLetter'
import SettingsScreen from './SettingsScreen'

export type ProfileStackParamList = {
  Profile: undefined
  Settings: undefined
  ManageYourAccount: undefined
  DirectDeposit: undefined
  Debug: undefined
  PersonalInformation: undefined
  MilitaryInformation: undefined
  HowDoIUpdate: undefined
  HowWillYou: undefined
  IncorrectServiceInfo: undefined
  LettersOverview: undefined
  LettersList: undefined
  BenefitSummaryServiceVerificationLetter: undefined
  ServiceVerificationLetter: undefined
}

type IProfileScreen = StackScreenProps<ProfileStackParamList, 'Profile'>

const ProfileStack = createStackNavigator<ProfileStackParamList>()

const ProfileScreen: FC<IProfileScreen> = () => {
  const { directDepositBenefits } = useSelector<StoreState, AuthorizedServicesState>((state) => state.authorizedServices)
  const { loading: militaryInformationLoading, needsUpdate: militaryHistoryNeedsUpdate } = useSelector<StoreState, MilitaryServiceState>((s) => s.militaryService)
  const { needsUpdate: personalInformationNeedsUpdate } = useSelector<StoreState, PersonalInformationState>((s) => s.personalInformation)

  const dispatch = useDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const navigateTo = useRouteNavigation()

  useEffect(() => {
    // Fetch the profile information
    if (personalInformationNeedsUpdate) {
      dispatch(getProfileInfo())
    }
  }, [dispatch, personalInformationNeedsUpdate])

  useEffect(() => {
    // Get the service history to populate the profile banner
    if (militaryHistoryNeedsUpdate) {
      dispatch(getServiceHistory())
    }
  }, [dispatch, militaryHistoryNeedsUpdate])

  const onPersonalAndContactInformation = navigateTo('PersonalInformation')

  const onMilitaryInformation = navigateTo('MilitaryInformation')

  const onDirectDeposit = navigateTo('DirectDeposit')

  const onLettersAndDocs = navigateTo('LettersOverview')

  const onSettings = navigateTo('Settings')

  const buttonDataList: Array<ListItemObj> = [
    { textLines: t('personalInformation.title'), a11yHintText: t('personalInformation.a11yHint'), onPress: onPersonalAndContactInformation },
    { textLines: t('militaryInformation.title'), a11yHintText: t('militaryInformation.a11yHint'), onPress: onMilitaryInformation },
  ]

  // hide button if user does not have permission
  if (directDepositBenefits) {
    buttonDataList.push({ textLines: t('directDeposit.title'), a11yHintText: t('directDeposit.a11yHint'), onPress: onDirectDeposit })
  }

  buttonDataList.push(
    { textLines: t('lettersAndDocs.title'), a11yHintText: t('lettersAndDocs.a11yHint'), onPress: onLettersAndDocs },
    { textLines: t('settings.title'), a11yHintText: t('settings.a11yHint'), onPress: onSettings },
  )

  if (militaryInformationLoading) {
    return (
      <React.Fragment>
        <ProfileBanner />
        <LoadingComponent />
      </React.Fragment>
    )
  }

  return (
    <ScrollView {...testIdProps('Profile-screen')}>
      <ProfileBanner />
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <List items={buttonDataList} />
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
      <ProfileStack.Screen name="ManageYourAccount" component={ManageYourAccount} />
      <ProfileStack.Screen name="DirectDeposit" component={DirectDepositScreen} options={{ title: t('directDeposit.title') }} />
      <ProfileStack.Screen name="Debug" component={DebugScreen} options={{ title: ts('debug.title') }} />
      <ProfileStack.Screen name="PersonalInformation" component={PersonalInformationScreen} options={{ title: t('personalInformation.headerTitle') }} />
      <ProfileStack.Screen name="MilitaryInformation" component={MilitaryInformationScreen} options={{ title: t('militaryInformation.title') }} />
      <ProfileStack.Screen name="HowDoIUpdate" component={HowDoIUpdateScreen} />
      <ProfileStack.Screen name="HowWillYou" component={HowWillYouScreen} />
      <ProfileStack.Screen name="IncorrectServiceInfo" component={IncorrectServiceInfo} />
      <ProfileStack.Screen name="LettersOverview" component={LettersOverviewScreen} options={{ title: t('letters.overview.title') }} />
      <ProfileStack.Screen name="LettersList" component={LettersListScreen} options={{ title: t('letters.overview.title') }} />
      <ProfileStack.Screen name="BenefitSummaryServiceVerificationLetter" component={BenefitSummaryServiceVerification} options={{ title: t('letters.overview.title') }} />
      <ProfileStack.Screen name="ServiceVerificationLetter" component={ServiceVerificationLetter} options={{ title: t('letters.overview.title') }} />
    </ProfileStack.Navigator>
  )
}

export default ProfileStackScreen
