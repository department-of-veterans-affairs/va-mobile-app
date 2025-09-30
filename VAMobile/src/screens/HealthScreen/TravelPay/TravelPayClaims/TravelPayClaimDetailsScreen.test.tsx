import React from 'react'
import 'react-native'

import { screen } from '@testing-library/react-native'

import { TravelPayClaimDetailData } from 'api/types'
import TravelPayClaimDetailsScreen from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimDetailsScreen'
import { context, mockNavProps, render } from 'testUtils'

const mockClaimDetails: TravelPayClaimDetailData = {
  id: 'test-claim-id',
  type: 'travelPayClaimDetails',
  attributes: {
    id: 'test-claim-id',
    claimNumber: 'TC123456',
    claimName: 'Travel Reimbursement Claim',
    claimantFirstName: 'Samantha',
    claimantMiddleName: 'Michelle',
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

let mockUseTravelPayClaimDetails: jest.Mock
jest.mock('api/travelPay', () => {
  mockUseTravelPayClaimDetails = jest.fn(() => ({
    data: {
      data: mockClaimDetails,
    },
    isFetching: false,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }))
  return {
    useTravelPayClaimDetails: mockUseTravelPayClaimDetails,
  }
})

context('TravelPayClaimDetailsScreen', () => {
  const initializeTestInstance = (claimId = 'test-claim-id') => {
    const props = mockNavProps(
      {},
      { addListener: jest.fn(), navigate: jest.fn(), goBack: jest.fn() },
      { params: { claimId } },
    )

    render(<TravelPayClaimDetailsScreen {...props} />)
  }

  describe('when claim details load successfully', () => {
    it('should display claim details', async () => {
      mockUseTravelPayClaimDetails.mockImplementation(() => ({
        data: {
          data: mockClaimDetails,
        },
        isFetching: false,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      }))

      initializeTestInstance()

      expect(await screen.findByText(/TC123456/)).toBeTruthy()
      expect(screen.getByText(/Travel Reimbursement Claim/)).toBeTruthy()
      expect(screen.getByText(/Pre approved for payment/)).toBeTruthy()
      expect(screen.getByText(/Samantha.*Michelle.*Doe/)).toBeTruthy()
      expect(screen.getByText(/Cheyenne VA Medical Center/)).toBeTruthy()
      expect(screen.getByText(/Primary Care/)).toBeTruthy()
      expect(screen.getByText(/CONFIRMED/)).toBeTruthy()
      expect(screen.getByText(/Total Requested.*50\.00/)).toBeTruthy()
      expect(screen.getByText(/Reimbursement Amount.*50\.00/)).toBeTruthy()
      expect(screen.getByText(/Round trip mileage.*Mileage/)).toBeTruthy()
      expect(screen.getByText(/Travel from home to medical center/)).toBeTruthy()
      expect(screen.getByText(/Requested.*42\.50.*Submitted.*42\.50/)).toBeTruthy()
      expect(screen.getByText(/Documents.*1/)).toBeTruthy()
      expect(screen.getByText(/receipt\.pdf/)).toBeTruthy()
    })
  })

  describe('when claim details are loading', () => {
    it('should display loading indicator', async () => {
      mockUseTravelPayClaimDetails.mockImplementation(() => ({
        data: undefined,
        isFetching: true,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      }))

      initializeTestInstance()

      expect(await screen.findByText('Loading claim details...')).toBeTruthy()
    })
  })

  describe('when there is an API error', () => {
    it('should display error component', async () => {
      const error = new Error('Network error')
      mockUseTravelPayClaimDetails.mockImplementation(() => ({
        data: undefined,
        isFetching: false,
        isLoading: false,
        error: error,
        refetch: jest.fn(),
      }))

      initializeTestInstance()

      expect(await screen.findByText("The VA mobile app isn't working right now")).toBeTruthy()
      expect(screen.getByText("We're sorry. Something went wrong on our end. Try again later.")).toBeTruthy()
      expect(
        screen.getByText("If the app still doesn't work, call our MyVA411 main information line. We're here 24/7."),
      ).toBeTruthy()
      expect(screen.getByTestId('CallVATestID')).toBeTruthy()
    })
  })

  describe('when claim details are not found', () => {
    it('should display no data message', async () => {
      mockUseTravelPayClaimDetails.mockImplementation(() => ({
        data: {
          data: null,
        },
        isFetching: false,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
      }))

      initializeTestInstance()

      expect(await screen.findByText('No claim details found.')).toBeTruthy()
    })
  })
})
