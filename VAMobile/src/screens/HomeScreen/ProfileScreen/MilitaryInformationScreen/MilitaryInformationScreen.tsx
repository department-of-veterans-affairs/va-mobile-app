import React from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityRole } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { map } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useServiceHistory } from 'api/militaryService'
import { ServiceData, ServiceHistoryData } from 'api/types'
import {
  Box,
  DefaultList,
  DefaultListItemObj,
  ErrorComponent,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  LoadingComponent,
  TextLine,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'

import NoMilitaryInformationAccess from './NoMilitaryInformationAccess'

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

    const a11yRole: AccessibilityRole = 'text'
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
      a11yRole,
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

  return (
    <FeatureLandingTemplate
      backLabel={t('profile.title')}
      backLabelOnPress={navigation.goBack}
      title={t('militaryInformation.title')}>
      {!mhNotInDowntime ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID} />
      ) : loadingCheck ? (
        <LoadingComponent text={t('militaryInformation.loading')} />
      ) : getUserAuthorizedServicesError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID}
          error={getUserAuthorizedServicesError}
          onTryAgain={refetchAuthServices}
        />
      ) : !userAuthorizedServices?.militaryServiceHistory ? (
        <NoMilitaryInformationAccess />
      ) : useServiceHistoryError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID}
          error={useServiceHistoryError}
          onTryAgain={refetchServiceHistory}
        />
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
              testID={t('militaryInformation.incorrectServiceInfo')}
            />
          </Box>
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default MilitaryInformationScreen
