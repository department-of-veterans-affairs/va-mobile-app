import { context, realStore } from 'testUtils'
import { updateTabBarVisible } from './tabBar'

context('tabBar', () => {
    describe('updateTabBarVisible', () => {
        it('should update the value of tabBarVisible', () => {
            const store = realStore()
            store.dispatch(updateTabBarVisible(false))

            expect(store.getState().tabBarVisible.tabBarVisible).toBeFalsy()
        })
    })
})
