import React, { FC, useEffect } from 'react'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { Box, ErrorComponent, FocusedNavHeaderText, LoadingComponent, SignoutButton, SimpleList, SimpleListItemObj, VAScrollView } from 'components'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants, SigninServiceTypesConstants } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { ProfileStackParamList } from './ProfileStackScreens'
import { getDisabilityRating } from 'store/slices/disabilityRatingSlice'
import { getProfileInfo } from 'store/slices/personalInformationSlice'
import { getServiceHistory } from 'store/slices/militaryServiceSlice'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useAppSelector, useDowntime, useError, useHeaderStyles, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ProfileBanner from './ProfileBanner'

type ProfileScreenProps = StackScreenProps<ProfileStackParamList, 'Profile'>

const ProfileScreen: FC<ProfileScreenProps> = ({ navigation }) => {
  const { directDepositBenefits, userProfileUpdate, militaryServiceHistory: militaryInfoAuthorization } = useAppSelector((state) => state.authorizedServices)
  const { loading: militaryInformationLoading, needsDataLoad: militaryHistoryNeedsUpdate } = useAppSelector((s) => s.militaryService)
  const { loading: personalInformationLoading, needsDataLoad: personalInformationNeedsUpdate } = useAppSelector((s) => s.personalInformation)
  const { loading: disabilityRatingLoading, needsDataLoad: disabilityRatingNeedsUpdate } = useAppSelector((s) => s.disabilityRating)
  const { profile } = useAppSelector((state) => state.personalInformation)

  const profileNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.userProfileUpdate)
  const mhNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.militaryServiceHistory)
  const drNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.disabilityRating)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (headerTitle) => <FocusedNavHeaderText headerTitle={headerTitle.children} />,
    })
  }, [navigation])

  const dispatch = useAppDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
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

    dispatch(getDisabilityRating(ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID))
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

  useEffect(() => {
    // Get the service history to populate the profile banner
    if (disabilityRatingNeedsUpdate && drNotInDowntime) {
      dispatch(getDisabilityRating(ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID))
    }
  }, [dispatch, disabilityRatingNeedsUpdate, drNotInDowntime])

  const isIDMESignin = profile?.signinService === SigninServiceTypesConstants.IDME

  const onPersonalAndContactInformation = navigateTo('PersonalInformation')

  const onMilitaryInformation = navigateTo('MilitaryInformation')

  const onDirectDeposit = isIDMESignin ? navigateTo('DirectDeposit') : navigateTo('HowToUpdateDirectDeposit')

  const onLettersAndDocs = navigateTo('LettersOverview')

  const onSettings = navigateTo('Settings')

  const onDisabilityRatings = navigateTo('DisabilityRatings')

  const buttonDataList: Array<SimpleListItemObj> = []

  buttonDataList.push({ text: t('disabilityRating.title'), a11yHintText: t('disabilityRating.a11yHint'), onPress: onDisabilityRatings })

  if (userProfileUpdate) {
    buttonDataList.push({ text: t('personalInformation.title'), a11yHintText: t('personalInformation.a11yHint'), onPress: onPersonalAndContactInformation })
  }

  buttonDataList.push({ text: t('militaryInformation'), a11yHintText: t('militaryInformation.a11yHint'), onPress: onMilitaryInformation })

  // Show if user has permission or if user did not signed in through IDME
  if (directDepositBenefits || !isIDMESignin) {
    buttonDataList.push({ text: t('directDeposit.information'), a11yHintText: t('directDeposit.a11yHint'), onPress: onDirectDeposit })
  }

  buttonDataList.push(
    { text: t('lettersAndDocs.title'), testId: t('lettersAndDocs.title.a11yLabel'), a11yHintText: t('lettersAndDocs.a11yHint'), onPress: onLettersAndDocs },
    { text: t('settings.title'), a11yHintText: t('settings.a11yHint'), onPress: onSettings },
  )

  // pass in optional onTryAgain because this screen needs to dispatch two actions for its loading sequence
  if (useError(ScreenIDTypesConstants.PROFILE_SCREEN_ID)) {
    return (
      <VAScrollView>
        <ErrorComponent onTryAgain={getInfoTryAgain} screenID={ScreenIDTypesConstants.PROFILE_SCREEN_ID} />
        <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
          <SignoutButton />
        </Box>
      </VAScrollView>
    )
  }

  if (militaryInformationLoading || personalInformationLoading || disabilityRatingLoading) {
    return (
      <React.Fragment>
        <ProfileBanner />
        <LoadingComponent />
      </React.Fragment>
    )
  }

  return (
    <VAScrollView {...testIdProps('Profile-page')}>
      <ProfileBanner />
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.standardMarginBetween}>
        <SimpleList items={buttonDataList} />
      </Box>
      <Box px={theme.dimensions.gutter} mb={theme.dimensions.contentMarginBottom}>
        <SignoutButton />
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
  const t = useTranslation(NAMESPACE.PROFILE)
  const headerStyles = useHeaderStyles()

  return (
    <ProfileScreenStack.Navigator screenOptions={headerStyles}>
      <ProfileScreenStack.Screen name="Profile" component={ProfileScreen} options={{ title: t('title') }} />
    </ProfileScreenStack.Navigator>
  )
}

export default ProfileStackScreen
