import { AType, ActionBase } from './index'

// TAB_BAR_VISIBLE_UPDATE
export type TabBarVisiblePayload = boolean
export type TabBarVisibleAction = ActionBase<'TAB_BAR_VISIBLE_UPDATE', TabBarVisiblePayload>

// ALL ACTIONS
export type TabBarActions = AType<TabBarVisibleAction>
