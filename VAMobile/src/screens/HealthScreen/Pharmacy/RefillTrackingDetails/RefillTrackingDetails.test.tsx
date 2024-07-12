import React from 'react'

import { screen } from '@testing-library/react-native'
import { when } from 'jest-when'

import { PrescriptionData } from 'api/types'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor } from 'testUtils'
import {
  emptyStatePrescriptionList as emptyMockData,
  emptyStateTrackingInfoList as emptyTrackingMockData,
  defaultPrescriptionsList as mockData,
  multipleTrackingInfoList as multipleTrackingInfoData,
} from 'utils/tests/prescription'

import RefillTrackingDetails from './RefillTrackingDetails'

context('RefillTrackingDetails', () => {
  const initializeTestInstance = (paramPrescription?: PrescriptionData) => {
    const props = mockNavProps(
      {},
      {
        setOptions: jest.fn(),
        navigate: jest.fn(),
        addListener: jest.fn(),
      },
      { params: { prescription: paramPrescription ? paramPrescription : mockData[0] } },
    )
    render(<RefillTrackingDetails {...props} />)
  }

  describe('when there is no data provided', () => {
    it('should show None Noted for applicable properties', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
        .mockResolvedValue({ data: emptyTrackingMockData })
      initializeTestInstance(emptyMockData[0] as PrescriptionData)
      await waitFor(() => expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Rx #: None noted')).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByText(
            "We share tracking information here for up to 15 days, even if you've received your prescription.",
          ),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByText('Tracking number')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('None noted')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Delivery service: None noted')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Date shipped: None noted')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Other prescriptions in this package:')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('There are no other prescriptions in this package.')).toBeTruthy())
    })
  })

  describe('when there are one tracking for a prescription', () => {
    it('should show tracking information', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
        .mockResolvedValue({ data: [multipleTrackingInfoData[0]] })
      initializeTestInstance(mockData[0] as PrescriptionData)
      await waitFor(() => expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Rx #: 3636691')).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByText(
            "We share tracking information here for up to 15 days, even if you've received your prescription.",
          ),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByText('Tracking number')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('7534533636856')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Delivery service: DHL')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Date shipped: 06/14/2022')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Other prescriptions in this package:')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('LAMIVUDINE 10MG TAB')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Rx #: 2336800')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('ZIDOVUDINE 1MG CAP')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Rx #: None noted')).toBeTruthy())
    })
  })

  describe('when there are multiple tracking for a prescription', () => {
    it('should show information for each tracking with "x of total" header ', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
        .mockResolvedValue({ data: multipleTrackingInfoData })
      initializeTestInstance(mockData[0] as PrescriptionData)

      await waitFor(() => expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Rx #: 3636691')).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByText(
            "We share tracking information here for up to 15 days, even if you've received your prescription.",
          ),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByText('Package 1 of 2')).toBeTruthy())
      await waitFor(() => expect(screen.getAllByText('Tracking number')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('7534533636856')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Delivery service: DHL')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Date shipped: 06/14/2022')).toBeTruthy())
      await waitFor(() => expect(screen.getAllByText('Other prescriptions in this package:')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('LAMIVUDINE 10MG TAB')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Rx #: 2336800')).toBeTruthy())
      await waitFor(() => expect(screen.getAllByText('ZIDOVUDINE 1MG CAP')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Rx #: None noted')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Package 2 of 2')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('5634533636812')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Delivery service: USPS')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Date shipped: 06/28/2022')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('AMLODIPINE BESYLATE 10MG TAB')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Rx #: 3636711A')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Rx #: 4636722C')).toBeTruthy())
    })
  })

  describe('when there is an error', () => {
    it('should show PRESCRIPTION_TRACKING_DETAILS_SCREEN_ID error', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
        .mockRejectedValue({ networkError: 500 })

      initializeTestInstance()
      await waitFor(() => expect(screen.getByText("The app can't be loaded.")).toBeTruthy())
    })
  })
})
