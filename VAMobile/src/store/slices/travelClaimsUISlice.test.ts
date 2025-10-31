import { TimeFrameTypeConstants } from 'constants/timeframes'
import {
  updateTravelClaimsFilter,
  updateTravelClaimsPage,
  updateTravelClaimsSortBy,
  updateTravelClaimsTimeFrame,
} from 'store/slices/travelClaimsUISlice'
import { context, realStore } from 'testUtils'
import { SortOption } from 'utils/travelPay'

context('travelClaimsUISlice', () => {
  describe('default state', () => {
    it('should have the correct initial state', async () => {
      const store = realStore()
      expect(store.getState().travelClaimsUI).toEqual({
        timeFrame: TimeFrameTypeConstants.PAST_THREE_MONTHS,
        claimsFilter: new Set(),
        claimsSortBy: SortOption.Recent,
        currentPage: 1,
      })
    })
  })

  describe('updateTravelClaimsTimeFrame', () => {
    it('should update the time frame', async () => {
      const store = realStore()
      await store.dispatch(updateTravelClaimsTimeFrame(TimeFrameTypeConstants.PAST_SIX_MONTHS))
      expect(store.getState().travelClaimsUI.timeFrame).toEqual(TimeFrameTypeConstants.PAST_SIX_MONTHS)
    })
  })

  describe('updateTravelClaimsFilter', () => {
    it('should update the claims filter', async () => {
      const store = realStore()
      await store.dispatch(updateTravelClaimsFilter(new Set(['filter1', 'filter2'])))
      expect(store.getState().travelClaimsUI.claimsFilter).toEqual(new Set(['filter1', 'filter2']))
    })
  })

  describe('updateTravelClaimsSortBy', () => {
    it('should update the claims sort order', async () => {
      const store = realStore()
      await store.dispatch(updateTravelClaimsSortBy(SortOption.Oldest))
      expect(store.getState().travelClaimsUI.claimsSortBy).toEqual(SortOption.Oldest)
    })
  })

  describe('updateTravelClaimsPage', () => {
    it('should update the current page number', async () => {
      const store = realStore()
      await store.dispatch(updateTravelClaimsPage(4))
      expect(store.getState().travelClaimsUI.currentPage).toEqual(4)
    })
  })
})
