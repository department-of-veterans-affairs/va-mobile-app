import { MigratingFacility, PrescriptionData } from 'api/types'

/**
 * Checks if a prescription is at a facility that is in the migrating facilities list
 */
export const isPrescriptionAtMigratingFacility = (
  prescription: PrescriptionData,
  migratingFacilitiesList?: MigratingFacility[],
): boolean => {
  if (!migratingFacilitiesList || migratingFacilitiesList.length === 0) {
    return false
  }

  const stationNumber = prescription.attributes.stationNumber

  return migratingFacilitiesList.some((migration) =>
    migration.facilities.some((facility) => String(facility.facilityId) === String(stationNumber)),
  )
}

/**
 * Filters a list of prescriptions to only those at migrating facilities
 */
export const getMigratingPrescriptions = (
  prescriptions: PrescriptionData[],
  migratingFacilitiesList?: MigratingFacility[],
): PrescriptionData[] => {
  if (!migratingFacilitiesList || migratingFacilitiesList.length === 0) {
    return []
  }

  return prescriptions.filter((prescription) =>
    isPrescriptionAtMigratingFacility(prescription, migratingFacilitiesList),
  )
}
