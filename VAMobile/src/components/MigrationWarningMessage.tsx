import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { FacilityInfo, MigratingFacility } from 'api/types'
import { TextView, VABulletList } from 'components'
import AlertWithHaptics from 'components/AlertWithHaptics'
import Box from 'components/Box'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'
import { OHParentScreens, getMigrationEndDate, getMigrationStartDate } from 'utils/ohMigration'

export const MigrationWarningMessage = ({
  migration,
  parentScreen,
}: {
  migration: MigratingFacility
  parentScreen: OHParentScreens
}) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const endDate = getMigrationEndDate(migration, parentScreen)
  const startDate = getMigrationStartDate(migration, parentScreen)
  const facilityNames = migration.facilities.map((facility: FacilityInfo) => facility.facilityName) || []
  return (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <AlertWithHaptics
        expandable={true}
        initializeExpanded={true}
        variant="warning"
        header={t(`ohAlert.warning.title`, { date: startDate })}
        description={''}>
        <TextView accessible={true} style={{ marginTop: theme.dimensions.tinyMarginBetween }}>
          <Trans
            i18nKey={`ohAlert.warning.${parentScreen}.body`}
            components={{ bold: <TextView accessible={true} variant="MobileBodyBold" /> }}
            values={{
              startDate: startDate,
              endDate: endDate,
            }}
          />
        </TextView>
        <Box mb={theme.dimensions.standardMarginBetween} />
        <VABulletList listOfText={facilityNames} />
        <Box mb={theme.dimensions.standardMarginBetween} />
        {t(`ohAlert.warning.${parentScreen}.note`) !== `ohAlert.warning.${parentScreen}.note` && (
          <TextView accessible={true} style={{ marginTop: theme.dimensions.tinyMarginBetween }}>
            <Trans
              i18nKey={`ohAlert.warning.${parentScreen}.note`}
              components={{ bold: <TextView accessible={true} variant="MobileBodyBold" /> }}
            />
          </TextView>
        )}
      </AlertWithHaptics>
    </Box>
  )
}

export default MigrationWarningMessage
