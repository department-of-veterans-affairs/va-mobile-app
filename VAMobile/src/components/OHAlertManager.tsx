import React from 'react'

import { MigratingFacility, UserAuthorizedServicesData } from 'api/types'
import { MigrationErrorMessage, MigrationWarningMessage, parentScreenToPhaseMap } from 'utils/ohMigration'

export enum OHParentScreens {
  Appointments = 'appointments',
  SecureMessaging = 'secureMessaging',
  MedicalRecords = 'medicalRecords',
  Medications = 'medications',
}

type OHAlertManagerProps = {
  parentScreen: OHParentScreens
  authorizedServices: UserAuthorizedServicesData
}

export const getAlertState = (phase: string, parentScreen: OHParentScreens) => {
  if (parentScreenToPhaseMap[parentScreen].error.includes(phase)) {
    return 'error'
  } else if (parentScreenToPhaseMap[parentScreen].warning.includes(phase)) {
    return 'warning'
  }
  return ''
}

export const OHAlertManager = ({ parentScreen, authorizedServices }: OHAlertManagerProps) => {
  const alertsForScreen = (migration: MigratingFacility) => {
    const alertState = getAlertState(migration.phases.current, parentScreen)
    if (alertState === 'warning') {
      return <MigrationWarningMessage migration={migration} parentScreen={parentScreen} />
    } else if (alertState === 'error') {
      return <MigrationErrorMessage migration={migration} parentScreen={parentScreen} />
    }
    return <></>
  }
  let alerts: JSX.Element[] = []
  if (authorizedServices.migratingFacilitiesList && authorizedServices.migratingFacilitiesList.length > 0) {
    alerts = authorizedServices.migratingFacilitiesList.map((migration) => alertsForScreen(migration))
  }
  return <>{alerts}</>
}

export default OHAlertManager
