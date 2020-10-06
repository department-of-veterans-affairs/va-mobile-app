import { AType, ActionBase } from './index'

/**
 *  Redux payload for {@link TabBarVisibleAction} action
 */
export type TabBarVisiblePayload = boolean

/**
 * Redux action to signify that tabBarVisible's value has been updated
 */
export type TabBarVisibleAction = ActionBase<'TAB_BAR_VISIBLE_UPDATE', TabBarVisiblePayload>

/**
 *  All tab bar actions
 */
export type TabBarActions = AType<TabBarVisibleAction>
