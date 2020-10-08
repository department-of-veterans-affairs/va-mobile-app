import { context, realStore } from 'testUtils'
import { getProfileData } from './profile'

context('profile', () => {
    describe('getProfileData', () => {
        it('should get the profile data', () => {
            const store = realStore()
            store.dispatch(getProfileData())

            expect(store.getState().profile.profileData).toEqual({
                name: 'Jerry M Brooks',
                mostRecentBranch: 'United States Air Force',
            })
        })
    })
})
