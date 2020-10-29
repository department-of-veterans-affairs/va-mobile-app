import { Linking, ScrollView, StyleProp, View, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'

import { Box, ButtonList, ButtonListItemObj, CheckBox, TextArea } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import { testIdProps } from 'utils/accessibility'
import { updateTabBarVisible } from 'store/actions'
import { useHeaderStyles, useTranslation } from 'utils/hooks'
import ContactVAScreen from './ContactVAScreen/ContactVAScreen'
import CrisisLineCta from './CrisisLineCta'
import HomeNavButton from './HomeNavButton'
import React, { FC, useState } from 'react'
import VeteransCrisisLineScreen from './VeteransCrisisLineScreen/VeteransCrisisLineScreen'
import WebviewScreen from 'screens/WebviewScreen'
import getEnv from 'utils/env'

const { WEBVIEW_URL_CORONA_FAQ, WEBVIEW_URL_FACILITY_LOCATOR, LINK_URL_COVID19_SCREENING } = getEnv()

export type HomeStackParamList = WebviewStackParams & {
  Home: undefined
  ContactVA: undefined
  Claims: undefined
  Appointments: undefined
  VeteransCrisisLine: undefined
}

const HomeStack = createStackNavigator<HomeStackParamList>()

type HomeScreenProps = StackScreenProps<HomeStackParamList, 'Home'>

const HomeScreen: FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.HOME)

  const [selected, setSelected] = useState(false)

  useFocusEffect(() => {
    dispatch(updateTabBarVisible(true))
  })

  const mainViewStyle: StyleProp<ViewStyle> = {
    flex: 1,
    justifyContent: 'flex-start',
  }

  const onClaimsAndAppeals = (): void => {
    navigation.navigate('Claims')
  }

  const onAppointments = (): void => {
    navigation.navigate('Appointments')
  }

  const onContactVA = (): void => {
    navigation.navigate('ContactVA')
  }

  const onFacilityLocator = (): void => {
    navigation.navigate('Webview', { url: WEBVIEW_URL_FACILITY_LOCATOR, displayTitle: t('common:webview.vagov') })
  }

  const onCoronaVirusFAQ = (): void => {
    navigation.navigate('Webview', { url: WEBVIEW_URL_CORONA_FAQ, displayTitle: t('common:webview.vagov') })
  }

  const onScreeningTool = (): void => {
    Linking.openURL(LINK_URL_COVID19_SCREENING)
  }

  const onCrisisLine = (): void => {
    navigation.navigate('VeteransCrisisLine')
  }

  const buttonDataList: Array<ButtonListItemObj> = [
    { textIDs: 'findLocation.title', a11yHintID: 'findLocation.a11yHint', onPress: onFacilityLocator },
    { textIDs: 'contactVA.title', a11yHintID: 'contactVA.a11yHint', onPress: onContactVA },
    { textIDs: 'coronavirusFaqs.title', a11yHintID: 'coronavirusFaqs.a11yHint', onPress: onCoronaVirusFAQ },
    { textIDs: 'screeningTool.title', a11yHintID: 'screeningTool.a11yHint', onPress: onScreeningTool },
  ]

  return (
    <View style={mainViewStyle} {...testIdProps('Home-screen')}>
      <CrisisLineCta onPress={onCrisisLine} />

      <TextArea>
        <CheckBox selected={selected} setSelected={setSelected} text={'I live on a United States military base outside of the United States.'} />
      </TextArea>

      <ScrollView accessibilityRole={'menu'}>
        <Box mx={20}>
          <HomeNavButton title={t('claimsAndAppeals.title')} subText={t('claimsAndAppeals.subText')} a11yHint={t('claimsAndAppeals.allyHint')} onPress={onClaimsAndAppeals} />
          <HomeNavButton title={t('appointments.title')} subText={t('appointments.subText')} a11yHint={t('appointments.allyHint')} onPress={onAppointments} />
        </Box>
        <Box my={40}>
          <ButtonList translationNameSpace={NAMESPACE.HOME} items={buttonDataList} />
        </Box>
      </ScrollView>
    </View>
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
      <HomeStack.Screen name="Webview" component={WebviewScreen} />
      <HomeStack.Screen name="VeteransCrisisLine" component={VeteransCrisisLineScreen} options={{ title: t('veteransCrisisLine.title') }} />
    </HomeStack.Navigator>
  )
}

export default HomeStackScreen
