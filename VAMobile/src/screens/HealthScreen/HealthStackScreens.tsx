import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import AppointmentCancellationConfirmation from './Appointments/UpcomingAppointments/AppointmentCancellationConfirmation'
import Appointments from './Appointments'
import FolderMessages from './SecureMessaging/FolderMessages/FolderMessages'
import PastAppointmentDetails from './Appointments/PastAppointments/PastAppointmentDetails'
import PrepareForVideoVisit from './Appointments/UpcomingAppointments/PrepareForVideoVisit/PrepareForVideoVisit'
import SecureMessaging from './SecureMessaging'
import UpcomingAppointmentDetails from './Appointments/UpcomingAppointments/UpcomingAppointmentDetails'
import ViewMessageScreen from './SecureMessaging/ViewMessage/ViewMessageScreen'

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
  Messages: undefined
  SecureMessaging: undefined
  Inbox: {
    messageID: number
  }
  Folders: {
    folderID: number
  }
  FolderMessages: {
    folderID: number
    folderName: string
  }
  ViewMessageScreen: {
    messageID: number
  }
}

const HealthStack = createStackNavigator<HealthStackParamList>()

export const getHealthScreens = (t: TFunction): Array<ReactNode> => {
  return [
    //TODO add next level of nav
    // <SecureMessagingStack.Screen
    //   key={'InboxMessages'}
    //   name="InboxMessages"
    //   component={InboxMessages}
    //   options={{ title: t('secure_messaging.inbox_messages') }}
    // />,
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
    <HealthStack.Screen name="Messages" component={SecureMessaging} options={{ title: t('title') }} />,
    <HealthStack.Screen key={'FolderMessages'} name="FolderMessages" component={FolderMessages} options={{ title: t('secureMessaging.folders') }} />,
    <HealthStack.Screen key={'ViewMessage'} name="ViewMessageScreen" component={ViewMessageScreen} options={{ title: t('secureMessaging.viewMessage') }} />,
  ]
}
