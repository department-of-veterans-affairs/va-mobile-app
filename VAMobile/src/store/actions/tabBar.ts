import { TabBarVisibleAction } from 'store/types'

export const updateTabBarVisible = (tabBarVisible: boolean): TabBarVisibleAction => {
  return {
    type: 'TAB_BAR_VISIBLE_UPDATE',
    payload: tabBarVisible,
  }
}
