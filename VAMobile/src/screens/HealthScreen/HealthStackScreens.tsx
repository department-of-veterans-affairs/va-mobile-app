import React from 'react'
import { ImagePickerResponse } from 'react-native-image-picker'

import { createStackNavigator } from '@react-navigation/stack'

import {
  Allergy,
  AppointmentData,
  PrescriptionData,
  RefillRequestSummaryItems,
  RefillStatus,
  SecureMessagingFormData,
  Vaccine,
} from 'api/types'
import { FULLSCREEN_SUBTASK_OPTIONS, LARGE_PANEL_OPTIONS } from 'constants/screens'
import { FormHeaderType } from 'constants/secureMessaging'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { WebviewStackParams } from 'screens/WebviewScreen/WebviewScreen'

import PrepareForVideoVisit from './Appointments/UpcomingAppointments/PrepareForVideoVisit/PrepareForVideoVisit'
import SessionNotStarted from './Appointments/UpcomingAppointments/SessionNotStarted'
import HealthHelp from './HealthHelp/HealthHelp'
import PrescriptionHelp from './Pharmacy/PrescriptionHelp/PrescriptionHelp'
import RefillRequestSummary from './Pharmacy/RefillScreens/RefillRequestSummary'
import RefillScreenModal from './Pharmacy/RefillScreens/RefillScreen'
import RefillTrackingModal from './Pharmacy/RefillTrackingDetails/RefillTrackingDetails'
import StatusDefinition from './Pharmacy/StatusDefinition/StatusDefinition'
import EditDraft from './SecureMessaging/EditDraft/EditDraft'
import ReplyHelp from './SecureMessaging/ReplyHelp/ReplyHelp'
import ReplyMessage from './SecureMessaging/ReplyMessage/ReplyMessage'
import Attachments from './SecureMessaging/StartNewMessage/Attachments/Attachments'
import StartNewMessage from './SecureMessaging/StartNewMessage/StartNewMessage'
import SubmitMileageTravelPayScreen from './TravelPay'
import BeneficiaryTravelAgreement from './TravelPay/SubmitTravelPayFlowSteps/BeneficiaryTravelAgreement'
import BurdenStatement from './TravelPay/SubmitTravelPayFlowSteps/BurdenStatement'
import TravelClaimHelp from './TravelPay/SubmitTravelPayFlowSteps/TravelClaimHelpScreen'

