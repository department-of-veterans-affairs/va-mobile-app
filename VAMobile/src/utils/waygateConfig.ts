import { Alert } from 'react-native'
import { logNonFatalErrorToFirebase } from './analytics'
import { overrideRemote, setOverrideRemote } from './remoteConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'
import remoteConfig from '@react-native-firebase/remote-config'
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
  // Whether to display the app update button
  appUpdateButton?: boolean
}

export type WaygateToggleType =
  | 'WG_Home'
  | 'WG_Profile'
  | 'WG_PersonalInformation'
  | 'WG_HowDoIUpdate'
  | 'WG_PreferredName'
  | 'WG_GenderIdentity'
  | 'WG_WhatToKnow'
  | 'WG_ContactInformation'
  | 'WG_HowWillYou'
  | 'WG_EditAddress'
  | 'WG_EditPhoneNumber'
  | 'WG_EditEmail'
  | 'WG_MilitaryInformation'
  | 'WG_IncorrectServiceInfo'
  | 'WG_Settings'
  | 'WG_ManageYourAccount'
  | 'WG_NotificationsSettings'
  | 'WG_ContactVA'
  | 'WG_VeteransCrisisLine'
  | 'WG_VeteranStatus'
  | 'WG_Login'
  | 'WG_RemoteConfig'
  | 'WG_Developer'
  | 'WG_WaygateEdit'
  | 'WG_DisabilityRatings'
  | 'WG_Claims'
  | 'WG_ClaimsHistory'
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
  | 'WG_SelectFile'
  | 'WG_TakePhotos'
  | 'WG_UploadFile'
  | 'WG_UploadOrAddPhotos'

type WaygateToggleValues = {
  WG_Home: Waygate
  WG_Profile: Waygate
  WG_PersonalInformation: Waygate
  WG_HowDoIUpdate: Waygate
  WG_PreferredName: Waygate
  WG_GenderIdentity: Waygate
  WG_WhatToKnow: Waygate
  WG_ContactInformation: Waygate
  WG_HowWillYou: Waygate
  WG_EditAddress: Waygate
  WG_EditPhoneNumber: Waygate
  WG_EditEmail: Waygate
  WG_MilitaryInformation: Waygate
  WG_IncorrectServiceInfo: Waygate
  WG_Settings: Waygate
  WG_ManageYourAccount: Waygate
  WG_NotificationsSettings: Waygate
  WG_ContactVA: Waygate
  WG_VeteransCrisisLine: Waygate
  WG_VeteranStatus: Waygate
  WG_Login: Waygate
  WG_RemoteConfig: Waygate
  WG_Developer: Waygate
  WG_WaygateEdit: Waygate
  WG_DisabilityRatings: Waygate
  WG_Claims: Waygate
  WG_ClaimsHistory: Waygate
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
  WG_GenderIdentity: { ...waygateDefault },
  WG_WhatToKnow: { ...waygateDefault },
  WG_ContactInformation: { ...waygateDefault },
  WG_HowWillYou: { ...waygateDefault },
  WG_EditAddress: { ...waygateDefault },
  WG_EditPhoneNumber: { ...waygateDefault },
  WG_EditEmail: { ...waygateDefault },
  WG_MilitaryInformation: { ...waygateDefault },
  WG_IncorrectServiceInfo: { ...waygateDefault },
  WG_Settings: { ...waygateDefault },
  WG_ManageYourAccount: { ...waygateDefault },
  WG_NotificationsSettings: { ...waygateDefault },
  WG_ContactVA: { ...waygateDefault },
  WG_VeteransCrisisLine: { ...waygateDefault },
  WG_VeteranStatus: { ...waygateDefault },
  WG_Login: { ...waygateDefault },
  WG_RemoteConfig: { ...waygateDefault },
  WG_Developer: { ...waygateDefault },
  WG_WaygateEdit: { ...waygateDefault },
  WG_DisabilityRatings: { ...waygateDefault },
  WG_Claims: { ...waygateDefault },
  WG_ClaimsHistory: { ...waygateDefault },
  WG_LettersOverview: { ...waygateDefault },
  WG_LettersList: { ...waygateDefault },
  WG_BenefitSummaryServiceVerificationLetter: { ...waygateDefault },
  WG_ClaimLettersScreen: { ...waygateDefault },
  WG_ClaimDetailsScreen: { ...waygateDefault },
  WG_AppealDetailsScreen: { ...waygateDefault },
  WG_ConsolidatedClaimsNote: { ...waygateDefault },
  WG_WhatDoIDoIfDisagreement: { ...waygateDefault },
  WG_FileRequest: { ...waygateDefault },
  WG_FileRequestDetails: { ...waygateDefault },
  WG_AskForClaimDecision: { ...waygateDefault },
  WG_SelectFile: { ...waygateDefault },
  WG_TakePhotos: { ...waygateDefault },
  WG_UploadFile: { ...waygateDefault },
  WG_UploadOrAddPhotos: { ...waygateDefault },
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
      waygateConfig[key as WaygateToggleType] = JSON.parse(remoteConfig().getValue(key).asString()) as unknown as Waygate
    }
  })
  return waygateConfig
}
