import * as api from '../api'
import { ActionDef } from './index'

/**
 * Redux payload for PERSONAL_INFORMATION_START_EDIT_PHONE_NUMBER action
 */
export type PersonalInformationStartEditPhoneNumPayload = {}

/**
 *  Redux payload for PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER action
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

export interface PersonalInformationActions {
  /** Redux action to signify that the edit phone number request has started */
  PERSONAL_INFORMATION_START_EDIT_PHONE_NUMBER: ActionDef<'PERSONAL_INFORMATION_START_EDIT_PHONE_NUMBER', PersonalInformationStartEditPhoneNumPayload>
  /** Redux action to signify that the edit phone number request has finished */
  PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER: ActionDef<'PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER', PersonalInformationPayload>
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
}
