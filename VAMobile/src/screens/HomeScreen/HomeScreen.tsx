import { Linking, ScrollView } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { Box, List, ListItemObj } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useHeaderStyles, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ContactVAScreen from './ContactVAScreen/ContactVAScreen'
import CrisisLineCta from './CrisisLineCta'
import HomeNavButton from './HomeNavButton'
import React, { FC } from 'react'
import VeteransCrisisLineScreen from './VeteransCrisisLineScreen/VeteransCrisisLineScreen'
import getEnv from 'utils/env'

const { WEBVIEW_URL_CORONA_FAQ, WEBVIEW_URL_FACILITY_LOCATOR, LINK_URL_COVID19_SCREENING } = getEnv()

export type HomeStackParamList = {
  Home: undefined
  ContactVA: undefined
  Claims: undefined
  Appointments: undefined
  VeteransCrisisLine: undefined
}

const HomeStack = createStackNavigator<HomeStackParamList>()

type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>

const HomeScreen: FC<HomeScreenProps> = () => {
  const t = useTranslation(NAMESPACE.HOME)
  const navigateTo = useRouteNavigation()
  const theme = useTheme()

  const onScreeningTool = (): void => {
    Linking.openURL(LINK_URL_COVID19_SCREENING)
  }

  const onClaimsAndAppeals = navigateTo('Claims')
  const onAppointments = navigateTo('Appointments')
  const onContactVA = navigateTo('ContactVA')
  const onFacilityLocator = navigateTo('Webview', { url: WEBVIEW_URL_FACILITY_LOCATOR, displayTitle: t('common:webview.vagov') })
  const onCoronaVirusFAQ = navigateTo('Webview', { url: WEBVIEW_URL_CORONA_FAQ, displayTitle: t('common:webview.vagov') })
  const onCrisisLine = navigateTo('VeteransCrisisLine')

  const buttonDataList: Array<ListItemObj> = [
    { textLines: t('findLocation.title'), a11yHintText: t('findLocation.a11yHint'), onPress: onFacilityLocator },
    { textLines: t('contactVA.title'), a11yHintText: t('contactVA.a11yHint'), onPress: onContactVA },
    { textLines: t('coronavirusFaqs.title'), a11yHintText: t('coronavirusFaqs.a11yHint'), onPress: onCoronaVirusFAQ },
    { textLines: t('screeningTool.title'), a11yHintText: t('screeningTool.a11yHint'), onPress: onScreeningTool },
  ]

  return (
    <ScrollView accessibilityRole={'menu'}>
      <Box flex={1} justifyContent="flex-start" {...testIdProps('Home-screen')}>
        <CrisisLineCta onPress={onCrisisLine} />
        <Box mx={theme.dimensions.gutter}>
          <HomeNavButton title={t('claimsAndAppeals.title')} subText={t('claimsAndAppeals.subText')} a11yHint={t('claimsAndAppeals.a11yHint')} onPress={onClaimsAndAppeals} />
          <HomeNavButton title={t('appointments.title')} subText={t('appointments.subText')} a11yHint={t('appointments.a11yHint')} onPress={onAppointments} />
        </Box>
        <Box my={theme.dimensions.contentMarginBottom}>
          <List items={buttonDataList} />
        </Box>
      </Box>
    </ScrollView>
  )
}

type HomeStackScreenProps = {}

const HomeStackScreen: FC<HomeStackScreenProps> = () => {
  const t = useTranslation(NAMESPACE.HOME)
  const headerStyles = useHeaderStyles()

  return (
    <HomeStack.Navigator screenOptions={headerStyles}>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: t('title') }} />
      <HomeStack.Screen name="ContactVA" component={ContactVAScreen} options={{ title: t('contactVA.title') }} />
      <HomeStack.Screen name="VeteransCrisisLine" component={VeteransCrisisLineScreen} options={{ title: t('veteransCrisisLine.title') }} />
    </HomeStack.Navigator>
  )
}

export default HomeStackScreen
