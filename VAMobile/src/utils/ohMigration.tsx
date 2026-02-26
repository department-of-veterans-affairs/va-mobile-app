import { Facility, MigratingFacility } from 'api/types'

export enum OHParentScreens {
  Appointments = 'appointments',
  SecureMessaging = 'secureMessaging',
  MedicalRecords = 'medicalRecords',
  Medications = 'medications',
}

export const parentScreenToPhaseMap = {
  appointments: {
    warning: ['p0', 'p1'],
    error: ['p2', 'p3', 'p4', 'p5', 'p6'],
    endDate: 'p7',
  },
  secureMessaging: {
    warning: ['p1', 'p2'],
    error: ['p3', 'p4', 'p5'],
    endDate: 'p6',
  },
  medicalRecords: {
    warning: ['p1', 'p2', 'p3', 'p4'],
    error: ['p5'],
    endDate: 'p6',
  },
  medications: {
    warning: ['p1', 'p2', 'p3'],
    error: ['p4', 'p5'],
    endDate: 'p6',
  },
}

export const getAlertState = (phase: string, parentScreen: OHParentScreens) => {
  if (parentScreenToPhaseMap[parentScreen].error.includes(phase)) {
    return 'error'
  } else if (parentScreenToPhaseMap[parentScreen].warning.includes(phase)) {
    return 'warning'
  }
  return ''
}

export const allFacilitiesInMigrationErrorState = (
  migratingFacilitiesList: MigratingFacility[],
  userFacilities: Facility[],
  feature: OHParentScreens,
): boolean => {
  const migratingFacilityIdsInErrorState = new Set(
    getMigrationsInErrorState(migratingFacilitiesList, feature).flatMap((migration) =>
      migration.facilities.map((facility) => String(facility.facilityId)),
    ),
  )
  return userFacilities.every((facility) => migratingFacilityIdsInErrorState.has(String(facility.id)))
}

export const anyFacilitiesInMigrationErrorState = (
  migratingFacilitiesList: MigratingFacility[],
  feature: OHParentScreens,
): boolean => {
  return getMigrationsInErrorState(migratingFacilitiesList, feature).length > 0
}

export const getMigrationsInErrorState = (
  migratingFacilitiesList: MigratingFacility[],
  feature: OHParentScreens,
): MigratingFacility[] => {
  return migratingFacilitiesList.filter((migration) => getAlertState(migration.phases.current, feature) === 'error')
}

// Each facility should only ever be in one migration at a time
export const getMigrationForFacilityId = (
  migratingFacilitiesList: MigratingFacility[],
  facilityId: number | string | undefined,
): MigratingFacility | undefined => {
  if (!facilityId || (typeof facilityId === 'string' && facilityId.trim() === '')) return undefined
  return migratingFacilitiesList.find((migration) =>
    migration.facilities.some((facility) => String(facility.facilityId) === String(facilityId)),
  )
}

export const getMigrationEndDate = (migration: MigratingFacility, feature: OHParentScreens): string => {
  const endDatePhase = parentScreenToPhaseMap[feature].endDate
  return migration.phases[endDatePhase as keyof typeof migration.phases]
}

export const getMigrationStartDate = (migration: MigratingFacility, feature: OHParentScreens): string => {
  const startDatePhase = parentScreenToPhaseMap[feature].error[0]
  return migration.phases[startDatePhase as keyof typeof migration.phases]
}
