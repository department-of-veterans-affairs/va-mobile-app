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

  const allCernerFacilities = facilitiesInfo.length === cernerFacilities.length
  const headerText = allCernerFacilities ? t('healthHelp.usesVAHealth') : t('cernerAlert.header.some')
  const headerA11yLabel = allCernerFacilities
    ? a11yLabelVA(t('healthHelp.usesVAHealth'))
    : a11yLabelVA(t('cernerAlert.header.some'))

  function accordionContent() {
    const bullets: VABulletListText[] = cernerFacilities.map((facility: Facility) => ({
      variant: 'MobileBody',
      text: facility.name,
      a11yLabel: a11yLabelVA(facility.name),
    }))

    const linkProps: LinkProps = {
      type: 'url',
      url: LINK_URL_GO_TO_PATIENT_PORTAL,
      text: t('goToMyVAHealth'),
      a11yLabel: a11yLabelVA(t('goToMyVAHealth')),
      testID: 'goToMyVAHealthTestID',
      variant: 'base',
    }

    return (
      <>
        <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
          {t('cernerAlertSM.sendingAMessage')}
        </TextView>
        <VABulletList listOfText={bullets} paragraphSpacing={true} />
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView
          variant="MobileBody"
          accessibilityLabel={a11yLabelVA(t('cernerAlertSM.youllNeedToGoThere'))}
          mb={theme.dimensions.standardMarginBetween}>
          {t('cernerAlertSM.youllNeedToGoThere')}
        </TextView>
        <Box mb={allCernerFacilities ? undefined : theme.dimensions.standardMarginBetween}>
          <LinkWithAnalytics {...linkProps} />
        </Box>
        {allCernerFacilities ? (
          <></>
        ) : (
          // eslint-disable-next-line react-native-a11y/has-accessibility-hint
          <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(t('cernerAlertSM.footer'))}>
            {t('cernerAlertSM.footer')}
          </TextView>
        )}
      </>
    )
  }

  return (
    <AlertWithHaptics
      variant="warning"
      expandable={true}
      focusOnError={false}
      header={headerText}
      headerA11yLabel={headerA11yLabel}
      analytics={{ onExpand: () => logAnalyticsEvent(Events.vama_cerner_alert_exp()) }}
      testID="cernerAlertTestID">
      {accordionContent()}
    </AlertWithHaptics>
  )
}

export default CernerAlertSM
