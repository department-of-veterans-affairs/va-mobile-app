import { Facility, MigratingFacility } from 'api/types'
import { OHParentScreens, getAlertState } from 'components/OHAlertManager'

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

export const allFacilitiesInMigrationErrorState = (
  migratingFacilitiesList: MigratingFacility[],
  userFacilities: Facility[],
  feature: OHParentScreens,
): boolean => {
  const migratingFacilityIdsInErrorState = getMigrationsInErrorState(migratingFacilitiesList, feature).flatMap(
    (migration) => migration.facilities.map((facility) => facility.facilityId),
  )
  return migratingFacilityIdsInErrorState.length === userFacilities.length
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

export const getMigrationEndDate = (migration: MigratingFacility, feature: OHParentScreens): string => {
  const endDatePhase = parentScreenToPhaseMap[feature].endDate
  return migration.phases[endDatePhase as keyof typeof migration.phases]
}
