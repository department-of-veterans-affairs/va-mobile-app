import { ImagePickerResponse } from 'react-native-image-picker'
import { TFunction } from 'i18next'
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { FormHeaderType } from 'constants/secureMessaging'
import { GeneralHelpScreen, SubTypeHelpScreen, TypeOfCareNotListedHelpScreen } from './Appointments/RequestAppointments/AppointmentFlowHelpScreens'
import { PrescriptionData, PrescriptionHistoryTabs, RefillStatus, SecureMessagingFormData } from 'store/api/types'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'
import Appointments from './Appointments'
import Attachments from './SecureMessaging/ComposeMessage/Attachments/Attachments'
import AttachmentsFAQ from './SecureMessaging/ComposeMessage/AttachmentsFAQ/AttachmentsFAQ'
import ComposeMessage from './SecureMessaging/ComposeMessage/ComposeMessage'
import EditDraft from './SecureMessaging/EditDraft/EditDraft'
import FolderMessages from './SecureMessaging/FolderMessages/FolderMessages'
import NoRequestAppointmentAccess from './Appointments/RequestAppointments/NoRequestAppointmentAccess/NoRequestAppointmentAccess'
import PastAppointmentDetails from './Appointments/PastAppointments/PastAppointmentDetails'
import PrepareForVideoVisit from './Appointments/UpcomingAppointments/PrepareForVideoVisit/PrepareForVideoVisit'
import PrescriptionDetails from './Pharmacy/PrescriptionDetails/PrescriptionDetails'
import PrescriptionHelp from './Pharmacy/PrescriptionHelp/PrescriptionHelp'
import PrescriptionHistory from './Pharmacy/PrescriptionHistory/PrescriptionHistory'
import RefillScreenModal from './Pharmacy/RefillScreens/RefillScreen'
import RefillTrackingModal from './Pharmacy/RefillTrackingDetails/RefillTrackingDetails'
import ReplyMessage from './SecureMessaging/ReplyMessage/ReplyMessage'
import ReplyTriageErrorScreen from './SecureMessaging/SendConfirmation/ReplyTriageErrorScreen'
import RequestAppointmentScreen from './Appointments/RequestAppointments/RequestAppointmentScreen'
import SecureMessaging from './SecureMessaging'
import StatusGlossary from './Pharmacy/StatusGlossary/StatusGlossary'
import UpcomingAppointmentDetails from './Appointments/UpcomingAppointments/UpcomingAppointmentDetails'
import VaccineDetailsScreen from './Vaccines/VaccineDetails/VaccineDetailsScreen'
import VaccineListScreen from './Vaccines/VaccineList/VaccineListScreen'
import ViewMessageScreen from './SecureMessaging/ViewMessage/ViewMessageScreen'

export type HealthStackParamList = WebviewStackParams & {
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
    draftSaved: boolean
  }
  ViewMessageScreen: {
    messageID: number
    folderID?: number
    currentPage?: number
    messagesLeft?: number
  }
  ComposeMessage: {
    attachmentFileToAdd?: ImagePickerResponse | DocumentPickerResponse
    attachmentFileToRemove?: ImagePickerResponse | DocumentPickerResponse
    saveDraftConfirmFailed?: boolean
  }
  ReplyMessage: {
    messageID: number
    attachmentFileToAdd: ImagePickerResponse | DocumentPickerResponse
    attachmentFileToRemove: ImagePickerResponse | DocumentPickerResponse
  }
  EditDraft: {
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
    replyToID?: number
  }
  SuccessfulSendScreen: undefined
  ReplyTriageErrorScreen: undefined
  VaccineList: undefined
  VaccineDetails: {
    vaccineId: string
  }
  RequestAppointmentScreen: undefined
  GeneralHelpScreen: {
    title: string
    description: string
  }
  SubTypeHelpScreen: {
    careTypeId: string
  }
  NoRequestAppointmentAccess: undefined
  TypeOfCareNotListedHelpScreen: undefined
  PrescriptionHistory: {
    startingTab?: PrescriptionHistoryTabs | undefined
  }
  PrescriptionDetails: {
    prescriptionId: string
  }
  RefillScreenModal: undefined
  RefillTrackingModal: {
    prescription: PrescriptionData
  }
  StatusGlossary: {
    display: string
    value: RefillStatus
  }
  PrescriptionHelp: undefined
}

const HealthStack = createStackNavigator<HealthStackParamList>()

