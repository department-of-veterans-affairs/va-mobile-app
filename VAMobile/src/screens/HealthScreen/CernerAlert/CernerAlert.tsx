import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { LinkProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Link/Link'

import { useFacilitiesInfo } from 'api/facilities/getFacilitiesInfo'
import { Facility } from 'api/types/FacilityData'
import { AlertWithHaptics, Box, LinkWithAnalytics, TextView, VABulletList, VABulletListText } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

function CernerAlert() {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { data: facilitiesInfo } = useFacilitiesInfo()

  const cernerFacilities = facilitiesInfo?.filter((f) => f.cerner) || []

  useEffect(() => {
    cernerFacilities.length && logAnalyticsEvent(Events.vama_cerner_alert())
  }, [cernerFacilities.length])

  if (!facilitiesInfo) {
    return <></>
  }

  // if no cerner facilities then do not show the alert
  if (!cernerFacilities.length) {
    return <></>
  }

  // if facilities === cernerFacilities size then that means all facilities are cernerFacilities
  const allCernerFacilities = facilitiesInfo.length === cernerFacilities.length
  const headerText = allCernerFacilities ? t('healthHelp.usesVAHealth') : t('cernerAlert.header.some')
  const headerA11yLabel = allCernerFacilities
    ? a11yLabelVA(t('healthHelp.usesVAHealth'))
    : a11yLabelVA(t('cernerAlert.header.some'))

  const bullets: VABulletListText[] = cernerFacilities.map((facility: Facility) => ({
    variant: 'MobileBody',
    text: facility.name,
    a11yLabel: a11yLabelVA(facility.name),
  }))

  function accordionContent() {
    const linkProps: LinkProps = {
      type: 'url',
      url: LINK_URL_GO_TO_PATIENT_PORTAL,
      text: t('goToMyVAHealth'),
      a11yLabel: a11yLabelVA(t('goToMyVAHealth')),
      testID: 'goToMyVAHealthTestID',
    }

    return (
      <>
        <TextView
          variant="MobileBody"
          accessibilityLabel={a11yLabelVA(t('healthHelp.goToPortal'))}
          mb={theme.dimensions.condensedMarginBetween}>
          {t('healthHelp.goToPortal')}
        </TextView>
        <VABulletList listOfText={bullets} paragraphSpacing={true} />
        <Box mb={allCernerFacilities ? undefined : theme.dimensions.standardMarginBetween}>
          <LinkWithAnalytics {...linkProps} />
        </Box>
        {allCernerFacilities ? (
          <></>
        ) : (
          <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(t('cernerAlert.footer'))}>
            {t('cernerAlert.footer')}
          </TextView>
        )}
      </>
    )
  }

  return (
    <Box mb={theme.dimensions.condensedMarginBetween}>
      <AlertWithHaptics
        variant="warning"
        expandable={true}
        focusOnError={false}
        header={headerText}
        headerA11yLabel={headerA11yLabel}
        analytics={{ onExpand: () => logAnalyticsEvent(Events.vama_cerner_alert_exp()) }}>
        {accordionContent()}
      </AlertWithHaptics>
    </Box>
  )
}

export default CernerAlert
