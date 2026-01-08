import { waitFor } from '@testing-library/react-native'

import { useTravelPayClaimDetails } from 'api/travelPay'
import { TravelPayClaimDetailData } from 'api/types'
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

let mockUseDowntime: jest.Mock
jest.mock('utils/hooks', () => {
  mockUseDowntime = jest.fn(() => false)
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useDowntime: mockUseDowntime,
  }
})

const mockClaimDetails: TravelPayClaimDetailData = {
  id: 'test-claim-id',
  type: 'travelPayClaimDetails',
  attributes: {
    id: 'test-claim-id',
    claimNumber: 'TC123456',
    claimName: 'Travel reimbursement',
    claimantFirstName: 'John',
    claimantMiddleName: 'Michael',
    claimantLastName: 'Doe',
    claimStatus: 'Pre approved for payment',
    appointmentDate: '2023-10-15T10:00:00.000Z',
    facilityName: 'Cheyenne VA Medical Center',
    totalCostRequested: 50.0,
    reimbursementAmount: 50.0,
    appointment: {
      id: 'appointment-id',
      appointmentSource: 'VAOS',
      appointmentDateTime: '2023-10-15T10:00:00.000Z',
      appointmentName: 'Primary Care Appointment',
      appointmentType: 'Primary Care',
      facilityId: '442',
      facilityName: 'Cheyenne VA Medical Center',
      serviceConnectedDisability: 0,
      currentStatus: 'BOOKED',
      appointmentStatus: 'CONFIRMED',
      externalAppointmentId: 'EXT-12345',
      associatedClaimId: 'test-claim-id',
      associatedClaimNumber: 'TC123456',
      isCompleted: true,
    },
    expenses: [
      {
        id: 'expense-1',
        expenseType: 'Mileage',
        name: 'Round trip mileage',
        dateIncurred: '2023-10-15T10:00:00.000Z',
        description: 'Travel from home to medical center',
        costRequested: 42.5,
        costSubmitted: 42.5,
      },
    ],
    documents: [
      {
        documentId: 'doc-1',
        filename: 'receipt.pdf',
        mimetype: 'application/pdf',
        createdon: '2023-10-15T10:00:00.000Z',
      },
    ],
    createdOn: '2023-10-16T09:00:00.000Z',
    modifiedOn: '2023-10-16T09:00:00.000Z',
  },
}

context('useTravelPayClaimDetails', () => {
  const claimId = 'test-claim-id'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getting travel pay claim details', () => {
    it('should fetch travel pay claim details when feature is enabled and return response', async () => {
      mockUseDowntime.mockReturnValue(false)

      const mockResponse = {
        data: mockClaimDetails,
      }

      when(get as jest.Mock)
        .calledWith(`/v0/travel-pay/claims/${claimId}`)
        .mockResolvedValueOnce(mockResponse)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPaySMOC')
        .mockReturnValue(true)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPayClaimDetails')
        .mockReturnValue(true)

      const { result } = renderQuery(() => useTravelPayClaimDetails(claimId))

      await waitFor(() => {
        expect(result.current.data).toBeDefined()
      })

      expect(get).toHaveBeenCalledWith(`/v0/travel-pay/claims/${claimId}`)
      expect(result.current.data).toEqual(mockResponse)
    })

    it('should not fetch when SMOC feature is disabled', () => {
      mockUseDowntime.mockReturnValue(false)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPaySMOC')
        .mockReturnValue(false)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPayClaimDetails')
        .mockReturnValue(true)

      renderQuery(() => useTravelPayClaimDetails(claimId))

      expect(get).not.toHaveBeenCalled()
    })

    it('should not fetch when claim details feature is disabled', () => {
      mockUseDowntime.mockReturnValue(false)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPaySMOC')
        .mockReturnValue(true)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPayClaimDetails')
        .mockReturnValue(false)

      renderQuery(() => useTravelPayClaimDetails(claimId))

      expect(get).not.toHaveBeenCalled()
    })

    it('should not fetch when claimId is empty', () => {
      mockUseDowntime.mockReturnValue(false)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPaySMOC')
        .mockReturnValue(true)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPayClaimDetails')
        .mockReturnValue(true)

      renderQuery(() => useTravelPayClaimDetails(''))

      expect(get).not.toHaveBeenCalled()
    })

    it('should not fetch when explicitly disabled', () => {
      mockUseDowntime.mockReturnValue(false)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPaySMOC')
        .mockReturnValue(true)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPayClaimDetails')
        .mockReturnValue(true)

      renderQuery(() => useTravelPayClaimDetails(claimId, { enabled: false }))

      expect(get).not.toHaveBeenCalled()
    })

    it('should handle API errors gracefully', async () => {
      mockUseDowntime.mockReturnValue(false)
      const errorMessage = 'API Error'

      when(get as jest.Mock)
        .calledWith(`/v0/travel-pay/claims/${claimId}`)
        .mockRejectedValueOnce(new Error(errorMessage))

      when(featureEnabled as jest.Mock)
        .calledWith('travelPaySMOC')
        .mockReturnValue(true)

      when(featureEnabled as jest.Mock)
        .calledWith('travelPayClaimDetails')
        .mockReturnValue(true)

      const { result } = renderQuery(() => useTravelPayClaimDetails(claimId))

      await waitFor(
        () => {
          expect(result.current.isError).toBe(true)
        },
        { timeout: 2000 },
      )

      expect(result.current.error).toBeTruthy()
      expect(get).toHaveBeenCalledWith(`/v0/travel-pay/claims/${claimId}`)
    })
  })
})
