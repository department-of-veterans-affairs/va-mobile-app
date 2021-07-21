import { PixelRatio } from 'react-native'
import createReducer from './createReducer'

export type AccessibilityState = {
  fontScale: number
  isVoiceOverTalkBackRunning: boolean
}

export const initialAccessibilityState = {
  fontScale: PixelRatio.getFontScale(),
  isVoiceOverTalkBackRunning: false,
}

export default createReducer<AccessibilityState>(initialAccessibilityState, {
  FONT_SCALE_UPDATE: (state, { fontScale }) => {
    return {
      ...state,
      fontScale,
    }
  },
  IS_VOICE_OVER_TALK_BACK_RUNNING_UPDATE: (state, { isVoiceOverTalkBackRunning }) => {
    return {
      ...state,
      isVoiceOverTalkBackRunning,
    }
  },
})
