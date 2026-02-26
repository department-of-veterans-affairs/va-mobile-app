import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { LinkProps } from '@department-of-veterans-affairs/mobile-component-library'

import { FacilityInfo, MigratingFacility } from 'api/types'
import { LinkWithAnalytics, TextView, VABulletList } from 'components'
import AlertWithHaptics from 'components/AlertWithHaptics'
import Box from 'components/Box'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'
import { OHParentScreens, getMigrationEndDate, getMigrationStartDate } from 'utils/ohMigration'

export const MigrationErrorMessage = ({
  migration,
  parentScreen,
}: {
  migration: MigratingFacility
  parentScreen: OHParentScreens
}) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()
  const linkProps: LinkProps = {
    type: 'url',
    url: WEBVIEW_URL_FACILITY_LOCATOR,
    text: t('ohAlert.error.linkText'),
    a11yLabel: a11yLabelVA(t('ohAlert.error.linkText')),
    testID: 'goToFindLocationInfoTestID',
    variant: 'base',
  }

  const endDate = getMigrationEndDate(migration, parentScreen)
  const startDate = getMigrationStartDate(migration, parentScreen)
  const facilityNames = migration.facilities.map((facility: FacilityInfo) => facility.facilityName) || []
  return (
    <Box mb={theme.dimensions.standardMarginBetween}>
      <AlertWithHaptics
        expandable={true}
        initializeExpanded={true}
        variant="error"
        header={t(`ohAlert.error.${parentScreen}.title`, { endDate: endDate })}
        description={''}>
        <TextView accessible={true} style={{ marginTop: theme.dimensions.tinyMarginBetween }}>
          <Trans
            i18nKey={`ohAlert.error.${parentScreen}.body`}
            components={{ bold: <TextView accessible={true} variant="MobileBodyBold" /> }}
            values={{
              transitionDate: startDate,
              endDate: endDate,
            }}
          />
        </TextView>
        <Box mb={theme.dimensions.standardMarginBetween} />
        <VABulletList listOfText={facilityNames} />
        <Box mb={theme.dimensions.standardMarginBetween} />
        {t(`ohAlert.error.${parentScreen}.note`) !== `ohAlert.error.${parentScreen}.note` && (
          <TextView accessible={true} style={{ marginTop: theme.dimensions.tinyMarginBetween }}>
            {t(`ohAlert.error.${parentScreen}.note`, { featureActions: t(`ohAlert.${parentScreen}.actions`) })}
          </TextView>
        )}
        {(parentScreen === OHParentScreens.Appointments || parentScreen === OHParentScreens.SecureMessaging) && (
          <LinkWithAnalytics {...linkProps} />
        )}
      </AlertWithHaptics>
    </Box>
  )
}

export default MigrationErrorMessage
