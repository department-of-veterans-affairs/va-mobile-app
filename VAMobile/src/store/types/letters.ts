import { ActionDef } from './index'
import { LettersList } from '../api/types'

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

export interface LettersActions {
  /**
   * Redux action when starting the action to get the letters list
   */
  LETTERS_START_GET_LETTERS_LIST: ActionDef<'LETTERS_START_GET_LETTERS_LIST', LettersStartGetLettersListPayload>
  /**
   * Redux action when the action to get the letters list is complete
   */
  LETTERS_FINISH_GET_LETTERS_LIST: ActionDef<'LETTERS_FINISH_GET_LETTERS_LIST', LettersListPayload>
}
