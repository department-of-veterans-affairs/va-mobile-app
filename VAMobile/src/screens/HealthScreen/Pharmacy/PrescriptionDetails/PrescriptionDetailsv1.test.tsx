import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { PrescriptionsAttributeDataV1, RefillStatusConstants } from 'api/types'
import PrescriptionDetails from 'screens/HealthScreen/Pharmacy/PrescriptionDetails/PrescriptionDetails'
import { context, mockNavProps, render } from 'testUtils'

context('PrescriptionDetails', () => {
  const initializeTestInstance = (mockAttributeData: Partial<PrescriptionsAttributeDataV1> = {}) => {
    const props = mockNavProps(undefined, undefined, {
      params: {
        prescription: {
          id: '20848812135',
          type: 'Prescription',
          attributes: {
            type: 'Prescription',
            refillStatus: 'active',
            refillSubmitDate: null,
            refillDate: '2025-11-17T21:35:02.000Z',
            refillRemaining: 2,
            facilityName: 'Mann-Grandstaff Department of Veterans Affairs Medical Center',
            orderedDate: '2025-11-17T21:21:48Z',
            quantity: 18.0,
            expirationDate: '2026-11-17T07:59:59Z',
            prescriptionNumber: '20848812135',
            prescriptionName: 'albuterol (albuterol 90 mcg inhaler [18g])',
            dispensedDate: null,
            stationNumber: '668',
            isRefillable: false,
            isTrackable: false,
            tracking: [],
            prescriptionSource: 'VA',
            instructions:
              '2 Inhalation Inhalation (breathe in) every 4 hours as needed shortness of breath or wheezing.',
            facilityPhoneNumber: '(217) 636-6712',
            cmopDivisionPhone: null,
            cmopNdcNumber: null,
            remarks: null,
            dispStatus: 'Active',
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
      expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
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
      expect(screen.getByRole('header', { name: 'albuterol (albuterol 90 mcg inhaler [18g])' })).toBeTruthy()
      expect(screen.getByLabelText(`${t('prescription.rxNumber.a11yLabel')} None noted`)).toBeTruthy()
      expect(screen.getByText(`${t('prescription.details.instructionsNotAvailable')}`)).toBeTruthy()
      expect(screen.getAllByText(`${t('prescription.details.refillRemainingNotAvailable')}`)).toBeTruthy()
      expect(screen.getAllByText(`${t('prescription.details.expirationDateNotAvailable')}`)).toBeTruthy()
      expect(screen.getByText(`${t('prescription.details.facilityNameNotAvailable')}`)).toBeTruthy()
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
