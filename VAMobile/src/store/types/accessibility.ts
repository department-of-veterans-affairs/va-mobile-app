import { ActionDef } from './index'

/**
 * Redux payload for FONT_SCALE_UPDATE action
 */
export type UpdateFontScale = {
  fontScale: number
}

export interface AccessibilityActions {
  /** Redux action to update font scale */
  FONT_SCALE_UPDATE: ActionDef<'FONT_SCALE_UPDATE', UpdateFontScale>
}
