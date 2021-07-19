import React, { ReactNode } from 'react'

import { ImagePickerResponse } from 'react-native-image-picker'
import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'

import { CategoryTypes, SecureMessagingFormData } from 'store/api/types'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { FormHeaderType } from 'constants/secureMessaging'
import AppointmentCancellationConfirmation from './Appointments/UpcomingAppointments/AppointmentCancellationConfirmation'
import Appointments from './Appointments'
import Attachments from './SecureMessaging/ComposeMessage/Attachments/Attachments'
import AttachmentsFAQ from './SecureMessaging/ComposeMessage/AttachmentsFAQ/AttachmentsFAQ'
import ComposeCancelConfirmation from './SecureMessaging/CancelConfirmations/ComposeCancelConfirmation'
import ComposeMessage from './SecureMessaging/ComposeMessage/ComposeMessage'
import FolderMessages from './SecureMessaging/FolderMessages/FolderMessages'
import PastAppointmentDetails from './Appointments/PastAppointments/PastAppointmentDetails'
import PrepareForVideoVisit from './Appointments/UpcomingAppointments/PrepareForVideoVisit/PrepareForVideoVisit'
import RemoveAttachment from './SecureMessaging/ComposeMessage/RemoveAttachment/RemoveAttachment'
import ReplyCancelConfirmation from './SecureMessaging/CancelConfirmations/ReplyCancelConfirmation'
import ReplyMessage from './SecureMessaging/ReplyMessage/ReplyMessage'
import ReplyTriageErrorScreen from './SecureMessaging/SendConfirmation/ReplyTriageErrorScreen'
import SecureMessaging from './SecureMessaging'
import SendConfirmation from './SecureMessaging/SendConfirmation/SendConfirmation'
import SuccessfulSendScreen from './SecureMessaging/SendConfirmation/SuccessfulSendScreen'
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
  SecureMessaging: {
    goToDrafts?: boolean
  }
  Inbox: {
    messageID: number
  }
  Folders: {
    folderID: number
  }
  FolderMessages: {
    folderID: number
    folderName: string
    draftSaved: boolean
  }
  ViewMessageScreen: {
    messageID: number
  }
  ComposeMessage: {
    attachmentFileToAdd: ImagePickerResponse | DocumentPickerResponse
    attachmentFileToRemove: ImagePickerResponse | DocumentPickerResponse
    saveDraftConfirmFailed: boolean
  }
  ReplyMessage: {
    messageID: number
    attachmentFileToAdd: ImagePickerResponse | DocumentPickerResponse
    attachmentFileToRemove: ImagePickerResponse | DocumentPickerResponse
  }
  Attachments: {
    origin: FormHeaderType
    attachmentsList: Array<ImagePickerResponse | DocumentPickerResponse>
    messageID?: number
  }
  AttachmentsFAQ: {
    originHeader: string
  }
  RemoveAttachment: {
    origin: FormHeaderType
    attachmentFileToRemove: ImagePickerResponse | DocumentPickerResponse
    messageID?: number
  }
  SendConfirmation: {
    originHeader: string
    messageData: SecureMessagingFormData
    uploads?: (ImagePickerResponse | DocumentPickerResponse)[]
    messageID?: number
  }
  ComposeCancelConfirmation: {
    draftMessageID: number
    messageData: SecureMessagingFormData
    isFormValid: boolean
  }
  ReplyCancelConfirmation: {
    messageID: number
  }
  SuccessfulSendScreen: undefined
  ReplyTriageErrorScreen: undefined
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
    <HealthStack.Screen key={'Messages'} name="Messages" component={SecureMessaging} options={{ title: t('secureMessaging.title') }} />,
    <HealthStack.Screen key={'FolderMessages'} name="FolderMessages" component={FolderMessages} options={{ title: t('secureMessaging.folders') }} />,
    <HealthStack.Screen key={'ViewMessage'} name="ViewMessageScreen" component={ViewMessageScreen} options={{ title: t('secureMessaging.viewMessage') }} />,
    <HealthStack.Screen key={'ComposeMessage'} name="ComposeMessage" component={ComposeMessage} options={{ title: t('secureMessaging.composeMessage.compose') }} />,
    <HealthStack.Screen key={'ReplyMessage'} name="ReplyMessage" component={ReplyMessage} options={{ title: t('secureMessaging.reply') }} />,
    <HealthStack.Screen key={'Attachments'} name="Attachments" component={Attachments} options={{ title: t('secureMessaging.attachments') }} />,
    <HealthStack.Screen key={'RemoveAttachment'} name="RemoveAttachment" component={RemoveAttachment} options={{ title: t('secureMessaging.attachments') }} />,
    <HealthStack.Screen key={'SendConfirmation'} name="SendConfirmation" component={SendConfirmation} />,
    <HealthStack.Screen key={'AttachmentsFAQ'} name="AttachmentsFAQ" component={AttachmentsFAQ} />,
    <HealthStack.Screen
      key={'ComposeCancelConfirmation'}
      name="ComposeCancelConfirmation"
      component={ComposeCancelConfirmation}
      options={{ title: t('secureMessaging.composeMessage.compose') }}
    />,
    <HealthStack.Screen key={'ReplyCancelConfirmation'} name="ReplyCancelConfirmation" component={ReplyCancelConfirmation} options={{ title: t('secureMessaging.reply') }} />,
    <HealthStack.Screen key={'SuccessfulSendScreen'} name="SuccessfulSendScreen" component={SuccessfulSendScreen} options={{ title: t('secureMessaging.sent') }} />,
    <HealthStack.Screen key={'ReplyTriageErrorScreen'} name="ReplyTriageErrorScreen" component={ReplyTriageErrorScreen} options={{ title: t('secureMessaging.reply') }} />,
  ]
}
