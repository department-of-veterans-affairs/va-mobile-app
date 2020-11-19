import { ActionDef } from './index'
import { LetterBeneficiaryData, LettersList } from '../api/types'

/**
 * Redux payload for the LETTERS_START_GET_LETTERS_LIST action
 */
export type LettersStartGetLettersListPayload = {}

/**
 * Redux payload for the LETTERS_FINISH_GET_LETTERS_LIST action
 */
export type LettersListPayload = {
  letters?: LettersList
  error?: Error
}

/**
 * Redux payload for the LETTER_START_GET_BENEFICIARY_DATA action
 */
export type LetterStartGetBeneficiaryDataPayload = {}

/**
 * Redux payload for the LETTER_FINISH_GET_BENEFICIARY_DATA action
 */
export type LetterFinishGetBeneficiaryDataPayload = {
  letterBeneficiaryData?: LetterBeneficiaryData
  error?: Error
}

/**
 * Redux payload for the LETTER_START_DOWNLOAD_LETTER action
 */
export type LetterStartDownloadLetterPayload = {}

/**
 * Redux payload for the LETTER_FINISH_DOWNLOAD_LETTER action
 */
export type LetterFinishDownloadLetterPayload = {
  error?: Error
}

export interface LettersActions {
  /**
   * Redux action when starting the action to get the letters list
   */
  LETTERS_START_GET_LETTERS_LIST: ActionDef<'LETTERS_START_GET_LETTERS_LIST', LettersStartGetLettersListPayload>
  /**
   * Redux action when the action to get the letters list is complete
   */
  LETTERS_FINISH_GET_LETTERS_LIST: ActionDef<'LETTERS_FINISH_GET_LETTERS_LIST', LettersListPayload>
  /**
   * Redux action when starting the action to get the letters beneficiary information
   */
  LETTER_START_GET_BENEFICIARY_DATA: ActionDef<'LETTER_START_GET_BENEFICIARY_DATA', LetterStartGetBeneficiaryDataPayload>
  /**
   * Redux action when finishing the action to get the letters beneficiary information
   */
  LETTER_FINISH_GET_BENEFICIARY_DATA: ActionDef<'LETTER_FINISH_GET_BENEFICIARY_DATA', LetterFinishGetBeneficiaryDataPayload>
  /**
   * Redux action when starting the action to download a letter
   */
  LETTER_START_DOWNLOAD_LETTER: ActionDef<'LETTER_START_DOWNLOAD_LETTER', LetterStartDownloadLetterPayload>
  /**
   * Redux action when finishing the action to download a letter
   */
  LETTER_FINISH_DOWNLOAD_LETTER: ActionDef<'LETTER_FINISH_DOWNLOAD_LETTER', LetterFinishDownloadLetterPayload>
}
