import { Alert } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'
import remoteConfig from '@react-native-firebase/remote-config'

import { logNonFatalErrorToFirebase } from './analytics'
import { overrideRemote, setOverrideRemote } from './remoteConfig'

const WAYGATE_OVERRIDES_KEY = '@store_waygate_overrides'

export type Waygate = {
  // true means waygate is 'open' so no waygate display, false will display waygate.
  enabled: boolean
  // string choice for type of waygate to display: 'denyAccess' | 'allowFunction' | 'denyContent'
  type?: string
  // Title for Alertbox
  errorMsgTitle?: string
  // Body for Alertbox
  errorMsgBody?: string
  // V2 Body for Alertbox
  errorMsgBodyV2?: string
  // Alternative Phone Number for Alertbox
  errorPhoneNumber?: string
  // Whether to display the app update button
  appUpdateButton?: boolean
}

export type WaygateToggleType =
  | 'WG_Home'
  | 'WG_Profile'
  | 'WG_PersonalInformation'
  | 'WG_HowDoIUpdate'
  | 'WG_PreferredName'
  | 'WG_ContactInformation'
  | 'WG_HowWillYou'
  | 'WG_EditAddress'
  | 'WG_EditPhoneNumber'
  | 'WG_EditEmail'
  | 'WG_MilitaryInformation'
  | 'WG_IncorrectServiceInfo'
  | 'WG_Settings'
  | 'WG_AccountSecurity'
  | 'WG_NotificationsSettings'
  | 'WG_ContactVA'
  | 'WG_VeteransCrisisLine'
  | 'WG_VeteranStatus'
  | 'WG_Login'
  | 'WG_RemoteConfig'
  | 'WG_Developer'
  | 'WG_WaygateEdit'
  | 'WG_Health'
  | 'WG_Appointments'
  | 'WG_FolderMessages'
  | 'WG_PastAppointmentDetails'
  | 'WG_PrescriptionDetails'
  | 'WG_PrescriptionHistory'
  | 'WG_SecureMessaging'
  | 'WG_UpcomingAppointmentDetails'
  | 'WG_VaccineDetails'
  | 'WG_VaccineList'
  | 'WG_AllergyDetails'
  | 'WG_AllergyList'
  | 'WG_LabsAndTestsDetails'
  | 'WG_LabsAndTestsList'
  | 'WG_ViewMessage'
  | 'WG_PrepareForVideoVisit'
  | 'WG_StartNewMessage'
  | 'WG_ReplyMessage'
  | 'WG_EditDraft'
  | 'WG_Attachments'
  | 'WG_ReplyHelp'
  | 'WG_RefillRequestSummary'
  | 'WG_RefillScreenModal'
  | 'WG_RefillTrackingModal'
  | 'WG_PrescriptionHelp'
  | 'WG_StatusDefinition'
  | 'WG_SessionNotStarted'
  | 'WG_Payments'
  | 'WG_PaymentDetails'
  | 'WG_DirectDeposit'
  | 'WG_HowToUpdateDirectDeposit'
  | 'WG_PaymentHistory'
  | 'WG_PaymentIssue'
  | 'WG_PaymentMissing'
  | 'WG_EditDirectDeposit'
  | 'WG_Benefits'
  | 'WG_DisabilityRatings'
  | 'WG_ClaimsHistoryScreen'
  | 'WG_LettersOverview'
  | 'WG_LettersList'
  | 'WG_BenefitSummaryServiceVerificationLetter'
  | 'WG_ClaimLettersScreen'
  | 'WG_ClaimDetailsScreen'
  | 'WG_AppealDetailsScreen'
  | 'WG_ConsolidatedClaimsNote'
  | 'WG_WhatDoIDoIfDisagreement'
  | 'WG_FileRequest'
  | 'WG_FileRequestDetails'
  | 'WG_AskForClaimDecision'
  | 'WG_SubmitEvidence'
  | 'WG_SelectFile'
  | 'WG_TakePhotos'
  | 'WG_UploadFile'
  | 'WG_UploadOrAddPhotos'
  | 'WG_Claims'
  | 'WG_LoaGate'
  | 'WG_GenericLetter'
  | 'WG_Webview'
  | 'WG_InAppRecruitment'
  | 'WG_HealthHelp'

