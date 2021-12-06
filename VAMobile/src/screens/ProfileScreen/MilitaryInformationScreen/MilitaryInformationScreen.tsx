import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { AuthorizedServicesState, ErrorsState, MilitaryServiceState, StoreState } from 'store/reducers'
import { Box, DefaultList, DefaultListItemObj, ErrorComponent, LoadingComponent, TextLine, TextView, TextViewProps, VAScrollView } from 'components'
import { DowntimeFeatureTypeConstants, ServiceData } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { generateTestID } from 'utils/common'
import { getServiceHistory } from 'store'
import { isInDowntime } from 'utils/errors'
import { testIdProps } from 'utils/accessibility'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import { useHasMilitaryInformationAccess } from 'utils/authorizationHooks'
import NoMilitaryInformationAccess from './NoMilitaryInformationAccess'
import ProfileBanner from '../ProfileBanner'

const MilitaryInformationScreen: FC = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const { serviceHistory, loading, needsDataLoad } = useSelector<StoreState, MilitaryServiceState>((s) => s.militaryService)
  const { militaryServiceHistory: militaryInfoAuthorization } = useSelector<StoreState, AuthorizedServicesState>((s) => s.authorizedServices)
  const { downtimeWindowsByFeature } = useSelector<StoreState, ErrorsState>((state) => state.errors)
  const accessToMilitaryInfo = useHasMilitaryInformationAccess()

  useEffect(() => {
    if (needsDataLoad && militaryInfoAuthorization && !isInDowntime(DowntimeFeatureTypeConstants.militaryServiceHistory, downtimeWindowsByFeature)) {
      dispatch(getServiceHistory(ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID))
    }
  }, [dispatch, needsDataLoad, militaryInfoAuthorization, downtimeWindowsByFeature])

  const historyItems: Array<DefaultListItemObj> = map(serviceHistory, (service: ServiceData) => {
    const branch = t('personalInformation.branch', { branch: service.branchOfService })

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
    ...testIdProps(generateTestID(t('militaryInformation.incorrectServiceInfo'), '')),
    onPress: navigateTo('IncorrectServiceInfo'),
    textDecoration: 'underline',
    textDecorationColor: 'link',
  }

  if (useError(ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID} />
  }

  if (loading) {
    return (
      <React.Fragment>
        <ProfileBanner />
        <LoadingComponent />
      </React.Fragment>
    )
  }

  if (!accessToMilitaryInfo) {
    return (
      <>
        <ProfileBanner />
        <NoMilitaryInformationAccess />
      </>
    )
  }

  return (
    <VAScrollView {...testIdProps('Military-Information-page')}>
      <ProfileBanner />
      <Box mb={theme.dimensions.standardMarginBetween}>
        <DefaultList items={historyItems} title={t('militaryInformation.periodOfService')} />
      </Box>
      <TextView {...linkProps}>{t('militaryInformation.incorrectServiceInfo')}</TextView>
    </VAScrollView>
  )
}

export default MilitaryInformationScreen
