import { MigratingFacility, PrescriptionData, RefillStatus } from 'api/types'
import {
  getMigratingPrescriptions,
  isPrescriptionAtMigratingFacility,
} from 'screens/HealthScreen/Pharmacy/PrescriptionCommon/prescriptionUtils'

describe('prescriptionUtils', () => {
  const mockMigratingFacilitiesList: MigratingFacility[] = [
    {
      migrationDate: '2026-05-01',
      facilities: [
        { facilityId: 979, facilityName: 'SLC10 TEST LAB' },
        { facilityId: 123, facilityName: 'Another VA Medical Center' },
      ],
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

  const createMockPrescription = (stationNumber: string): PrescriptionData => ({
    id: '123',
    type: 'Prescription',
    attributes: {
      prescriptionName: 'Test Prescription',
      prescriptionNumber: '1234567',
      refillStatus: 'active' as RefillStatus,
      refillSubmitDate: '2021-09-08T18:28:22.000Z',
      refillDate: '2021-09-21T04:00:00.000Z',
      sortedDispensedDate: '2021-09-06T04:00:00.000Z',
      refillRemaining: 1,
      facilityName: 'Test Facility',
      facilityPhoneNumber: '(217) 636-6712',
      isRefillable: true,
      isTrackable: false,
      orderedDate: '2021-05-03T04:00:00.000Z',
      quantity: 30,
      expirationDate: '2022-05-04T04:00:00.000Z',
      dispensedDate: '2021-09-06T04:00:00.000Z',
      stationNumber,
      instructions: 'TAKE ONE TABLET EVERY DAY',
    },
  })

  describe('isPrescriptionAtMigratingFacility', () => {
    it('should return true when prescription station matches a migrating facility', () => {
      const prescription = createMockPrescription('979')
      expect(isPrescriptionAtMigratingFacility(prescription, mockMigratingFacilitiesList)).toBe(true)
    })

    it('should return true when prescription matches a different facility in the same migration', () => {
      const prescription = createMockPrescription('123')
      expect(isPrescriptionAtMigratingFacility(prescription, mockMigratingFacilitiesList)).toBe(true)
    })

    it('should return false when prescription station does not match any migrating facility', () => {
      const prescription = createMockPrescription('999')
      expect(isPrescriptionAtMigratingFacility(prescription, mockMigratingFacilitiesList)).toBe(false)
    })

    it('should return false when migratingFacilitiesList is undefined', () => {
      const prescription = createMockPrescription('979')
      expect(isPrescriptionAtMigratingFacility(prescription, undefined)).toBe(false)
    })

    it('should return false when migratingFacilitiesList is empty', () => {
      const prescription = createMockPrescription('979')
      expect(isPrescriptionAtMigratingFacility(prescription, [])).toBe(false)
    })

    it('should return false when prescription has no stationNumber', () => {
      const prescription = createMockPrescription('')
      expect(isPrescriptionAtMigratingFacility(prescription, mockMigratingFacilitiesList)).toBe(false)
    })

    it('should handle string to number comparison correctly', () => {
      // facilityId is a number (979), stationNumber is a string ('979')
      const prescription = createMockPrescription('979')
      expect(isPrescriptionAtMigratingFacility(prescription, mockMigratingFacilitiesList)).toBe(true)
    })

    it('should match across multiple migration entries', () => {
      const multipleMigrations: MigratingFacility[] = [
        {
          migrationDate: '2026-05-01',
          facilities: [{ facilityId: 111, facilityName: 'First Facility' }],
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
        {
          migrationDate: '2026-06-01',
          facilities: [{ facilityId: 222, facilityName: 'Second Facility' }],
          phases: {
            current: 'p0',
            p0: 'April 1, 2026',
            p1: 'April 15, 2026',
            p2: 'May 1, 2026',
            p3: 'May 24, 2026',
            p4: 'May 27, 2026',
            p5: 'June 1, 2026',
            p6: 'June 3, 2026',
            p7: 'June 8, 2026',
          },
        },
      ]
      const prescription = createMockPrescription('222')
      expect(isPrescriptionAtMigratingFacility(prescription, multipleMigrations)).toBe(true)
    })
  })

  describe('getMigratingPrescriptions', () => {
    it('should return prescriptions that are at migrating facilities', () => {
      const prescriptions = [createMockPrescription('979'), createMockPrescription('999')]
      const result = getMigratingPrescriptions(prescriptions, mockMigratingFacilitiesList)
      expect(result).toHaveLength(1)
      expect(result[0].attributes.stationNumber).toBe('979')
    })

    it('should return multiple matching prescriptions from different facilities', () => {
      const prescriptions = [createMockPrescription('979'), createMockPrescription('123')]
      const result = getMigratingPrescriptions(prescriptions, mockMigratingFacilitiesList)
      expect(result).toHaveLength(2)
      expect(result[0].attributes.stationNumber).toBe('979')
      expect(result[1].attributes.stationNumber).toBe('123')
    })

    it('should return empty array when no prescriptions match migrating facilities', () => {
      const prescriptions = [createMockPrescription('999'), createMockPrescription('888')]
      const result = getMigratingPrescriptions(prescriptions, mockMigratingFacilitiesList)
      expect(result).toHaveLength(0)
    })

    it('should return empty array when prescriptions array is empty', () => {
      const result = getMigratingPrescriptions([], mockMigratingFacilitiesList)
      expect(result).toHaveLength(0)
    })

    it('should return empty array when migratingFacilitiesList is undefined', () => {
      const prescriptions = [createMockPrescription('979')]
      const result = getMigratingPrescriptions(prescriptions, undefined)
      expect(result).toHaveLength(0)
    })

    it('should return empty array when migratingFacilitiesList is empty', () => {
      const prescriptions = [createMockPrescription('979')]
      const result = getMigratingPrescriptions(prescriptions, [])
      expect(result).toHaveLength(0)
    })

    it('should return all prescriptions when all are at migrating facilities', () => {
      const prescriptions = [createMockPrescription('979'), createMockPrescription('123')]
      const result = getMigratingPrescriptions(prescriptions, mockMigratingFacilitiesList)
      expect(result).toHaveLength(2)
    })

    it('should preserve prescription data in filtered results', () => {
      const prescriptions = [createMockPrescription('979')]
      const result = getMigratingPrescriptions(prescriptions, mockMigratingFacilitiesList)
      expect(result[0]).toEqual(prescriptions[0])
    })
  })
})
