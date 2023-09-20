import { map } from 'underscore'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, DefaultList, DefaultListItemObj, ErrorComponent, FeatureLandingTemplate, LoadingComponent, TextLine, TextView, TextViewProps } from 'components'
import { DowntimeFeatureTypeConstants, ServiceData } from 'store/api/types'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { MilitaryServiceState, getServiceHistory } from 'store/slices/militaryServiceSlice'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { StackScreenProps } from '@react-navigation/stack'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useDowntime, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useSelector } from 'react-redux'
import NoMilitaryInformationAccess from './NoMilitaryInformationAccess'

type MilitaryInformationScreenProps = StackScreenProps<HomeStackParamList, 'MilitaryInformation'>

const MilitaryInformationScreen: FC<MilitaryInformationScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { serviceHistory, loading, needsDataLoad } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)
  const { data: userAuthorizedServices, isLoading: loadingUserAuthorizedServices, isError: getUserAuthorizedServicesError } = useAuthorizedServices()
  const mhNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.militaryServiceHistory)

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

  const navigateTo = useRouteNavigation()

  const linkProps: TextViewProps = {
    variant: 'MobileBody',
    color: 'link',
    mx: theme.dimensions.gutter,
    mb: theme.dimensions.contentMarginBottom,
    accessibilityRole: 'link',
    ...testIdProps(t('militaryInformation.incorrectServiceInfo')),
    onPress: navigateTo('IncorrectServiceInfo'),
    textDecoration: 'underline',
    textDecorationColor: 'link',
  }

  if (useError(ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID) || getUserAuthorizedServicesError) {
    return (
      <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('militaryInformation.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate backLabel={t('profile.title')} backLabelOnPress={navigation.goBack} title={t('militaryInformation.title')}>
      {loading || loadingUserAuthorizedServices ? (
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
