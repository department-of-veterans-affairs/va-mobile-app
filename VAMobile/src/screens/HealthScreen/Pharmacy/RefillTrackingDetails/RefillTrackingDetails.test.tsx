import React from 'react'
import { screen } from '@testing-library/react-native'
import { DateTime } from 'luxon'
import { when } from 'jest-when'

import { render, context, waitFor, mockNavProps } from 'testUtils'
import * as api from 'store/api'
import RefillTrackingDetails from './RefillTrackingDetails'
import { ErrorsState, initialErrorsState } from 'store/slices'
import { RootState } from 'store'
import {
  defaultPrescriptionsList as mockData,
  emptyStatePrescriptionList as emptyMockData,
  emptyStateTrackingInfoList as emptyTrackingMockData,
  multipleTrackingInfoList as multipleTrackingInfoData,
} from 'utils/tests/prescription'
import { PrescriptionData } from 'store/api'

context('RefillTrackingDetails', () => {
  const initializeTestInstance = (errorState?: Partial<ErrorsState>, paramPrescription?: PrescriptionData) => {
    const props = mockNavProps(
      {},
      {
        setOptions: jest.fn(),
        navigate: jest.fn(),
        addListener: jest.fn(),
      },
      { params: { prescription: paramPrescription ? paramPrescription : mockData[0] } },
    )
    const store: Partial<RootState> = {
      errors: {
        ...initialErrorsState,
        ...errorState,
      },
    }

    render(<RefillTrackingDetails {...props} />, { preloadedState: store })
  }

  describe('when there is no data provided', () => {
    it('should show None Noted for applicable properties', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
        .mockResolvedValue({ data: emptyTrackingMockData })

      await waitFor(() => {
        initializeTestInstance(undefined, emptyMockData[0] as PrescriptionData)
      })
      expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy()
      expect(screen.getByText('Rx #: None noted')).toBeTruthy()
      expect(screen.getByText("We share tracking information here for up to 15 days, even if you've received your prescription.")).toBeTruthy()
      expect(screen.getByText('Tracking number')).toBeTruthy()
      expect(screen.getByText('None noted')).toBeTruthy()
      expect(screen.getByText('Delivery service: None noted')).toBeTruthy()
      expect(screen.getByText('Date shipped: None noted')).toBeTruthy()
      expect(screen.getByText('Other prescriptions in this package:')).toBeTruthy()
      expect(screen.getByText('There are no other prescriptions in this package.')).toBeTruthy()
    })
  })

  describe('when there are one tracking for a prescription', () => {
    it('should show tracking information', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
        .mockResolvedValue({ data: [multipleTrackingInfoData[0]] })

      await waitFor(() => {
        initializeTestInstance(undefined, mockData[0] as PrescriptionData)
      })
      expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy()
      expect(screen.getByText('Rx #: 3636691')).toBeTruthy()
      expect(screen.getByText("We share tracking information here for up to 15 days, even if you've received your prescription.")).toBeTruthy()
      expect(screen.getByText('Tracking number')).toBeTruthy()
      expect(screen.getByText('7534533636856')).toBeTruthy()
      expect(screen.getByText('Delivery service: DHL')).toBeTruthy()
      expect(screen.getByText('Date shipped: 06/14/2022')).toBeTruthy()
      expect(screen.getByText('Other prescriptions in this package:')).toBeTruthy()
      expect(screen.getByText('LAMIVUDINE 10MG TAB')).toBeTruthy()
      expect(screen.getByText('Rx #: 2336800')).toBeTruthy()
      expect(screen.getByText('ZIDOVUDINE 1MG CAP')).toBeTruthy()
      expect(screen.getByText('Rx #: None noted')).toBeTruthy()
    })
  })

  describe('when there are multiple tracking for a prescription', () => {
    it('should show information for each tracking with "x of total" header ', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
        .mockResolvedValue({ data: multipleTrackingInfoData })

      await waitFor(() => {
        initializeTestInstance(undefined, mockData[0] as PrescriptionData)
      })
  
      expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy()
      expect(screen.getByText('Rx #: 3636691')).toBeTruthy()
      expect(screen.getByText("We share tracking information here for up to 15 days, even if you've received your prescription.")).toBeTruthy()
      expect(screen.getByText('Package 1 of 2')).toBeTruthy()
      expect(screen.getAllByText('Tracking number')).toBeTruthy()
      expect(screen.getByText('7534533636856')).toBeTruthy()
      expect(screen.getByText('Delivery service: DHL')).toBeTruthy()
      expect(screen.getByText('Date shipped: 06/14/2022')).toBeTruthy()
      expect(screen.getAllByText('Other prescriptions in this package:')).toBeTruthy()
      expect(screen.getByText('LAMIVUDINE 10MG TAB')).toBeTruthy()
      expect(screen.getByText('Rx #: 2336800')).toBeTruthy()
      expect(screen.getAllByText('ZIDOVUDINE 1MG CAP')).toBeTruthy()
      expect(screen.getByText('Rx #: None noted')).toBeTruthy()
      expect(screen.getByText('Package 2 of 2')).toBeTruthy()
      expect(screen.getByText('5634533636812')).toBeTruthy()
      expect(screen.getByText('Delivery service: USPS')).toBeTruthy()
      expect(screen.getByText('Date shipped: 06/28/2022')).toBeTruthy()
      expect(screen.getByText('AMLODIPINE BESYLATE 10MG TAB')).toBeTruthy()
      expect(screen.getByText('Rx #: 3636711A')).toBeTruthy()
      expect(screen.getByText('Rx #: 4636722C')).toBeTruthy()
    })
  })

  describe('when there is a downtime message for rx refill', () => {
    it('should show PRESCRIPTION_SCREEN downtime message', async () => {
      initializeTestInstance({
        downtimeWindowsByFeature: {
          rx_refill: {
            startTime: DateTime.now().plus({ days: -1 }),
            endTime: DateTime.now().plus({ days: 1 }),
          },
        },
      })

      expect(screen.getByText('Some online tools or services aren’t working right now')).toBeTruthy()
    })
  })

  describe('when there is an error', () => {
    it('should show PRESCRIPTION_TRACKING_DETAILS_SCREEN_ID error', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
        .mockRejectedValue({ networkError: 500 })
        
      await waitFor(() => {
        initializeTestInstance()
      })
      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })
  })
})
