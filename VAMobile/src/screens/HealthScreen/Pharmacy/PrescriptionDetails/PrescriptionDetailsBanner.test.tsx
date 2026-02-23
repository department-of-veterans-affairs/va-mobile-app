import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { PrescriptionData, RefillStatus } from 'api/types'
import PrescriptionsDetailsBanner from 'screens/HealthScreen/Pharmacy/PrescriptionDetails/PrescriptionsDetailsBanner'
import { context, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

context('PrescriptionsDetailsBanner', () => {
  const mockMigratingPrescriptions: PrescriptionData[] = [
    {
      id: '123',
      type: 'Prescription',
      attributes: {
        prescriptionName: 'ALLOPURINOL 100MG TAB',
        prescriptionNumber: '3636691',
        refillStatus: 'active' as RefillStatus,
        refillSubmitDate: '2021-09-08T18:28:22.000Z',
        refillDate: '2021-09-21T04:00:00.000Z',
        refillRemaining: 1,
        facilityName: 'SLC10 TEST LAB',
        facilityPhoneNumber: '(217) 636-6712',
        isRefillable: true,
        isTrackable: false,
        orderedDate: '2021-05-03T04:00:00.000Z',
        quantity: 30,
        expirationDate: '2022-05-04T04:00:00.000Z',
        dispensedDate: '2021-09-06T04:00:00.000Z',
        stationNumber: '979',
        instructions: 'TAKE ONE TABLET EVERY DAY',
      },
    },
    {
      id: '456',
      type: 'Prescription',
      attributes: {
        prescriptionName: 'AMLODIPINE BESYLATE 10MG TAB',
        prescriptionNumber: '3636711A',
        refillStatus: 'active' as RefillStatus,
        refillSubmitDate: '2022-06-14T19:24:36.000Z',
        refillDate: '2022-05-15T04:00:00.000Z',
        refillRemaining: 6,
        facilityName: 'SLC10 TEST LAB',
        facilityPhoneNumber: '(217) 636-6712',
        isRefillable: true,
        isTrackable: false,
        orderedDate: '2021-10-27T04:00:00.000Z',
        quantity: 15,
        expirationDate: '2022-10-28T04:00:00.000Z',
        dispensedDate: null,
        stationNumber: '979',
        instructions: 'TAKE ONE-HALF TABLET EVERY DAY',
      },
    },
  ]

  it('initializes correctly', () => {
    render(<PrescriptionsDetailsBanner />)
    expect(screen.getByText(t('prescription.details.banner.title'))).toBeTruthy()
  })

  it('should show expanded content', () => {
    render(<PrescriptionsDetailsBanner />)
    fireEvent.press(screen.getByText(t('prescription.details.banner.title')))
    expect(screen.getByText(`${t('prescription.details.banner.bullet1')} ${t('or')}`)).toBeTruthy()
    expect(screen.getByText(`${t('prescription.details.banner.bullet2')} ${t('or')}`)).toBeTruthy()
    expect(screen.getByText(`${t('prescription.details.banner.bullet3')} ${t('or')}`)).toBeTruthy()
    expect(screen.getByText(t('prescription.details.banner.bullet4'))).toBeTruthy()
    expect(screen.getByText(t('automatedPhoneSystem'))).toBeTruthy()
    expect(screen.getByText(displayedTextPhoneNumber(t('5418307563')))).toBeTruthy()
    expect(screen.getByText(t('contactVA.tty.displayText'))).toBeTruthy()
  })

  describe('variant prop', () => {
    it('should render with warning variant by default', () => {
      render(<PrescriptionsDetailsBanner />)
      expect(screen.getByText(t('prescription.details.banner.title'))).toBeTruthy()
    })

    it('should render with error variant when specified', () => {
      render(<PrescriptionsDetailsBanner variant="error" />)
      expect(screen.getByText(t('prescription.details.banner.title'))).toBeTruthy()
    })

    it('should render with info variant when specified', () => {
      render(<PrescriptionsDetailsBanner variant="info" />)
      expect(screen.getByText(t('prescription.details.banner.title'))).toBeTruthy()
    })
  })

  describe('phoneNumber prop', () => {
    it('should display default phone number when not provided', () => {
      render(<PrescriptionsDetailsBanner />)
      fireEvent.press(screen.getByText(t('prescription.details.banner.title')))
      expect(screen.getByText(displayedTextPhoneNumber(t('5418307563')))).toBeTruthy()
    })

    it('should display custom phone number when provided', () => {
      const customPhone = '8005551234'
      render(<PrescriptionsDetailsBanner phoneNumber={customPhone} />)
      fireEvent.press(screen.getByText(t('prescription.details.banner.title')))
      expect(screen.getByText(displayedTextPhoneNumber(customPhone))).toBeTruthy()
    })
  })

  describe('migratingPrescriptions prop', () => {
    it('should not display medication links when migratingPrescriptions is not provided', () => {
      render(<PrescriptionsDetailsBanner />)
      fireEvent.press(screen.getByText(t('prescription.details.banner.title')))
      expect(screen.queryByText('ALLOPURINOL 100MG TAB')).toBeFalsy()
    })

    it('should not display medication links when migratingPrescriptions is empty', () => {
      render(<PrescriptionsDetailsBanner migratingPrescriptions={[]} />)
      fireEvent.press(screen.getByText(t('prescription.details.banner.title')))
      expect(screen.queryByText('ALLOPURINOL 100MG TAB')).toBeFalsy()
    })

    it('should display medication links when migratingPrescriptions is provided', () => {
      render(<PrescriptionsDetailsBanner migratingPrescriptions={mockMigratingPrescriptions} />)
      fireEvent.press(screen.getByText(t('prescription.details.banner.title')))
      expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy()
      expect(screen.getByText('AMLODIPINE BESYLATE 10MG TAB')).toBeTruthy()
    })

    it('should display affected medications header when migratingPrescriptions is provided', () => {
      render(<PrescriptionsDetailsBanner migratingPrescriptions={mockMigratingPrescriptions} />)
      fireEvent.press(screen.getByText(t('prescription.details.banner.title')))
      expect(screen.getByText('Affected medications:')).toBeTruthy()
    })
  })
})
