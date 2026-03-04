import { waitFor } from '@testing-library/react-native'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useClaim } from 'api/claimsAndAppeals/getClaim'
import { ClaimData } from 'api/types'
import { get } from 'store/api'
import { context, renderQuery, when } from 'testUtils'

jest.mock('store/api', () => {
  const original = jest.requireActual('store/api')
  return {
    ...original,
    get: jest.fn(),
  }
})

jest.mock('api/authorizedServices/getAuthorizedServices', () => ({
  useAuthorizedServices: jest.fn(),
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

  describe('authorized services not yet loaded', () => {
    beforeEach(() => {
      when(useAuthorizedServices as jest.Mock).mockReturnValue({ data: undefined })
    })

    it('does not fetch when provider is given but authorized services has not resolved', async () => {
      renderQuery(() => useClaim('123', 'lighthouse'))

      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(get).not.toHaveBeenCalled()
    })

    it('fetches immediately when no provider is given regardless of authorized services', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claim/123', {})
        .mockResolvedValueOnce({ data: mockClaimData })

      const { result } = renderQuery(() => useClaim('123'))
      await waitFor(() => expect(result.current.data).toEqual(mockClaimData))

      expect(get).toHaveBeenCalledWith('/v0/claim/123', {})
    })
  })

  describe('cstMultiClaimProvider authorized service OFF', () => {
    beforeEach(() => {
      when(useAuthorizedServices as jest.Mock).mockReturnValue({ data: { cstMultiClaimProvider: false } })
    })

    it('fetches without provider query param when service is off and provider is given', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claim/123', {})
        .mockResolvedValueOnce({ data: mockClaimData })

      const { result } = renderQuery(() => useClaim('123', 'lighthouse'))
      await waitFor(() => expect(result.current.data).toEqual(mockClaimData))

      expect(get).toBeCalledWith('/v0/claim/123', {})
    })

    it('fetches without provider query param when service is off and no provider', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claim/123', {})
        .mockResolvedValueOnce({ data: mockClaimData })

      const { result } = renderQuery(() => useClaim('123'))
      await waitFor(() => expect(result.current.data).toEqual(mockClaimData))

      expect(get).toBeCalledWith('/v0/claim/123', {})
    })
  })

  describe('cstMultiClaimProvider authorized service ON', () => {
    beforeEach(() => {
      when(useAuthorizedServices as jest.Mock).mockReturnValue({ data: { cstMultiClaimProvider: true } })
    })

    it('fetches with ?type=lighthouse when service is on and provider is lighthouse', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claim/123?type=lighthouse', {})
        .mockResolvedValueOnce({ data: mockClaimData })

      const { result } = renderQuery(() => useClaim('123', 'lighthouse'))
      await waitFor(() => expect(result.current.data).toEqual(mockClaimData))

      expect(get).toBeCalledWith('/v0/claim/123?type=lighthouse', {})
    })

    // Null provider uses the legacy URL (no type param) for backward compatibility
    it('fetches without type param when service is on but provider is null', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claim/123', {})
        .mockResolvedValueOnce({ data: mockClaimData })

      const { result } = renderQuery(() => useClaim('123'))
      await waitFor(() => expect(result.current.data).toEqual(mockClaimData))

      expect(get).toBeCalledWith('/v0/claim/123', {})
    })
  })
})