type WaygateToggleValues = {
  WG_Home: Waygate
  WG_Profile: Waygate
  WG_PersonalInformation: Waygate
  WG_HowDoIUpdate: Waygate
  WG_PreferredName: Waygate
  WG_ContactInformation: Waygate
  WG_HowWillYou: Waygate
  WG_EditAddress: Waygate
  WG_EditPhoneNumber: Waygate
  WG_EditEmail: Waygate
  WG_MilitaryInformation: Waygate
  WG_IncorrectServiceInfo: Waygate
  WG_Settings: Waygate
  WG_AccountSecurity: Waygate
  WG_NotificationsSettings: Waygate
  WG_ContactVA: Waygate
  WG_VeteransCrisisLine: Waygate
  WG_VeteranStatus: Waygate
  WG_Login: Waygate
  WG_RemoteConfig: Waygate
  WG_Developer: Waygate
  WG_WaygateEdit: Waygate
  WG_Health: Waygate
  WG_Appointments: Waygate
  WG_FolderMessages: Waygate
  WG_PastAppointmentDetails: Waygate
  WG_PrescriptionDetails: Waygate
  WG_PrescriptionHistory: Waygate
  WG_SecureMessaging: Waygate
  WG_UpcomingAppointmentDetails: Waygate
  WG_VaccineDetails: Waygate
  WG_VaccineList: Waygate
  WG_AllergyDetails: Waygate
  WG_AllergyList: Waygate
  WG_LabsAndTestsDetails: Waygate
  WG_LabsAndTestsList: Waygate
  WG_ViewMessage: Waygate
  WG_PrepareForVideoVisit: Waygate
  WG_SubmitEvidence: Waygate
  WG_StartNewMessage: Waygate
  WG_ReplyMessage: Waygate
  WG_EditDraft: Waygate
  WG_Attachments: Waygate
  WG_ReplyHelp: Waygate
  WG_RefillRequestSummary: Waygate
  WG_RefillScreenModal: Waygate
  WG_RefillTrackingModal: Waygate
  WG_PrescriptionHelp: Waygate
  WG_StatusDefinition: Waygate
  WG_SessionNotStarted: Waygate
  WG_Payments: Waygate
  WG_PaymentDetails: Waygate
  WG_DirectDeposit: Waygate
  WG_HowToUpdateDirectDeposit: Waygate
  WG_PaymentHistory: Waygate
  WG_PaymentIssue: Waygate
  WG_PaymentMissing: Waygate
  WG_EditDirectDeposit: Waygate
  WG_Benefits: Waygate
  WG_DisabilityRatings: Waygate
  WG_ClaimsHistoryScreen: Waygate
  WG_LettersOverview: Waygate
  WG_LettersList: Waygate
  WG_BenefitSummaryServiceVerificationLetter: Waygate
  WG_ClaimLettersScreen: Waygate
  WG_ClaimDetailsScreen: Waygate
  WG_AppealDetailsScreen: Waygate
  WG_ConsolidatedClaimsNote: Waygate
  WG_WhatDoIDoIfDisagreement: Waygate
  WG_FileRequest: Waygate
  WG_FileRequestDetails: Waygate
  WG_AskForClaimDecision: Waygate
  WG_SelectFile: Waygate
  WG_TakePhotos: Waygate
  WG_UploadFile: Waygate
  WG_UploadOrAddPhotos: Waygate
  WG_Claims: Waygate
  WG_LoaGate: Waygate
  WG_GenericLetter: Waygate
  WG_Webview: Waygate
  WG_InAppRecruitment: Waygate
  WG_HealthHelp: Waygate
}

const waygateDefault: Waygate = {
  enabled: true,
  type: undefined,
  errorMsgTitle: undefined,
  errorMsgBody: undefined,
  appUpdateButton: false,
}

