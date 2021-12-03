import { PixelRatio } from 'react-native'
import createReducer from './createReducer'

export type AccessibilityState = {
  fontScale: number
  isVoiceOverTalkBackRunning: boolean
  isFocus: boolean
}

export const initialAccessibilityState = {
  fontScale: PixelRatio.getFontScale(),
  isVoiceOverTalkBackRunning: false,
  isFocus: true,
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
  UPDATE_ACCESSIBILITY_FOCUS: (state, { isFocus }) => {
    return {
      ...state,
      isFocus,
    }
  },
})
