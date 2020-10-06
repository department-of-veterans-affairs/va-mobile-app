import { TabBarVisiblePayload } from 'store/types'
import createReducer from './createReducer'

export type TabBarState = {
	tabBarVisible: boolean
}

const initialState: TabBarState = {
	tabBarVisible: true,
}

export default createReducer<TabBarState>(initialState, {
	TAB_BAR_VISIBLE_UPDATE: (_state: TabBarState, payload: TabBarVisiblePayload): TabBarState => {
		return {
			...initialState,
			tabBarVisible: payload,
		}
	},
})
