import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode } from 'react'

import { Box, ClickForActionLink, CollapsibleAlert, LinkButtonProps, LinkTypeOptionsConstants, LinkUrlIconType, TextView } from 'components'
import { Facility } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { PatientState } from 'store/slices'
import { RootState } from 'store'
import { testIdProps } from 'utils/accessibility'
import { useHasCernerFacilities, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import getEnv from 'utils/env'

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

const CernerAlert: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
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
      displayedText: t('goToMyVAHealth'),
      linkType: LinkTypeOptionsConstants.url,
      linkUrlIconType: LinkUrlIconType.Arrow,
      numberOrUrlLink: LINK_URL_GO_TO_PATIENT_PORTAL,
      a11yLabel: t('goToMyVAHealth.a11yLabel'),
      testID: 'goToMyVAHealthTestID',
    }

    return (
      <Box mt={theme.paragraphSpacing.spacing20FontSize}>
        <TextView variant="MobileBody" paragraphSpacing={true}>
          {t('cernerAlert.ourRecordsShow')}
        </TextView>
        {body}
        <TextView variant="MobileBody" paragraphSpacing={true} accessibilityLabel={t('cernerAlert.footer.a11yLabel')}>
          {t('cernerAlert.footer')}
        </TextView>
        <ClickForActionLink {...linkToCallProps} />
      </Box>
    )
  }

  return <CollapsibleAlert border="warning" headerText={headerText} body={accordionContent()} a11yLabel={headerA11yLabel} />
}

export default CernerAlert
