import { ActionDef } from './index'

/**
 * Redux payload for FONT_SCALE_UPDATE action
 */
export type UpdateFontScale = {
  fontScale: number
}

/**
 * Redux payload for IS_VOICE_OVER_TALK_BACK_RUNNING_UPDATE action
 */
export type UpdateIsVoiceOverTalkBackRunning = {
  isVoiceOverTalkBackRunning: boolean
}

export interface AccessibilityActions {
  /** Redux action to update font scale */
  FONT_SCALE_UPDATE: ActionDef<'FONT_SCALE_UPDATE', UpdateFontScale>
  /** Redux action to update variable signifying is voice over or talk back are currently running */
  IS_VOICE_OVER_TALK_BACK_RUNNING_UPDATE: ActionDef<'IS_VOICE_OVER_TALK_BACK_RUNNING_UPDATE', UpdateIsVoiceOverTalkBackRunning>
}
