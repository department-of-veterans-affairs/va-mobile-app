import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement, useEffect } from 'react'

import { AuthorizedServicesState } from 'store/slices'
import { Box, ChildTemplate, ErrorComponent, LargeNavButton, LoadingComponent, NameTag } from 'components'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { MilitaryServiceState, getServiceHistory } from 'store/slices/militaryServiceSlice'
import { NAMESPACE } from 'constants/namespaces'
import { PersonalInformationState, getProfileInfo } from 'store/slices/personalInformationSlice'
import { RootState } from 'store'
import { useAppDispatch, useDowntime, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

type ProfileScreenProps = StackScreenProps<HomeStackParamList, 'Profile'>

const ProfileScreen: FC<ProfileScreenProps> = ({ navigation }) => {
  const { userProfileUpdate, militaryServiceHistory: militaryInfoAuthorization } = useSelector<RootState, AuthorizedServicesState>((state) => state.authorizedServices)
  const { loading: militaryInformationLoading, needsDataLoad: militaryHistoryNeedsUpdate } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)
  const { loading: personalInformationLoading, needsDataLoad: personalInformationNeedsUpdate } = useSelector<RootState, PersonalInformationState>((s) => s.personalInformation)

  const profileNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.userProfileUpdate)
  const mhNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.militaryServiceHistory)

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

  //Todo, Change ContactInformation navigate To to the contact information screen when it is created in the next ticket
  const getProfileButtons = (): ReactElement => {
    if (userProfileUpdate) {
      return (
        <Box>
          <LargeNavButton
            title={t('personalInformation.title')}
            onPress={navigateTo('PersonalInformation')}
            borderWidth={theme.dimensions.buttonBorderWidth}
            borderColor={'secondary'}
            borderColorActive={'primaryDarkest'}
            borderStyle={'solid'}
            subText=""
          />
          <LargeNavButton
            title={t('contactInformation.title')}
            onPress={navigateTo('ContactInformation')}
            borderWidth={theme.dimensions.buttonBorderWidth}
            borderColor={'secondary'}
            borderColorActive={'primaryDarkest'}
            borderStyle={'solid'}
            subText=""
          />
        </Box>
      )
    } else {
      return <></>
    }
  }

  // pass in optional onTryAgain because this screen needs to dispatch two actions for its loading sequence
  if (useError(ScreenIDTypesConstants.PROFILE_SCREEN_ID)) {
    return (
      <ChildTemplate title={t('profile.title')} backLabel={t('home')} backLabelOnPress={navigation.goBack}>
        <ErrorComponent onTryAgain={getInfoTryAgain} screenID={ScreenIDTypesConstants.PROFILE_SCREEN_ID} />
        <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
          <LargeNavButton
            title={t('settings.title')}
            onPress={navigateTo('Settings')}
            borderWidth={theme.dimensions.buttonBorderWidth}
            borderColor={'secondary'}
            borderColorActive={'primaryDarkest'}
            borderStyle={'solid'}
            subText=""
          />
        </Box>
      </ChildTemplate>
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
    <ChildTemplate title={t('profile.title')} backLabel={t('home')} backLabelOnPress={navigation.goBack}>
      <NameTag />
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        {getProfileButtons()}
        <LargeNavButton
          title={t('militaryInformation.title')}
          onPress={navigateTo('MilitaryInformation')}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
          subText=""
        />
        <LargeNavButton
          title={t('settings.title')}
          onPress={navigateTo('Settings')}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
          subText=""
        />
      </Box>
    </ChildTemplate>
  )
}

export default ProfileScreen
