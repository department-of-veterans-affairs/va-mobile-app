import { Trans, useTranslation } from 'react-i18next'

import { LinkProps } from '@department-of-veterans-affairs/mobile-component-library'

import { Facility, FacilityInfo, MigratingFacility } from 'api/types'
import { LinkWithAnalytics, TextView, VABulletList } from 'components'
import AlertWithHaptics from 'components/AlertWithHaptics'
import Box from 'components/Box'
import { OHParentScreens, getAlertState } from 'components/OHAlertManager'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

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

export const getMigrationStartDate = (migration: MigratingFacility, feature: OHParentScreens): string => {
  const startDatePhase = parentScreenToPhaseMap[feature].warning[0]
  return migration.phases[startDatePhase as keyof typeof migration.phases]
}

export const getMigrationWarningMessage = (migration: MigratingFacility, parentScreen: OHParentScreens) => {
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
        <TextView style={{ marginTop: theme.dimensions.tinyMarginBetween }}>
          <Trans
            i18nKey={`ohAlert.warning.${parentScreen}.body`}
            components={{ bold: <TextView variant="MobileBodyBold" /> }}
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
          <TextView style={{ marginTop: theme.dimensions.tinyMarginBetween }}>
            <Trans
              i18nKey={`ohAlert.warning.${parentScreen}.note`}
              components={{ bold: <TextView variant="MobileBodyBold" /> }}
            />
          </TextView>
        )}
      </AlertWithHaptics>
    </Box>
  )
}

export const getMigrationErrorMessage = (migration: MigratingFacility, parentScreen: OHParentScreens) => {
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
        <TextView style={{ marginTop: theme.dimensions.tinyMarginBetween }}>
          <Trans
            i18nKey={`ohAlert.error.${parentScreen}.body`}
            components={{ bold: <TextView variant="MobileBodyBold" /> }}
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
          <TextView style={{ marginTop: theme.dimensions.tinyMarginBetween }}>
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
