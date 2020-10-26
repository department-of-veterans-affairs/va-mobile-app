import { AType, ActionBase } from './index'

/**
 * Redux payload for {@link PersonalInformationStartEditPhoneNumAction} action
 */
export type PersonalInformationStartEditPhoneNumPayload = {}

/**
 * Redux action to signify the initial start of updating the user's phone number
 */
export type PersonalInformationStartEditPhoneNumAction = ActionBase<'PERSONAL_INFORMATION_START_EDIT_PHONE_NUMBER', PersonalInformationStartEditPhoneNumPayload>

/**
 *  Redux payload for {@link PersonalInformationFinishEditPhoneNumAction} action
 */
export type PersonalInformationPayload = {
  error?: Error
}

/**
 * Redux action to signify that the phone number has been edited
 */
export type PersonalInformationFinishEditPhoneNumAction = ActionBase<'PERSONAL_INFORMATION_FINISH_EDIT_PHONE_NUMBER', PersonalInformationPayload>

/**
 *  All personal information actions
 */
export type PersonalInformationActions = AType<PersonalInformationStartEditPhoneNumAction> | AType<PersonalInformationFinishEditPhoneNumAction>
