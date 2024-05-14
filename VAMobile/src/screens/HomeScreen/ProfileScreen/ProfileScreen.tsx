import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useServiceHistory } from 'api/militaryService'
import { Box, ChildTemplate, ErrorComponent, LargeNavButton, LoadingComponent, NameTag } from 'components'
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
    isFetched: useServiceHistoryFetched,
    error: serviceHistoryError,
    refetch: refetchServiceHistory,
  } = useServiceHistory()
  const navigateTo = useRouteNavigation()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  /**
   * Function used on error to reload the data for this page. This combines all calls necessary to load the page rather
   * than checking the needsDataLoad flag because if something went wrong we assume we want to reload all of the necessary data
   */
  const getInfoTryAgain = (): void => {
    refetchUserAuthorizedServices()
    if (serviceHistoryError) {
      refetchServiceHistory()
    }
  }

  const loadingCheck = !useServiceHistoryFetched || loadingUserAuthorizedServices
  const errorCheck = useError(ScreenIDTypesConstants.PROFILE_SCREEN_ID) || serviceHistoryError

  return (
    <ChildTemplate
      title={t('profile.title')}
      backLabel={t('home.title')}
      backLabelOnPress={navigation.goBack}
      testID="profileID">
      {loadingCheck ? (
        <Box>
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
            <LargeNavButton
              title={t('settings.title')}
              onPress={() => navigateTo('Settings')}
              borderWidth={theme.dimensions.buttonBorderWidth}
              borderColor={'secondary'}
              borderColorActive={'primaryDarkest'}
              borderStyle={'solid'}
            />
          </Box>
        </Box>
      ) : (
        <>
          <NameTag />
          <Box
            mt={theme.dimensions.contentMarginTop}
            mb={theme.dimensions.standardMarginBetween}
            mx={theme.dimensions.gutter}>
            {userAuthorizedServices?.userProfileUpdate && (
              <>
                <LargeNavButton
                  title={t('personalInformation.title')}
                  onPress={() => navigateTo('PersonalInformation')}
                  borderWidth={theme.dimensions.buttonBorderWidth}
                  borderColor={'secondary'}
                  borderColorActive={'primaryDarkest'}
                  borderStyle={'solid'}
                />
                <LargeNavButton
                  title={t('contactInformation.title')}
                  onPress={() => navigateTo('ContactInformation')}
                  borderWidth={theme.dimensions.buttonBorderWidth}
                  borderColor={'secondary'}
                  borderColorActive={'primaryDarkest'}
                  borderStyle={'solid'}
                />
              </>
            )}
            <LargeNavButton
              title={t('militaryInformation.title')}
              onPress={() => navigateTo('MilitaryInformation')}
              borderWidth={theme.dimensions.buttonBorderWidth}
              borderColor={'secondary'}
              borderColorActive={'primaryDarkest'}
              borderStyle={'solid'}
            />
            <LargeNavButton
              title={t('settings.title')}
              onPress={() => navigateTo('Settings')}
              borderWidth={theme.dimensions.buttonBorderWidth}
              borderColor={'secondary'}
              borderColorActive={'primaryDarkest'}
              borderStyle={'solid'}
            />
          </Box>
        </>
      )}
    </ChildTemplate>
  )
}

export default ProfileScreen
