import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { StackScreenProps } from '@react-navigation/stack'

import { map } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
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
import { RootState } from 'store'
import { DowntimeFeatureTypeConstants, ServiceData } from 'store/api/types'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { MilitaryServiceState, getServiceHistory } from 'store/slices/militaryServiceSlice'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDowntime, useError, useRouteNavigation, useTheme } from 'utils/hooks'

import NoMilitaryInformationAccess from './NoMilitaryInformationAccess'

type MilitaryInformationScreenProps = StackScreenProps<HomeStackParamList, 'MilitaryInformation'>

function MilitaryInformationScreen({ navigation }: MilitaryInformationScreenProps) {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { serviceHistory, loading, needsDataLoad } = useSelector<RootState, MilitaryServiceState>(
    (s) => s.militaryService,
  )
  const {
    data: userAuthorizedServices,
    isLoading: loadingUserAuthorizedServices,
    isError: getUserAuthorizedServicesError,
  } = useAuthorizedServices()
  const mhNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.militaryServiceHistory)
  const navigateTo = useRouteNavigation()

  useEffect(() => {
    if (needsDataLoad && userAuthorizedServices?.militaryServiceHistory && mhNotInDowntime) {
      dispatch(getServiceHistory(ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID))
    }
  }, [dispatch, needsDataLoad, userAuthorizedServices?.militaryServiceHistory, mhNotInDowntime])

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
    ...testIdProps(t('militaryInformation.incorrectServiceInfo')),
    onPress: onIncorrectService,
    textDecoration: 'underline',
    textDecorationColor: 'link',
  }

  const errorCheck = useError(ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID) || getUserAuthorizedServicesError
  const loadingCheck = loading || loadingUserAuthorizedServices

  return (
    <FeatureLandingTemplate
      backLabel={t('profile.title')}
      backLabelOnPress={navigation.goBack}
      title={t('militaryInformation.title')}>
      {errorCheck ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID} />
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
