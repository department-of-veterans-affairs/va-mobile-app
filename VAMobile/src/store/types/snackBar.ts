import { ActionDef } from './index'

/**
 * Redux payload for BOTTOM_OFFSET_UPDATE action
 */
export type UpdateBottomOffset = {
  bottomOffset: number
}

export interface SnackBarActions {
  /** Redux action to update bottom offset */
  BOTTOM_OFFSET_UPDATE: ActionDef<'BOTTOM_OFFSET_UPDATE', UpdateBottomOffset>
}
