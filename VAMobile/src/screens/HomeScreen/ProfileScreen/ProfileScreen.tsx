import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { AuthorizedServicesState } from 'store/slices'
import { Box, CategoryLanding, ErrorComponent, FocusedNavHeaderText, LoadingComponent, NameTag, SimpleList, SimpleListItemObj } from 'components'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { MilitaryServiceState, getServiceHistory } from 'store/slices/militaryServiceSlice'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, getProfileInfo } from 'store/slices/personalInformationSlice'
import { RootState } from 'store'
import { useAppDispatch, useDowntime, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

type ProfileScreenProps = StackScreenProps<HomeStackParamList, 'Profile'>

export const ProfileScreen: FC<ProfileScreenProps> = ({ navigation }) => {
  const { userProfileUpdate, militaryServiceHistory: militaryInfoAuthorization } = useSelector<RootState, AuthorizedServicesState>((state) => state.authorizedServices)
  const { loading: militaryInformationLoading, needsDataLoad: militaryHistoryNeedsUpdate } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)
  const { loading: personalInformationLoading, needsDataLoad: personalInformationNeedsUpdate } = useSelector<RootState, PersonalInformationState>((s) => s.personalInformation)

  const profileNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.userProfileUpdate)
  const mhNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.militaryServiceHistory)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: (headerTitle) => <FocusedNavHeaderText headerTitle={headerTitle.children} />,
    })
  }, [navigation])

  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
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

  const settingsButton = { text: t('settings.title'), a11yHintText: t('settings.a11yHint'), onPress: navigateTo('Settings') }

  const getAllButtons = (): Array<SimpleListItemObj> => {
    const buttonDataList: Array<SimpleListItemObj> = []

    if (userProfileUpdate) {
      buttonDataList.push({ text: t('personalInformation.title'), a11yHintText: t('personalInformation.a11yHint'), onPress: navigateTo('PersonalInformation') })
    }

    buttonDataList.push({ text: t('militaryInformation.title'), a11yHintText: t('militaryInformation.a11yHint'), onPress: navigateTo('MilitaryInformation') })
    buttonDataList.push(settingsButton)
    return buttonDataList
  }

  // pass in optional onTryAgain because this screen needs to dispatch two actions for its loading sequence
  if (useError(ScreenIDTypesConstants.PROFILE_SCREEN_ID)) {
    return (
      <CategoryLanding title={t('profile.title')} backLabel={t('home')} backLabelOnPress={navigation.goBack}>
        <ErrorComponent onTryAgain={getInfoTryAgain} screenID={ScreenIDTypesConstants.PROFILE_SCREEN_ID} />
        <Box mb={theme.dimensions.contentMarginBottom}>
          <SimpleList items={[settingsButton]} />
        </Box>
      </CategoryLanding>
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
    <CategoryLanding title={t('profile.title')} backLabel={t('home')} backLabelOnPress={navigation.goBack}>
      <NameTag />
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.standardMarginBetween}>
        <SimpleList items={getAllButtons()} />
      </Box>
    </CategoryLanding>
  )
}

export default ProfileScreen
