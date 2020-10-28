import { TabBarVisiblePayload } from '../types'
import createReducer from './createReducer'

export type TabBarState = {
  tabBarVisible: TabBarVisiblePayload
}

export const initialTabBarState: TabBarState = {
  tabBarVisible: true,
}

export default createReducer<TabBarState>(initialTabBarState, {
  TAB_BAR_VISIBLE_UPDATE: (_state, payload) => {
    return {
      ...initialTabBarState,
      tabBarVisible: payload,
    }
  },
})
