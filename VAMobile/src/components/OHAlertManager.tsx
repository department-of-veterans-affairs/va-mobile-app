import React from 'react'

import { MigratingFacility, UserAuthorizedServicesData } from 'api/types'
import { MigrationErrorMessage, MigrationWarningMessage, OHParentScreens, getAlertState } from 'utils/ohMigration'

export { OHParentScreens, getAlertState }

type OHAlertManagerProps = {
  parentScreen: OHParentScreens
  authorizedServices: UserAuthorizedServicesData
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
    alerts = authorizedServices.migratingFacilitiesList.map((migration, index) => (
      <React.Fragment key={migration.migrationDate}>{alertsForScreen(migration)}</React.Fragment>
    ))
  }
  return <>{alerts}</>
}

export default OHAlertManager
