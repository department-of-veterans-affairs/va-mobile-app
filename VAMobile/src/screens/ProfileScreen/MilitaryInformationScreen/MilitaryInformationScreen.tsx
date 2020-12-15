import { ScrollView } from 'react-native'
import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, List, ListItemObj, TextLine, TextView, TextViewProps } from 'components'
import { MilitaryServiceState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { ServiceData } from 'store/api/types'
import { generateTestID } from 'utils/common'
import { getServiceHistory } from 'store'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ProfileBanner from '../ProfileBanner'

const MilitaryInformationScreen: FC = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const { serviceHistory } = useSelector<StoreState, MilitaryServiceState>((s) => s.militaryService)

  useEffect(() => {
    dispatch(getServiceHistory())
  }, [dispatch])

  const historyItems: Array<ListItemObj> = map(serviceHistory, (service: ServiceData) => {
    const textLines: Array<TextLine> = [
      {
        text: t('personalInformation.branch', { branch: service.branchOfService }),
        variant: 'MobileBodyBold',
      },
      {
        text: t('militaryInformation.history', { begin: service.formattedBeginDate, end: service.formattedEndDate }),
      },
    ]
    return { textLines, a11yHintText: '' }
  })

  const posProps: TextViewProps = {
    variant: 'TableHeaderBold',
    mt: theme.dimensions.contentMarginTop,
    mx: theme.dimensions.gutter,
    mb: theme.dimensions.titleHeaderAndElementMargin,
    accessibilityRole: 'header',
    ...testIdProps(generateTestID(t('militaryInformation.periodOfService'), '')),
  }

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

  return (
    <ScrollView {...testIdProps('Military-Information-screen')}>
      <ProfileBanner />
      <TextView {...posProps}>{t('militaryInformation.periodOfService')}</TextView>
      <Box mb={theme.dimensions.marginBetween}>
        <List items={historyItems} />
      </Box>
      <TextView {...linkProps}>{t('militaryInformation.incorrectServiceInfo')}</TextView>
    </ScrollView>
  )
}

export default MilitaryInformationScreen
