import React from 'react'

import { screen } from '@testing-library/react-native'

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
      expect(screen.getByText('Instructions')).toBeTruthy()
      expect(screen.getByText('Refills left')).toBeTruthy()
      expect(screen.getByText('Fill date')).toBeTruthy()
      expect(screen.getByText('Quantity')).toBeTruthy()
      expect(screen.getByText('Expires on')).toBeTruthy()
      expect(screen.getByText('Ordered on')).toBeTruthy()
      expect(screen.getByText('VA facility')).toBeTruthy()

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
      expect(screen.getByText('Rx #: None noted')).toBeTruthy()
      expect(screen.getByText('Instructions')).toBeTruthy()
      expect(screen.getAllByText('None noted')).toBeTruthy()
      expect(screen.getByText('Refills left')).toBeTruthy()
      expect(screen.getByText('Fill date')).toBeTruthy()
      expect(screen.getByText('Quantity')).toBeTruthy()
      expect(screen.getByText('Expires on')).toBeTruthy()
      expect(screen.getByText('Ordered on')).toBeTruthy()
      expect(screen.getByText('VA facility')).toBeTruthy()
    })
  })

  describe('Go to My VA Health button', () => {
    describe('when status is RefillStatusConstants.TRANSFERRED', () => {
      it('should display FooterButton', () => {
        initializeTestInstance({
          refillStatus: RefillStatusConstants.TRANSFERRED,
        })
        expect(screen.getByRole('button', { name: 'Go to My VA Health' })).toBeTruthy()
      })
    })

    describe('when status is not RefillStatusConstants.TRANSFERRED', () => {
      it('should not display FooterButton', () => {
        initializeTestInstance()
        expect(screen.queryByRole('button', { name: 'Go to My VA Health' })).toBeFalsy()
      })
    })
  })

  describe('RequestRefillButton', () => {
    describe('when isRefillable is true', () => {
      it('should display FooterButton', () => {
        initializeTestInstance({
          isRefillable: true,
        })
        expect(screen.getByRole('button', { name: 'Request refill' })).toBeTruthy()
      })
    })

    describe('when isRefillable is false', () => {
      it('should not display FooterButton', () => {
        initializeTestInstance()
        expect(screen.queryByRole('button', { name: 'Request refill' })).toBeFalsy()
      })
    })
  })

  describe('PrescriptionDetailsBanner', () => {
    describe('when status is RefillStatusConstants.TRANSFERRED', () => {
      it('should display the PrescriptionsDetailsBanner', () => {
        initializeTestInstance({
          refillStatus: RefillStatusConstants.TRANSFERRED,
        })

        expect(screen.getByText("We can't refill this prescription in the app")).toBeTruthy()
      })
    })

    describe('when status is not RefillStatusConstants.TRANSFERRED', () => {})
    it('should not display the PrescriptionsDetailsBanner', () => {
      initializeTestInstance()
      expect(screen.queryByText("We can't refill this prescription in the app")).toBeFalsy()
    })
  })
})
