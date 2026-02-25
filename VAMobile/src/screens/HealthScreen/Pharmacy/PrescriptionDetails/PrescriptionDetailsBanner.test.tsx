import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { MigratingFacility, PrescriptionData, RefillStatus } from 'api/types'
import { getMigratingPrescriptions } from 'screens/HealthScreen/Pharmacy/PrescriptionCommon/prescriptionUtils'
import PrescriptionsDetailsBanner from 'screens/HealthScreen/Pharmacy/PrescriptionDetails/PrescriptionsDetailsBanner'
import { context, render, when } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { featureEnabled } from 'utils/remoteConfig'

jest.mock('utils/remoteConfig')

context('PrescriptionsDetailsBanner', () => {
  const mockMigratingFacilitiesList: MigratingFacility[] = [
    {
      migrationDate: '2026-05-01',
      facilities: [{ facilityId: 979, facilityName: 'SLC10 TEST LAB' }],
      phases: {
        current: 'p3',
        p0: 'March 1, 2026',
        p1: 'March 15, 2026',
        p2: 'April 1, 2026',
        p3: 'April 24, 2026',
        p4: 'April 27, 2026',
        p5: 'May 1, 2026',
        p6: 'May 3, 2026',
        p7: 'May 8, 2026',
      },
    },
  ]

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
        sortedDispensedDate: '2021-09-06T04:00:00.000Z',
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
        sortedDispensedDate: '2022-05-15T04:00:00.000Z',
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

  beforeEach(() => {
    when(featureEnabled).calledWith('mhvMedicationsOracleHealthCutover').mockReturnValue(false)
  })

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

  it('should show expanded content when mhvMedicationsOracleHealthCutover flag is enabled', () => {
    when(featureEnabled).calledWith('mhvMedicationsOracleHealthCutover').mockReturnValue(true)
    render(<PrescriptionsDetailsBanner />)
    fireEvent.press(screen.getByText(t('prescription.details.banner.titleV2')))
    expect(screen.getByText(`${t('prescription.details.banner.bodyV2')}`)).toBeTruthy()
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

  describe('integration with getMigratingPrescriptions utility', () => {
    const mockNonMigratingPrescription: PrescriptionData = {
      id: '789',
      type: 'Prescription',
      attributes: {
        prescriptionName: 'NON-MIGRATING PRESCRIPTION',
        prescriptionNumber: '9999999',
        refillStatus: 'active' as RefillStatus,
        refillSubmitDate: '2021-09-08T18:28:22.000Z',
        refillDate: '2021-09-21T04:00:00.000Z',
        sortedDispensedDate: '2021-09-06T04:00:00.000Z',
        refillRemaining: 1,
        facilityName: 'Other Facility',
        facilityPhoneNumber: '(555) 555-5555',
        isRefillable: true,
        isTrackable: false,
        orderedDate: '2021-05-03T04:00:00.000Z',
        quantity: 30,
        expirationDate: '2022-05-04T04:00:00.000Z',
        dispensedDate: '2021-09-06T04:00:00.000Z',
        stationNumber: '999',
        instructions: 'TAKE ONE TABLET EVERY DAY',
      },
    }

    it('should only display prescriptions filtered by getMigratingPrescriptions utility', () => {
      const allPrescriptions = [...mockMigratingPrescriptions, mockNonMigratingPrescription]
      const filteredPrescriptions = getMigratingPrescriptions(allPrescriptions, mockMigratingFacilitiesList)

      render(<PrescriptionsDetailsBanner migratingPrescriptions={filteredPrescriptions} />)
      fireEvent.press(screen.getByText(t('prescription.details.banner.title')))

      expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy()
      expect(screen.getByText('AMLODIPINE BESYLATE 10MG TAB')).toBeTruthy()
      expect(screen.queryByText('NON-MIGRATING PRESCRIPTION')).toBeFalsy()
    })

    it('should not display medication links when getMigratingPrescriptions returns empty array', () => {
      const nonMigratingPrescriptions = [mockNonMigratingPrescription]
      const filteredPrescriptions = getMigratingPrescriptions(nonMigratingPrescriptions, mockMigratingFacilitiesList)

      render(<PrescriptionsDetailsBanner migratingPrescriptions={filteredPrescriptions} />)
      fireEvent.press(screen.getByText(t('prescription.details.banner.title')))

      expect(screen.queryByText('NON-MIGRATING PRESCRIPTION')).toBeFalsy()
      expect(screen.queryByText('Affected medications:')).toBeFalsy()
    })
  })
})
