import { Facility, MigratingFacility } from 'api/types'
import { OHParentScreens, getAlertState } from 'components/OHAlertManager'

export const allFacilitiesInMigrationErrorState = (
  migratingFacilitiesList: MigratingFacility[],
  userFacilities: Facility[],
  feature: OHParentScreens,
): boolean => {
  const migratingFacilityIdsInErrorState = migratingFacilitiesList
    .filter((migration) => getAlertState(migration.phases.current, feature) === 'error')
    .flatMap((migration) => migration.facilities.map((facility) => facility.facilityId))

  return migratingFacilityIdsInErrorState.length === userFacilities.length
}

export const anyFacilitiesInMigrationErrorState = (
  migratingFacilitiesList: MigratingFacility[],
  feature: OHParentScreens,
): boolean => {
  return migratingFacilitiesList.some((migration) => getAlertState(migration.phases.current, feature) === 'error')
}
