import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'
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
      await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} ${t('noneNoted')}`)).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByText(t('prescriptions.refillTracking.upTo15Days'))).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByRole('header', { name: t('prescriptions.refillTracking.trackingNumber') })).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByText(t('noneNoted'))).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByText(`${t('prescriptions.refillTracking.deliveryService')}: ${t('noneNoted')}`),
        ).toBeTruthy(),
      )
      await waitFor(() =>
        expect(screen.getByText(`${t('prescriptions.refillTracking.dateShipped')}: ${t('noneNoted')}`)).toBeTruthy(),
      )
      await waitFor(() =>
        expect(screen.getByText(`${t('prescriptions.refillTracking.otherPrescription')}:`)).toBeTruthy(),
      )
      await waitFor(() =>
        expect(screen.getByText(t('prescriptions.refillTracking.otherPrescription.none'))).toBeTruthy(),
      )
    })
  })

  describe('when there are one tracking for a prescription', () => {
    it('should show tracking information', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
        .mockResolvedValue({ data: [multipleTrackingInfoData[0]] })
      initializeTestInstance(mockData[0] as PrescriptionData)
      await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
      expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} 3 6 3 6 6 9 1`)).toBeTruthy()
      await waitFor(() => expect(screen.getByText(t('prescriptions.refillTracking.upTo15Days'))).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByRole('header', { name: t('prescriptions.refillTracking.trackingNumber') })).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByLabelText('7 5 3 4 5 3 3 6 3 6 8 5 6')).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByText(`${t('prescriptions.refillTracking.deliveryService')}: DHL`)).toBeTruthy(),
      )
      await waitFor(() =>
        expect(screen.getByLabelText(`${t('prescriptions.refillTracking.dateShipped')}: June 14, 2022`)).toBeTruthy(),
      )
      await waitFor(() =>
        expect(screen.getAllByText(`${t('prescriptions.refillTracking.otherPrescription')}:`)).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByText('LAMIVUDINE 10MG TAB')).toBeTruthy())
      expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} 2 3 3 6 8 0 0`)).toBeTruthy()
      await waitFor(() => expect(screen.getByText('ZIDOVUDINE 1MG CAP')).toBeTruthy())
      expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} ${t('noneNoted')}`)).toBeTruthy()
    })
  })

  describe('when there are multiple tracking for a prescription', () => {
    it('should show information for each tracking with "x of total" header ', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
        .mockResolvedValue({ data: multipleTrackingInfoData })
      initializeTestInstance(mockData[0] as PrescriptionData)

      await waitFor(() => expect(screen.getByRole('header', { name: 'ALLOPURINOL 100MG TAB' })).toBeTruthy())
      expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} 3 6 3 6 6 9 1`)).toBeTruthy()
      await waitFor(() => expect(screen.getByText(t('prescriptions.refillTracking.upTo15Days'))).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByRole('header', {
            name: `${t('package')} ${t('listPosition', { position: 1, total: 2 })}`,
          }),
        ).toBeTruthy(),
      )
      await waitFor(() =>
        expect(screen.getAllByRole('header', { name: t('prescriptions.refillTracking.trackingNumber') })).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByLabelText('7 5 3 4 5 3 3 6 3 6 8 5 6')).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByText(`${t('prescriptions.refillTracking.deliveryService')}: DHL`)).toBeTruthy(),
      )
      await waitFor(() =>
        expect(screen.getByLabelText(`${t('prescriptions.refillTracking.dateShipped')}: June 14, 2022`)).toBeTruthy(),
      )
      await waitFor(() =>
        expect(screen.getAllByText(`${t('prescriptions.refillTracking.otherPrescription')}:`)).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByText('LAMIVUDINE 10MG TAB')).toBeTruthy())
      expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} 2 3 3 6 8 0 0`)).toBeTruthy()
      await waitFor(() => expect(screen.getAllByText('ZIDOVUDINE 1MG CAP')).toBeTruthy())
      expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} None noted`)).toBeTruthy()
      await waitFor(() =>
        expect(
          screen.getByRole('header', {
            name: `${t('package')} ${t('listPosition', { position: 2, total: 2 })}`,
          }),
        ).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByLabelText('5 6 3 4 5 3 3 6 3 6 8 1 2')).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByText(`${t('prescriptions.refillTracking.deliveryService')}: USPS`)).toBeTruthy(),
      )
      await waitFor(() =>
        expect(screen.getByLabelText(`${t('prescriptions.refillTracking.dateShipped')}: June 28, 2022`)).toBeTruthy(),
      )
      await waitFor(() => expect(screen.getByText('AMLODIPINE BESYLATE 10MG TAB')).toBeTruthy())
      expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} 3 6 3 6 7 1 1 A`)).toBeTruthy()
      expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} 4 6 3 6 7 2 2 C`)).toBeTruthy()
    })
  })

  describe('when there is an error', () => {
    it('should show PRESCRIPTION_TRACKING_DETAILS_SCREEN_ID error', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
        .mockRejectedValue({ networkError: 500 })

      initializeTestInstance()
      await waitFor(() =>
        expect(screen.getByRole('header', { name: t('errors.networkConnection.header') })).toBeTruthy(),
      )
    })
  })
})
