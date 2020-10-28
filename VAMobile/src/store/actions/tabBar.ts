import { ReduxAction } from 'store/types'

export const updateTabBarVisible = (tabBarVisible: boolean): ReduxAction => {
  return {
    type: 'TAB_BAR_VISIBLE_UPDATE',
    payload: tabBarVisible,
  }
}
