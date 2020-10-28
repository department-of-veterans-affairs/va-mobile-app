import { ActionDef } from './index'

/**
 *  Redux payload for ActionDef action
 */
export type TabBarVisiblePayload = boolean

/**
 *  All tab bar actions
 */
export interface TabBarActions {
  /** Redux action to signify that tabBarVisible's value has been updated */
  TAB_BAR_VISIBLE_UPDATE: ActionDef<'TAB_BAR_VISIBLE_UPDATE', TabBarVisiblePayload>
}
