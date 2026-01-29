import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { LinkProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Link/Link'

import { FacilityInfo, MigratingFacility, UserAuthorizedServicesData } from 'api/types'
import { AlertWithHaptics, Box, LinkWithAnalytics, TextView, VABulletList } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel/va'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

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

export const OHAlertManager = ({ parentScreen, authorizedServices }: OHAlertManagerProps) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const parentScreenToPhaseMap = {
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

  const linkProps: LinkProps = {
    type: 'url',
    url: WEBVIEW_URL_FACILITY_LOCATOR,
    text: t('ohAlert.error.linkText'),
    a11yLabel: a11yLabelVA(t('ohAlert.error.linkText')),
    testID: 'goToFindLocationInfoTestID',
    variant: 'base',
  }

  const getAlertState = (phase: string) => {
    if (parentScreenToPhaseMap[parentScreen].error.includes(phase)) {
      return 'error'
    } else if (parentScreenToPhaseMap[parentScreen].warning.includes(phase)) {
      return 'warning'
    }
    return ''
  }

  const alertsForScreen = (migration: MigratingFacility) => {
    const alertState = getAlertState(migration.phases.current)
    const dates = migration.phases
    const facilityNames = migration.facilities.map((facility: FacilityInfo) => facility.facilityName) || []
    const startPhase = parentScreenToPhaseMap[parentScreen].error[0]
    const endDatePhase = parentScreenToPhaseMap[parentScreen].endDate
    const startDate = dates[startPhase as keyof typeof dates]
    const endDate = dates[endDatePhase as keyof typeof dates]

    if (alertState === 'warning') {
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
    } else if (alertState === 'error') {
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
    return <></>
  }
  let alerts: JSX.Element[] = []
  if (authorizedServices.migratingFacilitiesList && authorizedServices.migratingFacilitiesList.length > 0) {
    alerts = authorizedServices.migratingFacilitiesList.map((migration) => alertsForScreen(migration))
  }
  return <>{alerts}</>
}

export default OHAlertManager
