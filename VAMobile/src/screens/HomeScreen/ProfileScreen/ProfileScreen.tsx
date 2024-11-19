import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useServiceHistory } from 'api/militaryService'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import {
  Box,
  CategoryLandingAlert,
  ChildTemplate,
  ErrorComponent,
  LargeNavButton,
  LoadingComponent,
  NameTag,
  TextView,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'

type ProfileScreenProps = StackScreenProps<HomeStackParamList, 'Profile'>

function ProfileScreen({ navigation }: ProfileScreenProps) {
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const {
    data: userAuthorizedServices,
    isLoading: loadingUserAuthorizedServices,
    error: getUserAuthorizedServicesError,
    refetch: refetchUserAuthorizedServices,
  } = useAuthorizedServices()
  const { data: personalInfo } = usePersonalInformation()
  const { isLoading: loadingServiceHistory, isError: serviceHistoryError } = useServiceHistory()

  const serviceHistoryInDowntime = useDowntime(DowntimeFeatureTypeConstants.militaryServiceHistory)

  const loadingCheck = loadingServiceHistory || loadingUserAuthorizedServices

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
      ) : getUserAuthorizedServicesError ? (
        <ErrorComponent
          onTryAgain={refetchUserAuthorizedServices}
          screenID={ScreenIDTypesConstants.PROFILE_SCREEN_ID}
          error={getUserAuthorizedServicesError}
        />
      ) : (
        <>
          {displayName}
          <NameTag />
          {userAuthorizedServices?.userProfileUpdate && (
            <>
              <LargeNavButton
                title={t('personalInformation.title')}
                onPress={() => navigateTo('PersonalInformation')}
                testID="toPersonalInfoID"
              />
              <LargeNavButton
                title={t('contactInformation.title')}
                onPress={() => navigateTo('ContactInformation')}
                testID="toContactInfoID"
              />
            </>
          )}
          <LargeNavButton
            title={t('militaryInformation.title')}
            onPress={() => navigateTo('MilitaryInformation')}
            testID="toMilitaryHistoryID"
          />
          <LargeNavButton title={t('settings.title')} onPress={() => navigateTo('Settings')} testID="toSettingsID" />
          {(serviceHistoryError || serviceHistoryInDowntime) && (
            <Box mx={theme.dimensions.condensedMarginBetween}>
              <CategoryLandingAlert text={t('aboutYou.error.cantShowAllInfo')} isError={serviceHistoryError} />
            </Box>
          )}
        </>
      )}
    </ChildTemplate>
  )
}

export default ProfileScreen