export type HealthStackParamList = WebviewStackParams & {
  Health: undefined
  MedicalRecordsList: undefined
  Appointments: undefined
  UpcomingAppointmentDetails: {
    appointment?: AppointmentData
    vetextID?: string
  }
  PrepareForVideoVisit: undefined
  PastAppointmentDetails: {
    appointment: AppointmentData
  }
  AppointmentCancellationConfirmation: {
    cancelID: string
    appointmentID: string
  }
  SubmitTravelPayClaimScreen: {
    appointmentDateTime: string
    facilityName: string
  }
  BurdenStatementScreen: undefined
  BeneficiaryTravelAgreementScreen: undefined
  TravelClaimHelpScreen: undefined
  Messages: undefined
  SecureMessaging: {
    activeTab: number
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
  ViewMessage: {
    messageID: number
    folderID?: number
    currentPage?: number
  }
  StartNewMessage: {
    attachmentFileToAdd?: ImagePickerResponse | DocumentPickerResponse
    attachmentFileToRemove?: ImagePickerResponse | DocumentPickerResponse
    saveDraftConfirmFailed?: boolean
  }
  ReplyMessage: {
    messageID: number
    attachmentFileToAdd: ImagePickerResponse | DocumentPickerResponse
    attachmentFileToRemove: ImagePickerResponse | DocumentPickerResponse
    saveDraftConfirmFailed?: boolean
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
  RemoveAttachment: {
    origin: FormHeaderType
    attachmentFileToRemove: ImagePickerResponse | DocumentPickerResponse
    messageID?: number
  }
  ReplyHelp: undefined
  SendConfirmation: {
    originHeader: string
    messageData: SecureMessagingFormData
    uploads?: (ImagePickerResponse | DocumentPickerResponse)[]
    replyToID?: number
  }
  SuccessfulSendScreen: undefined
  VaccineList: undefined
  VaccineDetails: {
    vaccine: Vaccine
  }
  AllergyList: undefined
  AllergyDetails: {
    allergy: Allergy
  }
  GeneralHelpScreen: {
    title: string
    description: string
  }
  SubTypeHelpScreen: {
    careTypeId: string
  }
  TypeOfCareNotListedHelpScreen: undefined
  PrescriptionHistory: {
    startingFilter?: RefillStatus
  }
  PrescriptionDetails: {
    prescription: PrescriptionData
  }
  RefillRequestSummary: {
    refillRequestSummaryItems: RefillRequestSummaryItems
  }
  RefillScreenModal: {
    refillRequestSummaryItems?: RefillRequestSummaryItems
  }
  RefillTrackingModal: {
    prescription: PrescriptionData
  }
  StatusDefinition: {
    display: string
    value: RefillStatus
  }
  PrescriptionHelp: undefined
  SessionNotStarted: undefined
  HealthHelp: undefined
}

const HealthStack = createStackNavigator<HealthStackParamList>()

export const getHealthScreens = () => {
  return [
    <HealthStack.Screen
      key={'PrepareForVideoVisit'}
      name="PrepareForVideoVisit"
      component={PrepareForVideoVisit}
      options={LARGE_PANEL_OPTIONS}
    />,
    <HealthStack.Screen
      key={'StartNewMessage'}
      name="StartNewMessage"
      component={StartNewMessage}
      options={FULLSCREEN_SUBTASK_OPTIONS}
    />,
    <HealthStack.Screen
      key={'ReplyMessage'}
      name="ReplyMessage"
      component={ReplyMessage}
      options={FULLSCREEN_SUBTASK_OPTIONS}
    />,
    <HealthStack.Screen
      key={'EditDraft'}
      name="EditDraft"
      component={EditDraft}
      options={FULLSCREEN_SUBTASK_OPTIONS}
    />,
    <HealthStack.Screen
      key={'Attachments'}
      name="Attachments"
      component={Attachments}
      options={FULLSCREEN_SUBTASK_OPTIONS}
    />,
    <HealthStack.Screen key={'ReplyHelp'} name="ReplyHelp" component={ReplyHelp} options={LARGE_PANEL_OPTIONS} />,
    <HealthStack.Screen
      key={'RefillRequestSummary'}
      name="RefillRequestSummary"
      component={RefillRequestSummary}
      options={FULLSCREEN_SUBTASK_OPTIONS}
    />,
    <HealthStack.Screen
      key={'RefillScreenModal'}
      name="RefillScreenModal"
      component={RefillScreenModal}
      options={FULLSCREEN_SUBTASK_OPTIONS}
    />,
    <HealthStack.Screen
      key={'RefillTrackingModal'}
      name="RefillTrackingModal"
      component={RefillTrackingModal}
      options={FULLSCREEN_SUBTASK_OPTIONS}
    />,
    <HealthStack.Screen
      key={'PrescriptionHelp'}
      name="PrescriptionHelp"
      component={PrescriptionHelp}
      options={LARGE_PANEL_OPTIONS}
    />,
    <HealthStack.Screen
      key={'StatusDefinition'}
      name="StatusDefinition"
      component={StatusDefinition}
      options={LARGE_PANEL_OPTIONS}
    />,
    <HealthStack.Screen
      key={'SessionNotStarted'}
      name="SessionNotStarted"
      component={SessionNotStarted}
      options={LARGE_PANEL_OPTIONS}
    />,
    <HealthStack.Screen
      key={'SubmitTravelPayClaimScreen'}
      name="SubmitTravelPayClaimScreen"
      component={SubmitMileageTravelPayScreen}
      options={FULLSCREEN_SUBTASK_OPTIONS}
    />,
    <HealthStack.Screen
      key={'TravelClaimHelpScreen'}
      name="TravelClaimHelpScreen"
      component={TravelClaimHelp}
      options={LARGE_PANEL_OPTIONS}
    />,
    <HealthStack.Screen
      key={'BurdenStatementScreen'}
      name="BurdenStatementScreen"
      component={BurdenStatement}
      options={LARGE_PANEL_OPTIONS}
    />,
    <HealthStack.Screen
      key={'BeneficiaryTravelAgreementScreen'}
      name="BeneficiaryTravelAgreementScreen"
      component={BeneficiaryTravelAgreement}
      options={LARGE_PANEL_OPTIONS}
    />,
    <HealthStack.Screen key={'HealthHelp'} name="HealthHelp" component={HealthHelp} options={LARGE_PANEL_OPTIONS} />,
  ]
}
