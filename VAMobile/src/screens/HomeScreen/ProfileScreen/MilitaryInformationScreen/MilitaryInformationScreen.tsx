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
  ErrorComponent,
  FeatureLandingTemplate,
  LoadingComponent,
  TextLine,
  TextView,
  TextViewProps,
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
    isError: getUserAuthorizedServicesError,
  } = useAuthorizedServices()
  const mhNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.militaryServiceHistory)
  const {
    data: militaryServiceHistoryAttributes,
    isLoading: loadingServiceHistory,
    isError: useServiceHistoryError,
    error: militaryInfoRQError,
    refetch: refetchServiceHistory,
  } = useServiceHistory({ enabled: userAuthorizedServices?.militaryServiceHistory && mhNotInDowntime })
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

  const linkProps: TextViewProps = {
    variant: 'MobileBody',
    color: 'link',
    mx: theme.dimensions.gutter,
    mb: theme.dimensions.contentMarginBottom,
    accessibilityRole: 'link',
    testID: t('militaryInformation.incorrectServiceInfo'),
    onPress: onIncorrectService,
    textDecoration: 'underline',
    textDecorationColor: 'link',
  }

  const errorCheck = useServiceHistoryError || getUserAuthorizedServicesError
  const loadingCheck = loadingServiceHistory || loadingUserAuthorizedServices

  return (
    <FeatureLandingTemplate
      backLabel={t('profile.title')}
      backLabelOnPress={navigation.goBack}
      title={t('militaryInformation.title')}>
      {errorCheck || !mhNotInDowntime ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID}
          reactQueryError={militaryInfoRQError}
          onTryAgain={refetchServiceHistory}
        />
      ) : loadingCheck ? (
        <LoadingComponent text={t('militaryInformation.loading')} />
      ) : !userAuthorizedServices?.militaryServiceHistory || serviceHistory.length < 1 ? (
        <NoMilitaryInformationAccess />
      ) : (
        <>
          <Box mb={theme.dimensions.standardMarginBetween} mt={-theme.dimensions.standardMarginBetween}>
            <DefaultList items={historyItems} title={t('militaryInformation.periodOfService')} />
          </Box>
          <TextView {...linkProps}>{t('militaryInformation.incorrectServiceInfo')}</TextView>
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default MilitaryInformationScreen