export let waygateConfig: WaygateToggleValues = {
  WG_Home: { ...waygateDefault },
  WG_Profile: { ...waygateDefault },
  WG_PersonalInformation: { ...waygateDefault },
  WG_HowDoIUpdate: { ...waygateDefault },
  WG_PreferredName: { ...waygateDefault },
  WG_ContactInformation: { ...waygateDefault },
  WG_HowWillYou: { ...waygateDefault },
  WG_EditAddress: { ...waygateDefault },
  WG_EditPhoneNumber: { ...waygateDefault },
  WG_EditEmail: { ...waygateDefault },
  WG_MilitaryInformation: { ...waygateDefault },
  WG_IncorrectServiceInfo: { ...waygateDefault },
  WG_Settings: { ...waygateDefault },
  WG_AccountSecurity: { ...waygateDefault },
  WG_NotificationsSettings: { ...waygateDefault },
  WG_ContactVA: { ...waygateDefault },
  WG_VeteransCrisisLine: { ...waygateDefault },
  WG_VeteranStatus: { ...waygateDefault },
  WG_Login: { ...waygateDefault },
  WG_RemoteConfig: { ...waygateDefault },
  WG_Developer: { ...waygateDefault },
  WG_WaygateEdit: { ...waygateDefault },
  WG_Health: { ...waygateDefault },
  WG_Appointments: { ...waygateDefault },
  WG_FolderMessages: { ...waygateDefault },
  WG_PastAppointmentDetails: { ...waygateDefault },
  WG_PrescriptionDetails: { ...waygateDefault },
  WG_PrescriptionHistory: { ...waygateDefault },
  WG_SecureMessaging: { ...waygateDefault },
  WG_UpcomingAppointmentDetails: { ...waygateDefault },
  WG_VaccineDetails: { ...waygateDefault },
  WG_VaccineList: { ...waygateDefault },
  WG_AllergyDetails: { ...waygateDefault },
  WG_AllergyList: { ...waygateDefault },
  WG_LabsAndTestsDetails: { ...waygateDefault },
  WG_LabsAndTestsList: { ...waygateDefault },
  WG_ViewMessage: { ...waygateDefault },
  WG_PrepareForVideoVisit: { ...waygateDefault },
  WG_StartNewMessage: { ...waygateDefault },
  WG_ReplyMessage: { ...waygateDefault },
  WG_EditDraft: { ...waygateDefault },
  WG_Attachments: { ...waygateDefault },
  WG_ReplyHelp: { ...waygateDefault },
  WG_RefillRequestSummary: { ...waygateDefault },
  WG_RefillScreenModal: { ...waygateDefault },
  WG_RefillTrackingModal: { ...waygateDefault },
  WG_PrescriptionHelp: { ...waygateDefault },
  WG_StatusDefinition: { ...waygateDefault },
  WG_SessionNotStarted: { ...waygateDefault },
  WG_Payments: { ...waygateDefault },
  WG_PaymentDetails: { ...waygateDefault },
  WG_DirectDeposit: { ...waygateDefault },
  WG_HowToUpdateDirectDeposit: { ...waygateDefault },
  WG_PaymentHistory: { ...waygateDefault },
  WG_PaymentIssue: { ...waygateDefault },
  WG_PaymentMissing: { ...waygateDefault },
  WG_EditDirectDeposit: { ...waygateDefault },
  WG_Benefits: { ...waygateDefault },
  WG_DisabilityRatings: { ...waygateDefault },
  WG_ClaimsHistoryScreen: { ...waygateDefault },
  WG_LettersOverview: { ...waygateDefault },
  WG_LettersList: { ...waygateDefault },
  WG_BenefitSummaryServiceVerificationLetter: { ...waygateDefault },
  WG_ClaimLettersScreen: { ...waygateDefault },
  WG_ClaimDetailsScreen: { ...waygateDefault },
  WG_AppealDetailsScreen: { ...waygateDefault },
  WG_ConsolidatedClaimsNote: { ...waygateDefault },
  WG_WhatDoIDoIfDisagreement: { ...waygateDefault },
  WG_SubmitEvidence: { ...waygateDefault },
  WG_FileRequest: { ...waygateDefault },
  WG_FileRequestDetails: { ...waygateDefault },
  WG_AskForClaimDecision: { ...waygateDefault },
  WG_SelectFile: { ...waygateDefault },
  WG_TakePhotos: { ...waygateDefault },
  WG_UploadFile: { ...waygateDefault },
  WG_UploadOrAddPhotos: { ...waygateDefault },
  WG_Claims: { ...waygateDefault },
  WG_LoaGate: { ...waygateDefault },
  WG_GenericLetter: { ...waygateDefault },
  WG_Webview: { ...waygateDefault },
  WG_InAppRecruitment: { ...waygateDefault },
  WG_HealthHelp: { ...waygateDefault },
}

export const waygateEnabled = (feature: WaygateToggleType): Waygate => {
  if (overrideRemote) {
    return waygateConfig[feature] ? waygateConfig[feature] : { ...waygateDefault }
  } else {
    const waygate = remoteConfig().getValue(feature)?.asString()
    if (waygate) {
      return JSON.parse(waygate) as Waygate
    } else {
      return { ...waygateDefault }
    }
  }
}

export const loadWaygateOverrides = async (): Promise<void> => {
  try {
    const waygateOverrides = await AsyncStorage.getItem(WAYGATE_OVERRIDES_KEY)
    if (waygateOverrides) {
      setOverrideRemote(true)
      waygateConfig = JSON.parse(waygateOverrides) as WaygateToggleValues
    }
  } catch (err) {
    logNonFatalErrorToFirebase(err, 'loadOverrides: AsyncStorage error')
  }
}

/**
 *
 * @param feature-this is the waygateName that we are checking for
 * @returns false when a waygateNativeAlert is displayed and denies continued navigation
 */
export const waygateNativeAlert = (feature: WaygateToggleType): boolean => {
  const waygate = waygateEnabled(feature)
  if (waygate.enabled === false && waygate.type === 'DenyAccess' && waygate.errorMsgTitle) {
    Alert.alert(waygate.errorMsgTitle, waygate.errorMsgBody, [
      {
        text: 'OK',
        style: 'cancel',
      },
    ])
    return false
  }
  return true
}

export const setWaygateDebugConfig = async (config: WaygateToggleValues): Promise<void> => {
  setOverrideRemote(true)
  waygateConfig = config

  // Store overrides in AsyncStorage so they persist with app quits
  AsyncStorage.setItem(WAYGATE_OVERRIDES_KEY, JSON.stringify(config))
}

export const getWaygateToggles = (): WaygateToggleValues => {
  if (overrideRemote) {
    return waygateConfig
  }

  Object.keys(remoteConfig().getAll()).forEach((key) => {
    if (key.startsWith('WG')) {
      waygateConfig[key as WaygateToggleType] = JSON.parse(
        remoteConfig().getValue(key).asString(),
      ) as unknown as Waygate
    }
  })
  return waygateConfig
}

export const screenContentAllowed = (waygateToggle: WaygateToggleType) => {
  const waygate = waygateEnabled(waygateToggle)
  if (!waygate.enabled && waygate.type === 'DenyContent' && (waygate.errorMsgTitle || waygate.errorMsgBody)) {
    return false
  }
  return true
}
