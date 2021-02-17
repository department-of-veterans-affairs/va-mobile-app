import { PixelRatio } from 'react-native'
import createReducer from './createReducer'

export type AccessibilityState = {
  fontScale: number
}

export const initialAccessibilityState = {
  fontScale: PixelRatio.getFontScale(),
}

export default createReducer<AccessibilityState>(initialAccessibilityState, {
  FONT_SCALE_UPDATE: (state, { fontScale }) => {
    return {
      ...state,
      fontScale,
    }
  },
})
