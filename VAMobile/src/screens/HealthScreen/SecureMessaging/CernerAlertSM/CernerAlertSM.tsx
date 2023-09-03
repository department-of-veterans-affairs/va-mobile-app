import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode } from 'react'

import { Box, ClickForActionLink, CollapsibleAlert, LinkButtonProps, LinkTypeOptionsConstants, TextView, VABulletList, VABulletListText } from 'components'
import { Facility } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { PatientState } from 'store/slices'
import { RootState } from 'store'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

const CernerAlertSM: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { cernerFacilities } = useSelector<RootState, PatientState>((state) => state.patient)

  // if no cerner facilities then do not show the alert
  if (!cernerFacilities.length) {
    return <></>
  }

  const hasMultipleFacilities = cernerFacilities.length > 1
  const headerText = t('cernerAlertSM.header')

  const accordionContent = (): ReactNode => {
    let intro = t('cernerAlertSM.sendingAMessage', { facility: cernerFacilities[0].facilityName })
    let thisFacility = t('cernerAlertSM.thisFacilityUses')
    let thisFacilityA11y = a11yLabelVA(t('cernerAlertSM.thisFacilityUses'))
    let bullets: VABulletListText[] = []

    if (hasMultipleFacilities) {
      intro = t('cernerAlertSM.sendingAMessageMultiple')
      thisFacility = t('cernerAlertSM.theseFacilitiesUse')
      thisFacilityA11y = a11yLabelVA(t('cernerAlertSM.theseFacilitiesUse'))
      bullets = cernerFacilities.map((facility: Facility) => ({ text: facility.facilityName }))
    }

    const outro = `${thisFacility} ${t('cernerAlertSM.youllNeedToGoThere')}`
    const outroA11y = `${thisFacilityA11y} ${t('cernerAlertSM.youllNeedToGoThere')}`

    const linkToCallProps: LinkButtonProps = {
      displayedText: t('goToMyVAHealth'),
      linkType: LinkTypeOptionsConstants.externalLink,
      numberOrUrlLink: LINK_URL_GO_TO_PATIENT_PORTAL,
      a11yLabel: a11yLabelVA(t('goToMyVAHealth')),
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBody" paragraphSpacing={true}>
          {intro}
        </TextView>
        {hasMultipleFacilities && <VABulletList listOfText={bullets} />}
        <TextView variant="MobileBody" accessibilityLabel={outroA11y} paragraphSpacing={true}>
          {outro}
        </TextView>
        <ClickForActionLink {...linkToCallProps} />
      </Box>
    )
  }

  return <CollapsibleAlert border="warning" headerText={headerText} body={accordionContent()} a11yLabel={headerText} />
}

export default CernerAlertSM
