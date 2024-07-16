import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { LinkProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Link/Link'

import { useFacilitiesInfo } from 'api/facilities/getFacilitiesInfo'
import { Facility } from 'api/types/FacilityData'
import { Box, CollapsibleAlert, LinkWithAnalytics, TextView, VABulletList, VABulletListText } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

function CernerAlertSM() {
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

  const hasMultipleFacilities = cernerFacilities.length > 1
  const headerText = t('cernerAlertSM.header')

  function accordionContent() {
    let intro = t('cernerAlertSM.sendingAMessage', { facility: cernerFacilities[0].name })
    let thisFacility = t('cernerAlertSM.thisFacilityUses')
    let thisFacilityA11y = a11yLabelVA(t('cernerAlertSM.thisFacilityUses'))
    let bullets: VABulletListText[] = []

    if (hasMultipleFacilities) {
      intro = t('cernerAlertSM.sendingAMessageMultiple')
      thisFacility = t('cernerAlertSM.theseFacilitiesUse')
      thisFacilityA11y = a11yLabelVA(t('cernerAlertSM.theseFacilitiesUse'))
      bullets = cernerFacilities.map((facility: Facility) => ({ text: facility.name }))
    }

    const outro = `${thisFacility} ${t('cernerAlertSM.youllNeedToGoThere')}`
    const outroA11y = `${thisFacilityA11y} ${t('cernerAlertSM.youllNeedToGoThere')}`

    const linkProps: LinkProps = {
      type: 'url',
      url: LINK_URL_GO_TO_PATIENT_PORTAL,
      text: t('goToMyVAHealth'),
      a11yLabel: a11yLabelVA(t('goToMyVAHealth')),
      testID: 'goToMyVAHealthTestID',
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBody" paragraphSpacing={true}>
          {intro}
        </TextView>
        {hasMultipleFacilities && <VABulletList listOfText={bullets} paragraphSpacing={true} />}
        <TextView variant="MobileBody" accessibilityLabel={outroA11y} paragraphSpacing={true}>
          {outro}
        </TextView>
        <LinkWithAnalytics {...linkProps} />
      </Box>
    )
  }

  return (
    <CollapsibleAlert
      border="warning"
      headerText={headerText}
      body={accordionContent()}
      a11yLabel={headerText}
      onExpand={() => logAnalyticsEvent(Events.vama_cerner_alert_exp())}
    />
  )
}

export default CernerAlertSM