export const getHealthScreens = (t: TFunction): Array<ReactNode> => {
  return [
    <HealthStack.Screen key={'Appointments'} name="Appointments" component={Appointments} options={{ headerShown: false, title: t('appointments.appointments') }} />,
    <HealthStack.Screen
      key={'UpcomingAppointmentDetails'}
      name="UpcomingAppointmentDetails"
      component={UpcomingAppointmentDetails}
      options={{ title: t('appointments.appointment') }}
    />,
    <HealthStack.Screen key={'PrepareForVideoVisit'} name="PrepareForVideoVisit" component={PrepareForVideoVisit} />,
    <HealthStack.Screen key={'PastAppointmentDetails'} name="PastAppointmentDetails" component={PastAppointmentDetails} options={{ title: t('pastAppointmentDetails.title') }} />,
    <HealthStack.Screen key={'Messages'} name="Messages" component={SecureMessaging} options={{ title: t('secureMessaging.title') }} />,
    <HealthStack.Screen key={'FolderMessages'} name="FolderMessages" component={FolderMessages} options={{ title: t('secureMessaging.folders') }} />,
    <HealthStack.Screen key={'ViewMessage'} name="ViewMessageScreen" component={ViewMessageScreen} options={{ title: t('secureMessaging.viewMessage.title') }} />,
    <HealthStack.Screen key={'ComposeMessage'} name="ComposeMessage" component={ComposeMessage} options={{ title: t('secureMessaging.composeMessage.compose') }} />,
    <HealthStack.Screen key={'ReplyMessage'} name="ReplyMessage" component={ReplyMessage} options={{ title: t('secureMessaging.reply') }} />,
    <HealthStack.Screen key={'EditDraft'} name="EditDraft" component={EditDraft} options={{ title: t('secureMessaging.drafts.edit') }} />,
    <HealthStack.Screen key={'Attachments'} name="Attachments" component={Attachments} options={{ title: t('secureMessaging.attachments') }} />,
    <HealthStack.Screen key={'AttachmentsFAQ'} name="AttachmentsFAQ" component={AttachmentsFAQ} />,
    <HealthStack.Screen key={'ReplyTriageErrorScreen'} name="ReplyTriageErrorScreen" component={ReplyTriageErrorScreen} options={{ title: t('secureMessaging.reply') }} />,
    <HealthStack.Screen key={'VaccineList'} name="VaccineList" component={VaccineListScreen} options={{ title: t('vaVaccines.title') }} />,
    <HealthStack.Screen key={'VaccineDetails'} name="VaccineDetails" component={VaccineDetailsScreen} options={{ title: t('vaccines.details.title') }} />,

    <HealthStack.Screen
      key={'NoRequestAppointmentAccess'}
      name="NoRequestAppointmentAccess"
      component={NoRequestAppointmentAccess}
      options={{ title: t('appointments.appointments') }}
    />,
    <HealthStack.Group
      key={'ModalsScreens'}
      screenOptions={{
        presentation: 'modal',
        ...TransitionPresets.ModalTransition,
        headerShown: true,
      }}>
      <HealthStack.Screen
        key={'GeneralHelpScreen'}
        name="GeneralHelpScreen"
        component={GeneralHelpScreen}
        options={{
          title: t('requestAppointments.generalHelpPageTitle'),
        }}
      />
      <HealthStack.Screen
        key={'SubTypeHelpScreen'}
        name="SubTypeHelpScreen"
        component={SubTypeHelpScreen}
        options={{
          title: t('requestAppointment.modalNeedHelpChoosingLinkTitle'),
        }}
      />
      <HealthStack.Screen
        key={'TypeOfCareNotListedHelpScreen'}
        name="TypeOfCareNotListedHelpScreen"
        component={TypeOfCareNotListedHelpScreen}
        options={{
          title: t('requestAppointment.typeOfCareNotListedModalTitle'),
        }}
      />
      <HealthStack.Screen
        key={'RequestAppointmentScreen'}
        name="RequestAppointmentScreen"
        component={RequestAppointmentScreen}
        options={{ ...TransitionPresets.SlideFromRightIOS }}
      />
    </HealthStack.Group>,
    <HealthStack.Screen key={'PrescriptionHistory'} name="PrescriptionHistory" component={PrescriptionHistory} options={{ title: t('prescription.history.title') }} />,
    <HealthStack.Screen key={'PrescriptionDetails'} name="PrescriptionDetails" component={PrescriptionDetails} options={{ title: t('prescription.details.title') }} />,
    <HealthStack.Screen
      key={'RefillScreenModal'}
      name="RefillScreenModal"
      component={RefillScreenModal}
      options={{ headerShown: false, presentation: 'modal', ...TransitionPresets.ModalTransition }}
    />,
    <HealthStack.Screen
      key={'RefillTrackingModal'}
      name="RefillTrackingModal"
      component={RefillTrackingModal}
      options={{ presentation: 'modal', ...TransitionPresets.ModalTransition, title: t('prescriptions.refillTracking.pageHeaderTitle') }}
    />,
    <HealthStack.Screen
      key={'PrescriptionHelp'}
      name="PrescriptionHelp"
      component={PrescriptionHelp}
      options={{ presentation: 'modal', ...TransitionPresets.ModalTransition, title: t('prescription.help.title') }}
    />,
    <HealthStack.Screen
      key={'StatusGlossary'}
      name="StatusGlossary"
      component={StatusGlossary}
      options={{
        title: t('statusGlossary.title'),
        presentation: 'modal',
        ...TransitionPresets.ModalTransition,
      }}
    />,
  ]
}
