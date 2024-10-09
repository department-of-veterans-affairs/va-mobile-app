import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { PrescriptionAttributeData, RefillStatusConstants } from 'api/types'
import { context, mockNavProps, render } from 'testUtils'

import PrescriptionDetails from './PrescriptionDetails'

context('PrescriptionDetails', () => {
  const initializeTestInstance = (mockAttributeData: Partial<PrescriptionAttributeData> = {}) => {
    const props = mockNavProps(undefined, undefined, {
      params: {
        prescription: {
          type: 'Prescription',
          id: '13650544',
          attributes: {
            refillStatus: RefillStatusConstants.ACTIVE,
            refillSubmitDate: '2022-10-28T04:00:00.000Z',
            refillDate: '2022-10-28T04:00:00.000Z',
            refillRemaining: 5,
            facilityName: 'DAYT29',
            facilityPhoneNumber: '(217) 636-6712',
            isRefillable: false,
            isTrackable: false,
            orderedDate: '2022-10-28T04:00:00.000Z',
            quantity: 10,
            expirationDate: '2022-10-28T04:00:00.000Z',
            prescriptionNumber: '2719536',
            prescriptionName: 'SOMATROPIN 5MG INJ (VI)',
            instructions: 'TAKE 1 TABLET WITH FOOD 3 TIMES A DAY',
            dispensedDate: '2022-10-28T04:00:00.000Z',
            stationNumber: '989',
            ...mockAttributeData,
          },
        },
      },
    })

    render(<PrescriptionDetails {...props} />)
  }

  describe('when showing prescription details data', () => {
    it('should show prescription fields', () => {
      initializeTestInstance()
      expect(screen.getByRole('header', { name: t('prescription.details.instructionsHeader') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.refillLeftHeader') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('fillDate') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.quantityHeader') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.expiresOnHeader') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.orderedOnHeader') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.vaFacilityHeader') })).toBeTruthy()
      expect(screen.getByRole('link', { name: '(217) 636-6712' })).toBeTruthy()
      expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
    })
  })

  describe('when there is no data provided', () => {
    it('should show None Noted for applicable properties', () => {
      initializeTestInstance({
        instructions: '',
        refillRemaining: undefined,
        quantity: undefined,
        refillDate: null,
        expirationDate: null,
        orderedDate: null,
        facilityName: '',
        prescriptionNumber: '',
      })
      expect(screen.getByRole('header', { name: 'SOMATROPIN 5MG INJ (VI)' })).toBeTruthy()
      expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} None noted`)).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.instructionsHeader') })).toBeTruthy()
      expect(screen.getAllByText('None noted')).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.refillLeftHeader') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('fillDate') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.quantityHeader') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.expiresOnHeader') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.orderedOnHeader') })).toBeTruthy()
      expect(screen.getByRole('header', { name: t('prescription.details.vaFacilityHeader') })).toBeTruthy()
    })
  })

  describe('Go to My VA Health button', () => {
    describe('when status is RefillStatusConstants.TRANSFERRED', () => {
      it('should display FooterButton', () => {
        initializeTestInstance({
          refillStatus: RefillStatusConstants.TRANSFERRED,
        })
        expect(screen.getByRole('button', { name: t('goToMyVAHealth') })).toBeTruthy()
      })
    })

    describe('when status is not RefillStatusConstants.TRANSFERRED', () => {
      it('should not display FooterButton', () => {
        initializeTestInstance()
        expect(screen.queryByRole('button', { name: t('goToMyVAHealth') })).toBeFalsy()
      })
    })
  })

  describe('RequestRefillButton', () => {
    describe('when isRefillable is true', () => {
      it('should display FooterButton', () => {
        initializeTestInstance({
          isRefillable: true,
        })
        expect(screen.getByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeTruthy()
      })
    })

    describe('when isRefillable is false', () => {
      it('should not display FooterButton', () => {
        initializeTestInstance()
        expect(screen.queryByRole('button', { name: t('prescriptions.refill.RequestRefillButtonTitle') })).toBeFalsy()
      })
    })
  })

  describe('PrescriptionDetailsBanner', () => {
    describe('when status is RefillStatusConstants.TRANSFERRED', () => {
      it('should display the PrescriptionsDetailsBanner', () => {
        initializeTestInstance({
          refillStatus: RefillStatusConstants.TRANSFERRED,
        })

        expect(screen.getByText(t('prescription.details.banner.title'))).toBeTruthy()
      })
    })

    describe('when status is not RefillStatusConstants.TRANSFERRED', () => {})
    it('should not display the PrescriptionsDetailsBanner', () => {
      initializeTestInstance()
      expect(screen.queryByText(t('prescription.details.banner.title'))).toBeFalsy()
    })
  })
})
