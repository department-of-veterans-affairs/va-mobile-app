import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import ContactVAScreen from './ContactVAScreen/ContactVAScreen'
import Covid19VaccinationFormScreen from './Covid19VaccinationForm/Covid19VaccinationFormScreen'
import SecureMessaging from '../HealthScreen/SecureMessaging'
import VeteransCrisisLineScreen from './VeteransCrisisLineScreen/VeteransCrisisLineScreen'

export type HomeStackParamList = {
  Home: undefined
  ContactVA: undefined
  Claims: undefined
  Appointments: undefined
  SecureMessaging: undefined
  VeteransCrisisLine: undefined
  Covid19VaccinationsForm: undefined
}

const HomeStack = createStackNavigator<HomeStackParamList>()

export const getHomeScreens = (t: TFunction): Array<ReactNode> => {
  return [
    <HomeStack.Screen key={'ContactVA'} name="ContactVA" component={ContactVAScreen} options={{ title: t('contactVA.title') }} />,
    <HomeStack.Screen key={'VeteransCrisisLine'} name="VeteransCrisisLine" component={VeteransCrisisLineScreen} options={{ title: t('veteransCrisisLine.title') }} />,
    <HomeStack.Screen
      key={'Covid19VaccinationsForm'}
      name="Covid19VaccinationsForm"
      component={Covid19VaccinationFormScreen}
      options={{ title: t('covid19Vaccinations.title') }}
    />,
    <HomeStack.Screen key={'SecureMessaging'} name="SecureMessaging" component={SecureMessaging} options={{ title: t('secureMessaging.title') }} />,
  ]
}
