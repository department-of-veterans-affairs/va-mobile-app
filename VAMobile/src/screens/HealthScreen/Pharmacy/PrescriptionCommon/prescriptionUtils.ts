import { MigratingFacility, PrescriptionData } from 'api/types'

/**
 * Checks if a prescription's station is in the migrating facilities list
 * @param prescription - The prescription to check
 * @param migratingFacilitiesList - The list of migrating facilities from authorized services
 * @returns true if the prescription is at a migrating facility, false otherwise
 */
export const isPrescriptionAtMigratingFacility = (
  prescription: PrescriptionData,
  migratingFacilitiesList?: MigratingFacility[],
): boolean => {
  if (!migratingFacilitiesList || migratingFacilitiesList.length === 0) {
    return false
  }
  const stationNumber = prescription.attributes.stationNumber
  if (!stationNumber) {
    return false
  }
  return migratingFacilitiesList.some((migration: MigratingFacility) =>
    migration.facilities.some((facility) => String(facility.facilityId) === stationNumber),
  )
}

/**
 * Filters prescriptions to only those at migrating facilities
 * @param prescriptions - The list of prescriptions to filter
 * @param migratingFacilitiesList - The list of migrating facilities from authorized services
 * @returns Array of prescriptions that are at migrating facilities
 */
export const getMigratingPrescriptions = (
  prescriptions: PrescriptionData[],
  migratingFacilitiesList?: MigratingFacility[],
): PrescriptionData[] => {
  if (!prescriptions || prescriptions.length === 0) {
    return []
  }
  return prescriptions.filter((prescription) =>
    isPrescriptionAtMigratingFacility(prescription, migratingFacilitiesList),
  )
}
