import React from 'react'

import { MigratingFacility, UserAuthorizedServicesData } from 'api/types'
import DuplicateRecordAlert from 'components/DuplicateRecordAlert'
import { MigrationErrorMessage } from 'components/MigrationErrorMessage'
import { MigrationWarningMessage } from 'components/MigrationWarningMessage'
import { OHParentScreens, getAlertState } from 'utils/ohMigration'
import { featureEnabled } from 'utils/remoteConfig'

type OHAlertManagerProps = {
  parentScreen: OHParentScreens
  authorizedServices: UserAuthorizedServicesData
  cernerExist?: boolean
}

export const OHAlertManager = ({ parentScreen, authorizedServices, cernerExist }: OHAlertManagerProps) => {
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
  const migratingFacilitiesList = authorizedServices.migratingFacilitiesList || []

  if (migratingFacilitiesList.length > 0) {
    alerts = migratingFacilitiesList.map((migration, index) => (
      <React.Fragment key={migration.migrationDate || index}>{alertsForScreen(migration)}</React.Fragment>
    ))
  }

  const hasMigrationAlerts = migratingFacilitiesList.some(
    (migration) => getAlertState(migration.phases.current, parentScreen) !== '',
  )

  const isInP6OrP7 = migratingFacilitiesList.some((migration) =>
    ['p6', 'p7'].includes(migration.phases.current),
  )

  const showDuplicateRecordAlert =
    parentScreen === OHParentScreens.MedicalRecords &&
    featureEnabled('displayDuplicateRecordAlert') &&
    !hasMigrationAlerts &&
    (cernerExist || isInP6OrP7)

  return (
    <>
      {alerts}
      {showDuplicateRecordAlert && <DuplicateRecordAlert />}
    </>
  )
}

export default OHAlertManager
