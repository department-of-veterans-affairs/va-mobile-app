import React from 'react'

import { screen } from '@testing-library/react-native'

import { Facility, FacilityInfo, MigratingFacility, MigrationPhases } from 'api/types'
import { OHParentScreens } from 'components/OHAlertManager'
import { context, render } from 'testUtils'
import {
  MigrationErrorMessage,
  MigrationWarningMessage,
  allFacilitiesInMigrationErrorState,
  anyFacilitiesInMigrationErrorState,
  getMigrationEndDate,
  getMigrationForFacilityId,
  getMigrationStartDate,
  getMigrationsInErrorState,
  parentScreenToPhaseMap,
} from 'utils/ohMigration'

const mockFacilities: FacilityInfo[] = [
  { facilityId: 528, facilityName: 'Test VA Medical Center' },
  { facilityId: 123, facilityName: 'Different VA Medical Center' },
]

const mockPhases: MigrationPhases = {
  current: 'p0',
  p0: 'March 1, 2026',
  p1: 'March 15, 2026',
  p2: 'April 1, 2026',
  p3: 'April 24, 2026',
  p4: 'April 27, 2026',
  p5: 'May 1, 2026',
  p6: 'May 3, 2026',
  p7: 'May 8, 2026',
}

const createMigration = (currentPhase: string, facilities?: FacilityInfo[]): MigratingFacility => ({
  migrationDate: '2026-05-01',
  facilities: facilities || mockFacilities,
  phases: {
    ...mockPhases,
    current: currentPhase,
  },
})

const createUserFacilities = (count: number): Facility[] =>
  Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `Facility ${i + 1}`,
    city: 'Test City',
    state: 'TS',
    cerner: false,
    miles: '0',
  }))

