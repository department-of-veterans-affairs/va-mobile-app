import React from 'react'
import { useTranslation } from 'react-i18next'

import { MigratingFacility, UserAuthorizedServicesData } from 'api/types'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'
import { getMigrationErrorMessage, getMigrationWarningMessage, parentScreenToPhaseMap } from 'utils/ohMigration'

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
    const theme = useTheme()
    const { t } = useTranslation(NAMESPACE.COMMON)
    if (alertState === 'warning') {
      return getMigrationWarningMessage(migration, parentScreen, theme, t)
    } else if (alertState === 'error') {
      return getMigrationErrorMessage(migration, parentScreen, theme, t)
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
