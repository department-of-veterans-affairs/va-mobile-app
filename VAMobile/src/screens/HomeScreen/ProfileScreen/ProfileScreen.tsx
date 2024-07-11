import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useServiceHistory } from 'api/militaryService'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { Box, ChildTemplate, ErrorComponent, LargeNavButton, LoadingComponent, NameTag, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { ScreenIDTypesConstants } from 'store/api/types'
import { useError, useRouteNavigation, useTheme } from 'utils/hooks'

type ProfileScreenProps = StackScreenProps<HomeStackParamList, 'Profile'>

function ProfileScreen({ navigation }: ProfileScreenProps) {
  const {
    data: userAuthorizedServices,
    isLoading: loadingUserAuthorizedServices,
    refetch: refetchUserAuthorizedServices,
  } = useAuthorizedServices()

  const {
    isLoading: loadingServiceHistory,
    error: serviceHistoryError,
    refetch: refetchServiceHistory,
  } = useServiceHistory()
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { data: personalInfo } = usePersonalInformation()

  /**
   * Function used on error to reload the data for this page. This combines all calls necessary to load the page rather
   * than checking the needsDataLoad flag because if something went wrong we assume we want to reload all of the necessary data
   */
  const getInfoTryAgain = (): void => {
    refetchUserAuthorizedServices()
    if (userAuthorizedServices?.militaryServiceHistory && serviceHistoryError) {
      refetchServiceHistory()
    }
  }

  const loadingCheck = loadingServiceHistory || loadingUserAuthorizedServices
  const errorCheck = useError(ScreenIDTypesConstants.PROFILE_SCREEN_ID) || serviceHistoryError

  const displayName = !!personalInfo?.fullName && (
    <Box>
      <TextView
        mx={theme.dimensions.condensedMarginBetween}
        mb={theme.dimensions.standardMarginBetween}
        textTransform="capitalize"
        accessibilityRole="header"
        variant="ProfileScreenHeader">
        {personalInfo.fullName}
      </TextView>
    </Box>
  )

  return (
    <ChildTemplate
      title={t('profile.title')}
      backLabel={t('home.title')}
      backLabelOnPress={navigation.goBack}
      testID="profileID">
      {loadingCheck ? (
        <Box>
          {displayName}
          <NameTag />
          <LoadingComponent text={t('profile.loading')} />
        </Box>
      ) : errorCheck ? (
        <Box>
          <ErrorComponent
            onTryAgain={getInfoTryAgain}
            screenID={ScreenIDTypesConstants.PROFILE_SCREEN_ID}
            error={serviceHistoryError}
          />
          <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
            <LargeNavButton title={t('settings.title')} onPress={() => navigateTo('Settings')} />
          </Box>
        </Box>
      ) : (
        <>
          {displayName}
          <NameTag />
          <Box mb={theme.dimensions.standardMarginBetween}>
            {userAuthorizedServices?.userProfileUpdate && (
              <>
                <LargeNavButton
                  title={t('personalInformation.title')}
                  onPress={() => navigateTo('PersonalInformation')}
                />
                <LargeNavButton
                  title={t('contactInformation.title')}
                  onPress={() => navigateTo('ContactInformation')}
                />
              </>
            )}
            <LargeNavButton title={t('militaryInformation.title')} onPress={() => navigateTo('MilitaryInformation')} />
            <LargeNavButton title={t('settings.title')} onPress={() => navigateTo('Settings')} />
          </Box>
        </>
      )}
    </ChildTemplate>
  )
}

export default ProfileScreen
