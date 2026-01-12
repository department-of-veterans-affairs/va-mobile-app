import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { map } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useServiceHistory } from 'api/militaryService'
import { ServiceData, ServiceHistoryData } from 'api/types'
import {
  Box,
  DefaultList,
  DefaultListItemObj,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  ScreenError,
  TextLine,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import NoMilitaryInformationAccess from 'screens/HomeScreen/ProfileScreen/MilitaryInformationScreen/NoMilitaryInformationAccess'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'

type MilitaryInformationScreenProps = StackScreenProps<HomeStackParamList, 'MilitaryInformation'>

function MilitaryInformationScreen({ navigation }: MilitaryInformationScreenProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const {
    data: userAuthorizedServices,
    isLoading: loadingUserAuthorizedServices,
    error: getUserAuthorizedServicesError,
    refetch: refetchAuthServices,
  } = useAuthorizedServices()
  const mhNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.militaryServiceHistory)
  const {
    data: militaryServiceHistoryAttributes,
    isFetching: loadingServiceHistory,
    error: useServiceHistoryError,
    refetch: refetchServiceHistory,
  } = useServiceHistory()
  const serviceHistory = militaryServiceHistoryAttributes?.serviceHistory || ([] as ServiceHistoryData)
  const navigateTo = useRouteNavigation()

  const historyItems: Array<DefaultListItemObj> = map(serviceHistory, (service: ServiceData) => {
    const branch = t('militaryInformation.branch', { branch: service.branchOfService })

    const textLines: Array<TextLine> = [
      {
        text: branch,
        variant: 'MobileBodyBold',
      },
      {
        text: t('militaryInformation.history', { begin: service.formattedBeginDate, end: service.formattedEndDate }),
      },
    ]
    return {
      textLines,
      testId: `${branch} ${t('militaryInformation.historyA11yLabel', {
        begin: service.formattedBeginDate,
        end: service.formattedEndDate,
      })}`,
    }
  })

  const onIncorrectService = () => {
    navigateTo('IncorrectServiceInfo')
  }

  const loadingCheck = loadingServiceHistory || loadingUserAuthorizedServices

  const screenErrors: Array<ScreenError> = [
    {
      errorCheck: !mhNotInDowntime,
    },
    {
      errorCheck: !!getUserAuthorizedServicesError,
      onTryAgain: refetchAuthServices,
      error: getUserAuthorizedServicesError,
    },
    {
      errorCheck: !!useServiceHistoryError,
      onTryAgain: refetchServiceHistory,
      error: useServiceHistoryError,
    },
  ]

  return (
    <FeatureLandingTemplate
      backLabel={t('profile.title')}
      backLabelOnPress={navigation.goBack}
      title={t('militaryInformation.title')}
      backLabelTestID="backToProfileID"
      screenID={ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID}
      isLoading={loadingCheck}
      loadingText={t('militaryInformation.loading')}
      errors={screenErrors}>
      {!userAuthorizedServices?.militaryServiceHistory ? (
        <NoMilitaryInformationAccess />
      ) : serviceHistory.length < 1 ? (
        <NoMilitaryInformationAccess />
      ) : (
        <>
          <Box mb={theme.dimensions.standardMarginBetween} mt={-theme.dimensions.standardMarginBetween}>
            <DefaultList items={historyItems} title={t('militaryInformation.periodOfService')} />
          </Box>
          <Box mx={theme.dimensions.gutter} mb={theme.dimensions.contentMarginBottom}>
            <LinkWithAnalytics
              type="custom"
              text={t('militaryInformation.incorrectServiceInfo')}
              onPress={onIncorrectService}
              testID="militaryServiceIncorrectLinkID"
            />
          </Box>
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default MilitaryInformationScreen
