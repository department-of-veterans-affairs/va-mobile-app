import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import AppointmentCancellationConfirmation from './UpcomingAppointments/AppointmentCancellationConfirmation'
import PastAppointmentDetails from './PastAppointments/PastAppointmentDetails'
import PrepareForVideoVisit from './UpcomingAppointments/PrepareForVideoVisit/PrepareForVideoVisit'
import UpcomingAppointmentDetails from './UpcomingAppointments/UpcomingAppointmentDetails'

export type AppointmentsStackParamList = {
  Appointments: undefined
  UpcomingAppointmentDetails: {
    appointmentID: string
  }
  PrepareForVideoVisit: undefined
  PastAppointmentDetails: {
    appointmentID: string
  }
  AppointmentCancellationConfirmation: {
    appointmentID: string
  }
}

const AppointmentsStack = createStackNavigator<AppointmentsStackParamList>()

export const getAppointmentScreens = (t: TFunction): Array<ReactNode> => {
  return [
    <AppointmentsStack.Screen
      key={'UpcomingAppointmentDetails'}
      name="UpcomingAppointmentDetails"
      component={UpcomingAppointmentDetails}
      options={{ title: t('appointments.appointment') }}
    />,
    <AppointmentsStack.Screen key={'PrepareForVideoVisit'} name="PrepareForVideoVisit" component={PrepareForVideoVisit} />,
    <AppointmentsStack.Screen
      key={'PastAppointmentDetails'}
      name="PastAppointmentDetails"
      component={PastAppointmentDetails}
      options={{ title: t('pastAppointmentDetails.title') }}
    />,
    <AppointmentsStack.Screen
      key={'AppointmentCancellationConfirmation'}
      name="AppointmentCancellationConfirmation"
      component={AppointmentCancellationConfirmation}
      options={{ title: t('upcomingAppointmentDetails.cancelAppointment') }}
    />,
  ]
}
