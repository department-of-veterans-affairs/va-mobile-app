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
 * Redux payload for PERSONAL_INFORMATION_START_EDIT_EMAIL action
 */
export type PersonalInformationStartEditEmailPayload = {}

/**
 * Redux payload for PERSONAL_INFORMATION_START_SAVE_EMAIL action
 */
export type PersonalInformationStartSaveEmailPayload = {}

/**
 * Redux payload for PERSONAL_INFORMATION_FINISH_EDIT_EMAIL action
 */
export type PersonalInformationFinishEditEmailPayload = {
  error?: Error
}

export interface PersonalInformationActions {
  /** Redux action to signify that the edit phone number request has started */
  PERSONAL_INFORMATION_START_EDIT_PHONE_NUMBER: ActionDef<'PERSONAL_INFORMATION_START_EDIT_PHONE_NUMBER', PersonalInformationStartEditPhoneNumPayload>
  /** Redux action to signify that the edit phone number request has finished */
  PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER: ActionDef<'PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER', PersonalInformationPayload>
  /** Redux action to signify that editing the email has started */
  PERSONAL_INFORMATION_START_EDIT_EMAIL: ActionDef<'PERSONAL_INFORMATION_START_EDIT_EMAIL', PersonalInformationStartEditEmailPayload>
  /** Redux action to signify that edit email request has started */
  PERSONAL_INFORMATION_START_SAVE_EMAIL: ActionDef<'PERSONAL_INFORMATION_START_SAVE_EMAIL', PersonalInformationStartSaveEmailPayload>
  /** Redux action to signify that edit email request has finished */
  PERSONAL_INFORMATION_FINISH_EDIT_EMAIL: ActionDef<'PERSONAL_INFORMATION_FINISH_EDIT_EMAIL', PersonalInformationFinishEditEmailPayload>
}
