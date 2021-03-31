import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import AppointmentCancellationConfirmation from './Appointments/UpcomingAppointments/AppointmentCancellationConfirmation'
import Appointments from './Appointments'
import PastAppointmentDetails from './Appointments/PastAppointments/PastAppointmentDetails'
import PrepareForVideoVisit from './Appointments/UpcomingAppointments/PrepareForVideoVisit/PrepareForVideoVisit'
import UpcomingAppointmentDetails from './Appointments/UpcomingAppointments/UpcomingAppointmentDetails'

export type HealthStackParamList = {
  Health: undefined
  Appointments: undefined
  UpcomingAppointmentDetails: {
    appointmentID: string
  }
  PrepareForVideoVisit: undefined
  PastAppointmentDetails: {
    appointmentID: string
  }
  AppointmentCancellationConfirmation: {
    cancelID: string
    appointmentID: string
  }
}

const HealthStack = createStackNavigator<HealthStackParamList>()

export const getHealthScreens = (t: TFunction): Array<ReactNode> => {
  return [
    <HealthStack.Screen key={'Appointments'} name="Appointments" component={Appointments} options={{ title: t('appointments.appointments') }} />,
    <HealthStack.Screen
      key={'UpcomingAppointmentDetails'}
      name="UpcomingAppointmentDetails"
      component={UpcomingAppointmentDetails}
      options={{ title: t('appointments.appointment') }}
    />,
    <HealthStack.Screen key={'PrepareForVideoVisit'} name="PrepareForVideoVisit" component={PrepareForVideoVisit} />,
    <HealthStack.Screen key={'PastAppointmentDetails'} name="PastAppointmentDetails" component={PastAppointmentDetails} options={{ title: t('pastAppointmentDetails.title') }} />,
    <HealthStack.Screen
      key={'AppointmentCancellationConfirmation'}
      name="AppointmentCancellationConfirmation"
      component={AppointmentCancellationConfirmation}
      options={{ title: t('upcomingAppointmentDetails.cancelAppointment') }}
    />,
  ]
}
