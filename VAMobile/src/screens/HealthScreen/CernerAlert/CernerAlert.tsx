import React, { FC, ReactNode } from 'react'

import { AccordionCollapsible, Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants, LinkUrlIconType, TextView } from 'components'
import { Facility } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { PatientState, StoreState } from 'store/reducers'
import { testIdProps } from 'utils/accessibility'
import { useHasCernerFacilities, useTheme, useTranslation } from 'utils/hooks'
import { useSelector } from 'react-redux'
import getEnv from 'utils/env'

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

const CernerAlert: FC = () => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const { cernerFacilities } = useSelector<StoreState, PatientState>((state) => state.patient)
  const hasCernerFacilities = useHasCernerFacilities()

  // if no cerner facilities then do not show the alert
  if (!hasCernerFacilities) {
    return <></>
  }

  const accordionHeader = (): ReactNode => {
    return (
      <Box>
        <TextView variant="MobileBodyBold" {...testIdProps(t('cernerAlert.header'))}>
          {t('cernerAlert.header')}
        </TextView>
      </Box>
    )
  }

  const accordionContent = (): ReactNode => {
    const body = cernerFacilities.map((facility: Facility) => {
      return (
        <TextView variant="MobileBodyBold" key={facility.facilityId} mt={theme.dimensions.standardMarginBetween} {...testIdProps(facility.facilityName)}>
          {facility.facilityName}
          <TextView variant="MobileBody">{` (${t('cernerAlert.nowUsing')})`}</TextView>
        </TextView>
      )
    })

    const linkToCallProps: LinkButtonProps = {
      displayedText: t('cernerAlert.goToMyVAHealth'),
      linkType: LinkTypeOptionsConstants.url,
      linkUrlIconType: LinkUrlIconType.Arrow,
      numberOrUrlLink: LINK_URL_GO_TO_PATIENT_PORTAL,
      accessibilityHint: t('disabilityRating.learnAboutLinkTitle.a11yHint'),
      accessibilityLabel: t('cernerAlert.goToMyVAHealth'),
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBody">{t('cernerAlert.ourRecordsShow')}</TextView>
        {body}
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('cernerAlert.footer')}
        </TextView>
        <ClickForActionLink {...linkToCallProps} />
      </Box>
    )
  }

  return (
    <AccordionCollapsible
      header={accordionHeader()}
      expandedContent={accordionContent()}
      testID={t('cernerAlert.header')}
      alertBorder={'warning'}
      a11yHint={t('cernerAlert.header.a11yHint')}
    />
  )
}

export default CernerAlert
