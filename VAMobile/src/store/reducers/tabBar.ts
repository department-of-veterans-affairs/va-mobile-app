import { TabBarVisiblePayload } from '../types'
import createReducer from './createReducer'

export type TabBarState = {
	tabBarVisible: boolean
}

export const initialTabBarState: TabBarState = {
	tabBarVisible: true,
}

export default createReducer<TabBarState>(initialTabBarState, {
	TAB_BAR_VISIBLE_UPDATE: (_state: TabBarState, payload: TabBarVisiblePayload): TabBarState => {
		return {
			...initialTabBarState,
			tabBarVisible: payload,
		}
	},
})
