import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode } from 'react'

import { Box, ClickForActionLink, CollapsibleAlert, LinkButtonProps, LinkTypeOptionsConstants, LinkUrlIconType, TextView } from 'components'
import { Facility } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { PatientState } from 'store/slices'
import { RootState } from 'store'
import { VATheme } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'
import { useHasCernerFacilities } from 'utils/hooks'
import { useSelector } from 'react-redux'
import { useTheme } from 'styled-components'
import getEnv from 'utils/env'

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

const CernerAlert: FC = () => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme() as VATheme
  const { cernerFacilities, facilities } = useSelector<RootState, PatientState>((state) => state.patient)
  const hasCernerFacilities = useHasCernerFacilities()

  // if no cerner facilities then do not show the alert
  if (!hasCernerFacilities) {
    return <></>
  }

  // if facilities === cernerFacilities size then that means all facilities are cernerFacilities
  const allCernerFacilities = facilities.length === cernerFacilities.length
  const headerText = allCernerFacilities ? t('cernerAlert.header.all') : t('cernerAlert.header.some')
  const headerA11yLabel = allCernerFacilities ? t('cernerAlert.header.all.a11yLabel') : t('cernerAlert.header.some.a11yLabel')

  const accordionContent = (): ReactNode => {
    const body = cernerFacilities.map((facility: Facility) => {
      return (
        <TextView
          variant="MobileBodyBold"
          key={facility.facilityId}
          mt={theme.dimensions.standardMarginBetween}
          selectable={true}
          {...testIdProps(`${facility.facilityName} (${t('cernerAlert.nowUsing')})`)}>
          {facility.facilityName}
          <TextView variant="MobileBody">{` (${t('cernerAlert.nowUsing')})`}</TextView>
        </TextView>
      )
    })

    const linkToCallProps: LinkButtonProps = {
      displayedText: tc('goToMyVAHealth'),
      linkType: LinkTypeOptionsConstants.url,
      linkUrlIconType: LinkUrlIconType.Arrow,
      numberOrUrlLink: LINK_URL_GO_TO_PATIENT_PORTAL,
      a11yLabel: tc('goToMyVAHealth.a11yLabel'),
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBody">{t('cernerAlert.ourRecordsShow')}</TextView>
        {body}
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween} accessibilityLabel={t('cernerAlert.footer.a11yLabel')}>
          {t('cernerAlert.footer')}
        </TextView>
        <ClickForActionLink {...linkToCallProps} />
      </Box>
    )
  }

  return <CollapsibleAlert border="warning" headerText={headerText} body={accordionContent()} a11yLabel={headerA11yLabel} />
}

export default CernerAlert
