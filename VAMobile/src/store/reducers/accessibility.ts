import { PixelRatio } from 'react-native'
import createReducer from './createReducer'

export type AccessibilityState = {
  fs: number
}

export const initialAccessibilityState = {
  fs: PixelRatio.getFontScale(),
}

export default createReducer<AccessibilityState>(initialAccessibilityState, {
  FONT_SCALE_UPDATE: (state, { fs }) => {
    return {
      ...state,
      fs,
    }
  },
})
