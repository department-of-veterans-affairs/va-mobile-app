import { waitFor } from '@testing-library/react-native'

import { useClaim } from 'api/claimsAndAppeals/getClaim'
import { ClaimData } from 'api/types'
import { get } from 'store/api'
import { context, renderQuery, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

jest.mock('store/api', () => {
  const original = jest.requireActual('store/api')
  return {
    ...original,
    get: jest.fn(),
  }
})

jest.mock('utils/remoteConfig', () => ({
  featureEnabled: jest.fn(),
}))

const mockClaimData: ClaimData = {
  id: '123',
  type: 'claim',
  attributes: {
    dateFiled: '2019-06-06',
    minEstDate: null,
    maxEstDate: null,
    phaseChangeDate: null,
    open: true,
    waiverSubmitted: false,
    documentsNeeded: false,
    developmentLetterSent: false,
    decisionLetterSent: false,
    phase: 1,
    everPhaseBack: false,
    currentPhaseBack: false,
    requestedDecision: false,
    claimType: 'Compensation',
    claimTypeCode: '010LCOMP',
    displayTitle: 'Claim for disability compensation',
    updatedAt: '2020-12-07',
    contentionList: [],
    vaRepresentative: '',
    eventsTimeline: [],
    provider: 'lighthouse',
  },
}

context('getClaim', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('feature flag OFF', () => {
    beforeEach(() => {
      when(featureEnabled as jest.Mock)
        .calledWith('cstMultiClaimProvider')
        .mockReturnValue(false)
    })

    it('fetches without provider query param when flag is off and provider is given', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claim/123', {})
        .mockResolvedValueOnce({ data: mockClaimData })

      const { result } = renderQuery(() => useClaim('123', 'lighthouse'))
      await waitFor(() => expect(result.current.data).toEqual(mockClaimData))

      expect(get).toBeCalledWith('/v0/claim/123', {})
    })

    it('fetches without provider query param when flag is off and no provider', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claim/123', {})
        .mockResolvedValueOnce({ data: mockClaimData })

      const { result } = renderQuery(() => useClaim('123'))
      await waitFor(() => expect(result.current.data).toEqual(mockClaimData))

      expect(get).toBeCalledWith('/v0/claim/123', {})
    })
  })

  describe('feature flag ON', () => {
    beforeEach(() => {
      when(featureEnabled as jest.Mock)
        .calledWith('cstMultiClaimProvider')
        .mockReturnValue(true)
    })

    it('fetches with ?type=lighthouse when flag is on and provider is lighthouse', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claim/123?type=lighthouse', {})
        .mockResolvedValueOnce({ data: mockClaimData })

      const { result } = renderQuery(() => useClaim('123', 'lighthouse'))
      await waitFor(() => expect(result.current.data).toEqual(mockClaimData))

      expect(get).toBeCalledWith('/v0/claim/123?type=lighthouse', {})
    })

    it('fetches with ?type=champva when flag is on and provider is champva', async () => {
      const champvaClaimData = { ...mockClaimData, attributes: { ...mockClaimData.attributes, provider: 'champva' } }

      when(get as jest.Mock)
        .calledWith('/v0/claim/456?type=champva', {})
        .mockResolvedValueOnce({ data: champvaClaimData })

      const { result } = renderQuery(() => useClaim('456', 'champva'))
      await waitFor(() => expect(result.current.data).toEqual(champvaClaimData))

      expect(get).toBeCalledWith('/v0/claim/456?type=champva', {})
    })

    // Null provider uses the legacy URL (no type param) for backward compatibility
    it('fetches without type param when flag is on and provider is null', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claim/123', {})
        .mockResolvedValueOnce({ data: mockClaimData })

      const { result } = renderQuery(() => useClaim('123'))
      await waitFor(() => expect(result.current.data).toEqual(mockClaimData))

      expect(get).toBeCalledWith('/v0/claim/123', {})
    })
  })
})
