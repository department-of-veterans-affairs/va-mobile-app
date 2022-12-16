import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { AuthorizedServicesState } from 'store/slices'
import { Box, ErrorComponent, FocusedNavHeaderText, LoadingComponent, NameTag, SimpleList, SimpleListItemObj, VAScrollView } from 'components'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants, SigninServiceTypesConstants } from 'store/api/types'
import { MilitaryServiceState, getServiceHistory } from 'store/slices/militaryServiceSlice'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, getProfileInfo } from 'store/slices/personalInformationSlice'
import { ProfileStackParamList } from './ProfileStackScreens'
import { RootState } from 'store'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDowntime, useError, useHeaderStyles, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import DirectDepositScreen from './DirectDepositScreen'
import HowToUpdateDirectDepositScreen from './DirectDepositScreen/HowToUpdateDirectDepositScreen'
import PaymentScreen from './PaymentScreen'

type ProfileScreenProps = StackScreenProps<ProfileStackParamList, 'Profile'>

const ProfileScreen: FC<ProfileScreenProps> = ({ navigation }) => {
  const {
    directDepositBenefits,
    directDepositBenefitsUpdate,
    userProfileUpdate,
    militaryServiceHistory: militaryInfoAuthorization,
  } = useSelector<RootState, AuthorizedServicesState>((state) => state.authorizedServices)
  const { loading: militaryInformationLoading, needsDataLoad: militaryHistoryNeedsUpdate } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)
  const {
    loading: personalInformationLoading,
    needsDataLoad: personalInformationNeedsUpdate,
    profile,
  } = useSelector<RootState, PersonalInformationState>((s) => s.personalInformation)

  const profileNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.userProfileUpdate)
  const mhNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.militaryServiceHistory)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (headerTitle) => <FocusedNavHeaderText headerTitle={headerTitle.children} />,
    })
  }, [navigation])

  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.PROFILE)
  const navigateTo = useRouteNavigation()

  /**
   * Function used on error to reload the data for this page. This combines all calls necessary to load the page rather
   * than checking the needsDataLoad flag because if something went wrong we assume we want to reload all of the necessary data
   */
  const getInfoTryAgain = (): void => {
    // Fetch the profile information
    dispatch(getProfileInfo(ScreenIDTypesConstants.PROFILE_SCREEN_ID))
    // Get the service history to populate the profile banner
    if (militaryInfoAuthorization) {
      dispatch(getServiceHistory(ScreenIDTypesConstants.PROFILE_SCREEN_ID))
    }
  }

  useEffect(() => {
    // Fetch the profile information
    if (personalInformationNeedsUpdate && profileNotInDowntime) {
      dispatch(getProfileInfo(ScreenIDTypesConstants.PROFILE_SCREEN_ID))
    }
  }, [dispatch, personalInformationNeedsUpdate, profileNotInDowntime])

  useEffect(() => {
    // Get the service history to populate the profile banner
    if (militaryHistoryNeedsUpdate && militaryInfoAuthorization && mhNotInDowntime) {
      dispatch(getServiceHistory(ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID))
    }
  }, [dispatch, militaryHistoryNeedsUpdate, militaryInfoAuthorization, mhNotInDowntime])

  const isIDMEOrLoginGovSignin = profile?.signinService === SigninServiceTypesConstants.IDME || profile?.signinService === SigninServiceTypesConstants.LOGINGOV

  const getTopSection = (): Array<SimpleListItemObj> => {
    const buttonDataList: Array<SimpleListItemObj> = []

    if (userProfileUpdate) {
      buttonDataList.push({ text: t('personalInformation.title'), a11yHintText: t('personalInformation.a11yHint'), onPress: navigateTo('PersonalInformation') })
    }

    buttonDataList.push({ text: t('militaryInformation'), a11yHintText: t('militaryInformation.a11yHint'), onPress: navigateTo('MilitaryInformation') })

    // Show if user has permission or if user did not signed in through IDME
    if (directDepositBenefits || !isIDMEOrLoginGovSignin) {
      buttonDataList.push({
        text: t('directDeposit.information'),
        a11yHintText: t('directDeposit.a11yHint'),
        onPress: directDepositBenefitsUpdate ? navigateTo('DirectDeposit') : navigateTo('HowToUpdateDirectDeposit'),
      })
    }

    return buttonDataList
  }

  const getLastSection = (): Array<SimpleListItemObj> => {
    return [{ text: t('settings.title'), a11yHintText: t('settings.a11yHint'), onPress: navigateTo('Settings') }]
  }

  // pass in optional onTryAgain because this screen needs to dispatch two actions for its loading sequence
  if (useError(ScreenIDTypesConstants.PROFILE_SCREEN_ID)) {
    return (
      <VAScrollView>
        <ErrorComponent onTryAgain={getInfoTryAgain} screenID={ScreenIDTypesConstants.PROFILE_SCREEN_ID} />
        <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
          <SimpleList items={getLastSection()} />
        </Box>
      </VAScrollView>
    )
  }

  if (militaryInformationLoading || personalInformationLoading) {
    return (
      <React.Fragment>
        <NameTag />
        <LoadingComponent text={t('profile.loading')} />
      </React.Fragment>
    )
  }

  return (
    <VAScrollView {...testIdProps('Profile-page')}>
      <NameTag />
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.standardMarginBetween}>
        <SimpleList items={getTopSection()} />
      </Box>
      <Box mb={theme.dimensions.standardMarginBetween}>
        <SimpleList items={getLastSection()} />
      </Box>
    </VAScrollView>
  )
}

type ProfileStackScreenProps = Record<string, unknown>

const ProfileScreenStack = createStackNavigator()

/**
 * Stack screen for the Profile tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
const ProfileStackScreen: FC<ProfileStackScreenProps> = () => {
  const { t } = useTranslation(NAMESPACE.PROFILE)
  const { t: th } = useTranslation(NAMESPACE.HOME)
  const headerStyles = useHeaderStyles()

  return (
    <ProfileScreenStack.Navigator screenOptions={headerStyles}>
      <ProfileScreenStack.Screen name="Profile" component={ProfileScreen} options={{ title: t('title') }} />
      <ProfileScreenStack.Screen name="DirectDeposit" component={DirectDepositScreen} options={{ title: t('directDeposit.title') }} />
      <ProfileScreenStack.Screen name="HowToUpdateDirectDeposit" component={HowToUpdateDirectDepositScreen} options={{ title: t('directDeposit.title') }} />
      <ProfileScreenStack.Screen name="Payments" component={PaymentScreen} options={{ title: th('payments.title') }} />
    </ProfileScreenStack.Navigator>
  )
}

export default ProfileStackScreen