context('ohMigration', () => {
  describe('parentScreenToPhaseMap', () => {
    it('should have correct phase mappings for appointments', () => {
      expect(parentScreenToPhaseMap.appointments).toEqual({
        warning: ['p0', 'p1'],
        error: ['p2', 'p3', 'p4', 'p5', 'p6'],
        endDate: 'p7',
      })
    })

    it('should have correct phase mappings for secureMessaging', () => {
      expect(parentScreenToPhaseMap.secureMessaging).toEqual({
        warning: ['p1', 'p2'],
        error: ['p3', 'p4', 'p5'],
        endDate: 'p6',
      })
    })

    it('should have correct phase mappings for medicalRecords', () => {
      expect(parentScreenToPhaseMap.medicalRecords).toEqual({
        warning: ['p1', 'p2', 'p3', 'p4'],
        error: ['p5'],
        endDate: 'p6',
      })
    })

    it('should have correct phase mappings for medications', () => {
      expect(parentScreenToPhaseMap.medications).toEqual({
        warning: ['p1', 'p2', 'p3'],
        error: ['p4', 'p5'],
        endDate: 'p6',
      })
    })

    it('should contain all four feature screens', () => {
      expect(Object.keys(parentScreenToPhaseMap)).toEqual([
        'appointments',
        'secureMessaging',
        'medicalRecords',
        'medications',
      ])
    })
  })

  describe('getMigrationsInErrorState', () => {
    it('should return migrations that are in an error phase for appointments', () => {
      const migrations = [createMigration('p2'), createMigration('p0')]
      const result = getMigrationsInErrorState(migrations, OHParentScreens.Appointments)
      expect(result).toHaveLength(1)
      expect(result[0].phases.current).toBe('p2')
    })

    it('should return migrations that are in an error phase for secureMessaging', () => {
      const migrations = [createMigration('p3'), createMigration('p1')]
      const result = getMigrationsInErrorState(migrations, OHParentScreens.SecureMessaging)
      expect(result).toHaveLength(1)
      expect(result[0].phases.current).toBe('p3')
    })

    it('should return migrations that are in an error phase for medicalRecords', () => {
      const migrations = [createMigration('p5')]
      const result = getMigrationsInErrorState(migrations, OHParentScreens.MedicalRecords)
      expect(result).toHaveLength(1)
    })

    it('should return migrations that are in an error phase for medications', () => {
      const migrations = [createMigration('p4'), createMigration('p5')]
      const result = getMigrationsInErrorState(migrations, OHParentScreens.Medications)
      expect(result).toHaveLength(2)
    })

    it('should return empty array when no migrations are in error state', () => {
      const migrations = [createMigration('p0'), createMigration('p1')]
      const result = getMigrationsInErrorState(migrations, OHParentScreens.Appointments)
      expect(result).toHaveLength(0)
    })

    it('should return empty array when migrations list is empty', () => {
      const result = getMigrationsInErrorState([], OHParentScreens.Appointments)
      expect(result).toHaveLength(0)
    })

    it('should return all migrations when all are in error state', () => {
      const migrations = [createMigration('p3'), createMigration('p4'), createMigration('p5')]
      const result = getMigrationsInErrorState(migrations, OHParentScreens.Appointments)
      expect(result).toHaveLength(3)
    })

    it('should not include migrations in warning state', () => {
      const migrations = [createMigration('p1')]
      const result = getMigrationsInErrorState(migrations, OHParentScreens.Appointments)
      expect(result).toHaveLength(0)
    })

    it('should not include migrations in phases past the end date', () => {
      // p7 is the endDate phase for appointments, not in error list
      const migrations = [createMigration('p7')]
      const result = getMigrationsInErrorState(migrations, OHParentScreens.Appointments)
      expect(result).toHaveLength(0)
    })
  })

  describe('allFacilitiesInMigrationErrorState', () => {
    it('should return true when all user facilities are covered by error-state migrations', () => {
      const migrations = [createMigration('p2', mockFacilities)]
      const userFacilities = createUserFacilities(2)
      const result = allFacilitiesInMigrationErrorState(migrations, userFacilities, OHParentScreens.Appointments)
      expect(result).toBe(true)
    })

    it('should return false when user has more facilities than those in error state', () => {
      const migrations = [createMigration('p2', [mockFacilities[0]])]
      const userFacilities = createUserFacilities(2)
      const result = allFacilitiesInMigrationErrorState(migrations, userFacilities, OHParentScreens.Appointments)
      expect(result).toBe(false)
    })

    it('should return false when no migrations are in error state', () => {
      const migrations = [createMigration('p0', mockFacilities)]
      const userFacilities = createUserFacilities(2)
      const result = allFacilitiesInMigrationErrorState(migrations, userFacilities, OHParentScreens.Appointments)
      expect(result).toBe(false)
    })

    it('should return true when migrations list is empty and user has no facilities', () => {
      const result = allFacilitiesInMigrationErrorState([], [], OHParentScreens.Appointments)
      expect(result).toBe(true)
    })

    it('should return false when migrations list is empty and user has facilities', () => {
      const userFacilities = createUserFacilities(1)
      const result = allFacilitiesInMigrationErrorState([], userFacilities, OHParentScreens.Appointments)
      expect(result).toBe(false)
    })

    it('should aggregate facilities from multiple error-state migrations', () => {
      const migration1 = createMigration('p2', [mockFacilities[0]])
      const migration2 = createMigration('p3', [mockFacilities[1]])
      const userFacilities = createUserFacilities(2)
      const result = allFacilitiesInMigrationErrorState(
        [migration1, migration2],
        userFacilities,
        OHParentScreens.Appointments,
      )
      expect(result).toBe(true)
    })

    it('should use the correct error phases for each feature', () => {
      // p2 is warning for secureMessaging, not error
      const migrations = [createMigration('p2', mockFacilities)]
      const userFacilities = createUserFacilities(2)
      const result = allFacilitiesInMigrationErrorState(migrations, userFacilities, OHParentScreens.SecureMessaging)
      expect(result).toBe(false)
    })
  })

  describe('anyFacilitiesInMigrationErrorState', () => {
    it('should return true when at least one migration is in error state', () => {
      const migrations = [createMigration('p2'), createMigration('p0')]
      const result = anyFacilitiesInMigrationErrorState(migrations, OHParentScreens.Appointments)
      expect(result).toBe(true)
    })

    it('should return false when no migrations are in error state', () => {
      const migrations = [createMigration('p0'), createMigration('p1')]
      const result = anyFacilitiesInMigrationErrorState(migrations, OHParentScreens.Appointments)
      expect(result).toBe(false)
    })

    it('should return false when migrations list is empty', () => {
      const result = anyFacilitiesInMigrationErrorState([], OHParentScreens.Appointments)
      expect(result).toBe(false)
    })

    it('should return true when all migrations are in error state', () => {
      const migrations = [createMigration('p3'), createMigration('p4')]
      const result = anyFacilitiesInMigrationErrorState(migrations, OHParentScreens.Appointments)
      expect(result).toBe(true)
    })

    it('should correctly identify error state for secureMessaging', () => {
      const migrations = [createMigration('p3')]
      expect(anyFacilitiesInMigrationErrorState(migrations, OHParentScreens.SecureMessaging)).toBe(true)
    })

    it('should correctly identify error state for medicalRecords', () => {
      const migrations = [createMigration('p5')]
      expect(anyFacilitiesInMigrationErrorState(migrations, OHParentScreens.MedicalRecords)).toBe(true)
    })

    it('should correctly identify error state for medications', () => {
      const migrations = [createMigration('p4')]
      expect(anyFacilitiesInMigrationErrorState(migrations, OHParentScreens.Medications)).toBe(true)
    })

    it('should not treat warning phases as error for secureMessaging', () => {
      // p2 is warning for secureMessaging
      const migrations = [createMigration('p2')]
      expect(anyFacilitiesInMigrationErrorState(migrations, OHParentScreens.SecureMessaging)).toBe(false)
    })
  })

  describe('getMigrationForFacilityId', () => {
    it('should return the migration containing the given facility id as a number', () => {
      const migration = createMigration('p3', [mockFacilities[0]])
      const result = getMigrationForFacilityId([migration], 528)
      expect(result).toBe(migration)
    })

    it('should return the migration containing the given facility id as a string', () => {
      const migration = createMigration('p3', [mockFacilities[0]])
      const result = getMigrationForFacilityId([migration], '528')
      expect(result).toBe(migration)
    })

    it('should return undefined when no migration contains the facility id', () => {
      const migration = createMigration('p3', [mockFacilities[0]])
      const result = getMigrationForFacilityId([migration], 999)
      expect(result).toBeUndefined()
    })

    it('should return undefined when facilityId is undefined', () => {
      const migration = createMigration('p3', [mockFacilities[0]])
      const result = getMigrationForFacilityId([migration], undefined)
      expect(result).toBeUndefined()
    })

    it('should return undefined when facilityId is an empty string', () => {
      const migration = createMigration('p3', [mockFacilities[0]])
      const result = getMigrationForFacilityId([migration], '')
      expect(result).toBeUndefined()
    })

    it('should return undefined when migrations list is empty', () => {
      const result = getMigrationForFacilityId([], 528)
      expect(result).toBeUndefined()
    })

    it('should find the correct migration when multiple migrations have different facilities', () => {
      const migration1 = createMigration('p3', [mockFacilities[0]])
      const migration2 = createMigration('p4', [mockFacilities[1]])
      const result = getMigrationForFacilityId([migration1, migration2], 123)
      expect(result).toBe(migration2)
    })

    it('should match when facility is one of multiple in a migration', () => {
      const migration = createMigration('p3', mockFacilities)
      const result = getMigrationForFacilityId([migration], 123)
      expect(result).toBe(migration)
    })
  })

  describe('getMigrationEndDate', () => {
    const migration = createMigration('p0')

    it('should return the p7 date for appointments', () => {
      expect(getMigrationEndDate(migration, OHParentScreens.Appointments)).toBe('May 8, 2026')
    })

    it('should return the p6 date for secureMessaging', () => {
      expect(getMigrationEndDate(migration, OHParentScreens.SecureMessaging)).toBe('May 3, 2026')
    })

    it('should return the p6 date for medicalRecords', () => {
      expect(getMigrationEndDate(migration, OHParentScreens.MedicalRecords)).toBe('May 3, 2026')
    })

    it('should return the p6 date for medications', () => {
      expect(getMigrationEndDate(migration, OHParentScreens.Medications)).toBe('May 3, 2026')
    })
  })

  describe('getMigrationStartDate', () => {
    const migration = createMigration('p0')

    it('should return the p2 date for appointments (first error phase)', () => {
      expect(getMigrationStartDate(migration, OHParentScreens.Appointments)).toBe('April 1, 2026')
    })

    it('should return the p3 date for secureMessaging (first error phase)', () => {
      expect(getMigrationStartDate(migration, OHParentScreens.SecureMessaging)).toBe('April 24, 2026')
    })

    it('should return the p5 date for medicalRecords (first error phase)', () => {
      expect(getMigrationStartDate(migration, OHParentScreens.MedicalRecords)).toBe('May 1, 2026')
    })

    it('should return the p4 date for medications (first error phase)', () => {
      expect(getMigrationStartDate(migration, OHParentScreens.Medications)).toBe('April 27, 2026')
    })
  })

  describe('MigrationWarningMessage', () => {
    const WarningMessageWrapper = ({
      parentScreen,
      currentPhase,
    }: {
      parentScreen: OHParentScreens
      currentPhase: string
    }) => {
      const migration = createMigration(currentPhase)
      return <MigrationWarningMessage migration={migration} parentScreen={parentScreen} />
    }

    it('should render a warning alert for appointments', () => {
      render(<WarningMessageWrapper parentScreen={OHParentScreens.Appointments} currentPhase="p0" />)
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
      expect(screen.getByText('Different VA Medical Center')).toBeTruthy()
    })

    it('should render a warning alert for secureMessaging', () => {
      render(<WarningMessageWrapper parentScreen={OHParentScreens.SecureMessaging} currentPhase="p1" />)
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
      expect(screen.getByText('Different VA Medical Center')).toBeTruthy()
    })

    it('should render a warning alert for medicalRecords', () => {
      render(<WarningMessageWrapper parentScreen={OHParentScreens.MedicalRecords} currentPhase="p1" />)
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
    })

    it('should render a warning alert for medications', () => {
      render(<WarningMessageWrapper parentScreen={OHParentScreens.Medications} currentPhase="p1" />)
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
    })

    it('should display all facility names in bullet list', () => {
      render(<WarningMessageWrapper parentScreen={OHParentScreens.Appointments} currentPhase="p0" />)
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
      expect(screen.getByText('Different VA Medical Center')).toBeTruthy()
    })

    it('should render with single facility', () => {
      const SingleFacilityWrapper = () => {
        const migration = createMigration('p0', [mockFacilities[0]])
        return <MigrationWarningMessage migration={migration} parentScreen={OHParentScreens.Appointments} />
      }
      render(<SingleFacilityWrapper />)
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
      expect(screen.queryByText('Different VA Medical Center')).toBeNull()
    })
  })

  describe('MigrationErrorMessage', () => {
    const ErrorMessageWrapper = ({
      parentScreen,
      currentPhase,
    }: {
      parentScreen: OHParentScreens
      currentPhase: string
    }) => {
      const migration = createMigration(currentPhase)
      return <MigrationErrorMessage migration={migration} parentScreen={parentScreen} />
    }

    it('should render an error alert for appointments', () => {
      render(<ErrorMessageWrapper parentScreen={OHParentScreens.Appointments} currentPhase="p2" />)
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
      expect(screen.getByText('Different VA Medical Center')).toBeTruthy()
    })

    it('should render an error alert for secureMessaging', () => {
      render(<ErrorMessageWrapper parentScreen={OHParentScreens.SecureMessaging} currentPhase="p3" />)
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
    })

    it('should render an error alert for medicalRecords', () => {
      render(<ErrorMessageWrapper parentScreen={OHParentScreens.MedicalRecords} currentPhase="p5" />)
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
    })

    it('should render an error alert for medications', () => {
      render(<ErrorMessageWrapper parentScreen={OHParentScreens.Medications} currentPhase="p4" />)
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
    })

    it('should display all facility names', () => {
      render(<ErrorMessageWrapper parentScreen={OHParentScreens.Appointments} currentPhase="p2" />)
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
      expect(screen.getByText('Different VA Medical Center')).toBeTruthy()
    })

    it('should render the facility locator link for appointments', () => {
      render(<ErrorMessageWrapper parentScreen={OHParentScreens.Appointments} currentPhase="p2" />)
      expect(screen.getByTestId('goToFindLocationInfoTestID')).toBeTruthy()
    })

    it('should render the facility locator link for secureMessaging', () => {
      render(<ErrorMessageWrapper parentScreen={OHParentScreens.SecureMessaging} currentPhase="p3" />)
      expect(screen.getByTestId('goToFindLocationInfoTestID')).toBeTruthy()
    })

    it('should not render the facility locator link for medicalRecords', () => {
      render(<ErrorMessageWrapper parentScreen={OHParentScreens.MedicalRecords} currentPhase="p5" />)
      expect(screen.queryByTestId('goToFindLocationInfoTestID')).toBeNull()
    })

    it('should not render the facility locator link for medications', () => {
      render(<ErrorMessageWrapper parentScreen={OHParentScreens.Medications} currentPhase="p4" />)
      expect(screen.queryByTestId('goToFindLocationInfoTestID')).toBeNull()
    })

    it('should render with single facility', () => {
      const SingleFacilityWrapper = () => {
        const migration = createMigration('p2', [mockFacilities[0]])
        return <MigrationErrorMessage migration={migration} parentScreen={OHParentScreens.Appointments} />
      }
      render(<SingleFacilityWrapper />)
      expect(screen.getByText('Test VA Medical Center')).toBeTruthy()
      expect(screen.queryByText('Different VA Medical Center')).toBeNull()
    })
  })
})
