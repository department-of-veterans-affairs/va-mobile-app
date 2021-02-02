import * as api from '../api'
import { ActionDef } from './index'
import { AddressValidationData } from '../api'

/**
 * Redux payload for PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER action
 */
export type PersonalInformationFinishEditPhoneNumberPayload = {}

/**
 * Redux payload for PERSONAL_INFORMATION_START_SAVE_PHONE_NUMBER action
 */
export type PersonalInformationStartSavePhoneNumPayload = {}

/**
 *  Redux payload for PERSONAL_INFORMATION_FINISH_SAVE_PHONE_NUMBER action
 */
export type PersonalInformationPayload = {
  error?: Error
}

/**
 * Redux payload for PERSONAL_INFORMATION_FINISH_EDIT_EMAIL action
 */
export type PersonalInformationFinishEditEmailPayload = {}

/**
 * Redux payload for PERSONAL_INFORMATION_START_SAVE_EMAIL action
 */
export type PersonalInformationStartSaveEmailPayload = {}

/**
 * Redux payload for PERSONAL_INFORMATION_FINISH_SAVE_EMAIL action
 */
export type PersonalInformationFinishSaveEmailPayload = {
  error?: Error
}

/**
 * Redux payload for PERSONAL_INFORMATION_START_GET_INFO action
 */
export type PersonalInformationStartGetInfoPayload = {}

/**
 * Redux payload for PERSONAL_INFORMATION_FINISH_GET_INFO action
 */
export type PersonalInformationFinishGetInfoPayload = {
  profile?: api.UserDataProfile
  error?: Error
}

/**
 * Redux payload for PERSONAL_INFORMATION_FINISH_EDIT_ADDRESS action
 */
export type PersonalInformationFinishEditAddressPayload = {}

/**
 * Redux payload for PERSONAL_INFORMATION_START_SAVE_ADDRESS action
 */
export type PersonalInformationStartSaveAddressPayload = {}

/**
 * Redux payload for PERSONAL_INFORMATION_FINISH_SAVE_ADDRESS action
 */
export type PersonalInformationFinishSaveAddressPayload = {
  addressValidationData?: AddressValidationData
  error?: Error
}

export interface PersonalInformationActions {
  /** Redux action to signify that editing the phone number has started */
  PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER: ActionDef<'PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER', PersonalInformationFinishEditPhoneNumberPayload>
  /** Redux action to signify that the save phone number request has started */
  PERSONAL_INFORMATION_START_SAVE_PHONE_NUMBER: ActionDef<'PERSONAL_INFORMATION_START_SAVE_PHONE_NUMBER', PersonalInformationStartSavePhoneNumPayload>
  /** Redux action to signify that the save phone number request has finished */
  PERSONAL_INFORMATION_FINISH_SAVE_PHONE_NUMBER: ActionDef<'PERSONAL_INFORMATION_FINISH_SAVE_PHONE_NUMBER', PersonalInformationPayload>
  /** Redux action to signify that editing the email has finished */
  PERSONAL_INFORMATION_FINISH_EDIT_EMAIL: ActionDef<'PERSONAL_INFORMATION_FINISH_EDIT_EMAIL', PersonalInformationFinishEditEmailPayload>
  /** Redux action to signify that edit email request has started */
  PERSONAL_INFORMATION_START_SAVE_EMAIL: ActionDef<'PERSONAL_INFORMATION_START_SAVE_EMAIL', PersonalInformationStartSaveEmailPayload>
  /** Redux action to signify that edit email request has finished */
  PERSONAL_INFORMATION_FINISH_SAVE_EMAIL: ActionDef<'PERSONAL_INFORMATION_FINISH_SAVE_EMAIL', PersonalInformationFinishSaveEmailPayload>
  /** Redux action to signify that the get personal information request has started */
  PERSONAL_INFORMATION_START_GET_INFO: ActionDef<'PERSONAL_INFORMATION_START_GET_INFO', PersonalInformationStartGetInfoPayload>
  /** Redux action to signify that the get personal information request has finished */
  PERSONAL_INFORMATION_FINISH_GET_INFO: ActionDef<'PERSONAL_INFORMATION_FINISH_GET_INFO', PersonalInformationFinishGetInfoPayload>
  /** Redux action to signify that editing the address has ended */
  PERSONAL_INFORMATION_FINISH_EDIT_ADDRESS: ActionDef<'PERSONAL_INFORMATION_FINISH_EDIT_ADDRESS', PersonalInformationFinishEditAddressPayload>
  /** Redux action to signify that save address request has started */
  PERSONAL_INFORMATION_START_SAVE_ADDRESS: ActionDef<'PERSONAL_INFORMATION_START_SAVE_ADDRESS', PersonalInformationStartSaveAddressPayload>
  /** Redux action to signify that save address request has finished */
  PERSONAL_INFORMATION_FINISH_SAVE_ADDRESS: ActionDef<'PERSONAL_INFORMATION_FINISH_SAVE_ADDRESS', PersonalInformationFinishSaveAddressPayload>
}
