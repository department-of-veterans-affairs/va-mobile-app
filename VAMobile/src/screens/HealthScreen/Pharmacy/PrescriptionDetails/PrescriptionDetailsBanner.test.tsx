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

  // ============================================================
  // Default behavior (flag OFF, no overrides)
  // ============================================================
  describe('default behavior (flag off)', () => {
    it('initializes correctly with default banner title', () => {
      render(<PrescriptionsDetailsBanner />)
      expect(screen.getByText(t('prescription.details.banner.title'))).toBeTruthy()
    })

    it('should show expanded content with bullets and phone number', () => {
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
  })

  // ============================================================
  // V2 behavior (flag ON, no overrides)
  // ============================================================
  describe('V2 behavior (flag on, no overrides)', () => {
    beforeEach(() => {
      when(featureEnabled).calledWith('mhvMedicationsOracleHealthCutover').mockReturnValue(true)
    })

    it('should show V2 title', () => {
      render(<PrescriptionsDetailsBanner />)
      expect(screen.getByText(t('prescription.details.banner.titleV2'))).toBeTruthy()
    })

    it('should show V2 short body when expanded', () => {
      render(<PrescriptionsDetailsBanner />)
      fireEvent.press(screen.getByText(t('prescription.details.banner.titleV2')))
      expect(screen.getByText(t('prescription.details.banner.bodyV2'))).toBeTruthy()
    })

    it('should NOT show default bullets', () => {
      render(<PrescriptionsDetailsBanner />)
      fireEvent.press(screen.getByText(t('prescription.details.banner.titleV2')))
      expect(screen.queryByText(`${t('prescription.details.banner.bullet1')} ${t('or')}`)).toBeFalsy()
    })
  })

  // ============================================================
  // variant prop
  // ============================================================
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

  // ============================================================
  // phoneNumber prop
  // ============================================================
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

  // ============================================================
  // Custom overrides with flag OFF (showDefaultContent=true by default)
  // When migratingPrescriptions are passed but showDefaultContent is not set to false,
  // BOTH default bullets AND migrating prescriptions render
  // ============================================================
  describe('migratingPrescriptions prop (flag off, showDefaultContent defaults to true)', () => {
    it('should not display medication links when migratingPrescriptions is not provided', () => {
      render(<PrescriptionsDetailsBanner />)
      fireEvent.press(screen.getByText(t('prescription.details.banner.title')))
      expect(screen.queryByText('ALLOPURINOL 100MG TAB')).toBeFalsy()
      expect(screen.queryByText(t('prescription.details.banner.migrating.affectedMedications'))).toBeFalsy()
    })

    it('should not display medication links when migratingPrescriptions is empty', () => {
      render(<PrescriptionsDetailsBanner migratingPrescriptions={[]} />)
      fireEvent.press(screen.getByText(t('prescription.details.banner.title')))
      expect(screen.queryByText('ALLOPURINOL 100MG TAB')).toBeFalsy()
      expect(screen.queryByText(t('prescription.details.banner.migrating.affectedMedications'))).toBeFalsy()
    })

    it('should display medication names alongside default content when migratingPrescriptions is provided', () => {
      render(<PrescriptionsDetailsBanner migratingPrescriptions={mockMigratingPrescriptions} />)
      fireEvent.press(screen.getByText(t('prescription.details.banner.title')))
      // Default content still shows because showDefaultContent defaults to true
      expect(screen.getByText(`${t('prescription.details.banner.bullet1')} ${t('or')}`)).toBeTruthy()
      // Migrating prescriptions also show
      expect(screen.getByText(t('prescription.details.banner.migrating.affectedMedications'))).toBeTruthy()
      expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy()
      expect(screen.getByText('AMLODIPINE BESYLATE 10MG TAB')).toBeTruthy()
    })
  })

  // ============================================================
  // Custom overrides with showDefaultContent=false (as used in production)
  // This matches how PrescriptionDetails.tsx and RefillScreen.tsx call the banner
  // ============================================================
  describe('migratingPrescriptions prop (showDefaultContent=false)', () => {
    it('should display only custom content without default bullets', () => {
      render(
        <PrescriptionsDetailsBanner
          migratingPrescriptions={mockMigratingPrescriptions}
          showDefaultContent={false}
          customHeaderText={t('prescription.details.banner.migrating.header')}
          customFooterText={t('prescription.details.banner.migrating.body')}
        />,
      )
      fireEvent.press(screen.getByText(t('prescription.details.banner.migrating.header')))
      // Default bullets should NOT show
      expect(screen.queryByText(`${t('prescription.details.banner.bullet1')} ${t('or')}`)).toBeFalsy()
      // Custom content should show
      expect(screen.getByText(t('prescription.details.banner.migrating.affectedMedications'))).toBeTruthy()
      expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy()
      expect(screen.getByText('AMLODIPINE BESYLATE 10MG TAB')).toBeTruthy()
      // Custom footer replaces default phone section
      expect(screen.getByText(t('prescription.details.banner.migrating.body'))).toBeTruthy()
      expect(screen.queryByText(t('automatedPhoneSystem'))).toBeFalsy()
    })
  })

  // ============================================================
  // Custom overrides with flag ON + overrides (hasOverrides = true, skips V2 early return)
  // ============================================================
  describe('custom overrides with flag ON', () => {
    beforeEach(() => {
      when(featureEnabled).calledWith('mhvMedicationsOracleHealthCutover').mockReturnValue(true)
    })

    it('should show custom content instead of V2 short body when overrides are provided', () => {
      render(
        <PrescriptionsDetailsBanner
          migratingPrescriptions={mockMigratingPrescriptions}
          showDefaultContent={false}
          customHeaderText={t('prescription.details.banner.migrating.header')}
          customFooterText={t('prescription.details.banner.migrating.body')}
        />,
      )
      fireEvent.press(screen.getByText(t('prescription.details.banner.migrating.header')))
      // V2 short body should NOT show because hasOverrides is true
      expect(screen.queryByText(t('prescription.details.banner.bodyV2'))).toBeFalsy()
      // Custom content should show
      expect(screen.getByText(t('prescription.details.banner.migrating.affectedMedications'))).toBeTruthy()
      expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy()
      expect(screen.getByText(t('prescription.details.banner.migrating.body'))).toBeTruthy()
    })

    it('should show custom body text when provided with showDefaultContent=false', () => {
      render(
        <PrescriptionsDetailsBanner
          showDefaultContent={false}
          customBodyText={t('prescription.details.banner.migrating.body')}
          customHeaderText={t('prescription.details.banner.migrating.header')}
        />,
      )
      fireEvent.press(screen.getByText(t('prescription.details.banner.migrating.header')))
      // V2 short body should NOT show
      expect(screen.queryByText(t('prescription.details.banner.bodyV2'))).toBeFalsy()
      // Custom body should show
      expect(screen.getByText(t('prescription.details.banner.migrating.body'))).toBeTruthy()
    })
  })

  // ============================================================
  // customHeaderText prop
  // ============================================================
  describe('customHeaderText prop', () => {
    it('should use customHeaderText when provided (flag off)', () => {
      render(
        <PrescriptionsDetailsBanner
          customHeaderText={t('prescription.details.banner.migrating.header')}
          showDefaultContent={false}
        />,
      )
      expect(screen.getByText(t('prescription.details.banner.migrating.header'))).toBeTruthy()
      expect(screen.queryByText(t('prescription.details.banner.title'))).toBeFalsy()
    })

    it('should use customHeaderText when provided (flag on)', () => {
      when(featureEnabled).calledWith('mhvMedicationsOracleHealthCutover').mockReturnValue(true)
      render(
        <PrescriptionsDetailsBanner
          customHeaderText={t('prescription.details.banner.migrating.header')}
          showDefaultContent={false}
        />,
      )
      expect(screen.getByText(t('prescription.details.banner.migrating.header'))).toBeTruthy()
      expect(screen.queryByText(t('prescription.details.banner.titleV2'))).toBeFalsy()
    })
  })

  // ============================================================
  // Integration with getMigratingPrescriptions utility
  // ============================================================
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

      render(
        <PrescriptionsDetailsBanner
          migratingPrescriptions={filteredPrescriptions}
          showDefaultContent={false}
          customHeaderText={t('prescription.details.banner.migrating.header')}
          customFooterText={t('prescription.details.banner.migrating.body')}
        />,
      )
      fireEvent.press(screen.getByText(t('prescription.details.banner.migrating.header')))

      expect(screen.getByText('ALLOPURINOL 100MG TAB')).toBeTruthy()
      expect(screen.getByText('AMLODIPINE BESYLATE 10MG TAB')).toBeTruthy()
      expect(screen.queryByText('NON-MIGRATING PRESCRIPTION')).toBeFalsy()
    })

    it('should not display medication section when getMigratingPrescriptions returns empty array', () => {
      const nonMigratingPrescriptions = [mockNonMigratingPrescription]
      const filteredPrescriptions = getMigratingPrescriptions(nonMigratingPrescriptions, mockMigratingFacilitiesList)

      render(
        <PrescriptionsDetailsBanner
          migratingPrescriptions={filteredPrescriptions}
          showDefaultContent={false}
          customHeaderText={t('prescription.details.banner.migrating.header')}
          customFooterText={t('prescription.details.banner.migrating.body')}
        />,
      )
      fireEvent.press(screen.getByText(t('prescription.details.banner.migrating.header')))

      expect(screen.queryByText('NON-MIGRATING PRESCRIPTION')).toBeFalsy()
      expect(screen.queryByText(t('prescription.details.banner.migrating.affectedMedications'))).toBeFalsy()
    })
  })
})
