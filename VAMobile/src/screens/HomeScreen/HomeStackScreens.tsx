import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import CalendarDateTimePicker from './CalendarDateTimePicker'
import CalendarWixScreen from './Calendar'
import ContactVAScreen from './ContactVAScreen/ContactVAScreen'
import CustomCalendarScreen from './CustomCalendar'
import SecureMessaging from '../HealthScreen/SecureMessaging'
import VeteransCrisisLineScreen from './VeteransCrisisLineScreen/VeteransCrisisLineScreen'

export type HomeStackParamList = WebviewStackParams & {
  Home: undefined
  ContactVA: undefined
  Claims: undefined
  Appointments: undefined
  SecureMessaging: undefined
  VeteransCrisisLine: undefined
  Covid19VaccinationsForm: undefined
  CalendarWix: undefined
  CalendarDTP: undefined
  CustomCalendar: undefined
}

const HomeStack = createStackNavigator<HomeStackParamList>()

export const getHomeScreens = (t: TFunction): Array<ReactNode> => {
  return [
    <HomeStack.Screen key={'ContactVA'} name="ContactVA" component={ContactVAScreen} options={{ title: t('contactVA.title') }} />,
    <HomeStack.Screen key={'VeteransCrisisLine'} name="VeteransCrisisLine" component={VeteransCrisisLineScreen} options={{ title: t('veteransCrisisLine.title') }} />,
    <HomeStack.Screen key={'SecureMessaging'} name="SecureMessaging" component={SecureMessaging} options={{ title: t('secureMessaging.title') }} />,
    <HomeStack.Screen key={'CalendarDTP'} name="CalendarDTP" component={CalendarDateTimePicker} options={{ title: 'CalendarDTP' }} />,
    <HomeStack.Screen key={'CalendarWix'} name="CalendarWix" component={CalendarWixScreen} options={{ title: 'CalendarWix' }} />,
    <HomeStack.Screen key={'CustomCalendar'} name="CustomCalendar" component={CustomCalendarScreen} options={{ title: 'CustomCalendarScreen' }} />,
  ]
}
