import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { useFacilitiesInfo } from 'api/facilities/getFacilitiesInfo'
import { Facility } from 'api/types/FacilityData'
import { Box, ClickForActionLink, LargePanel, TextView, VABulletList, VABulletListText } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { useTheme } from 'utils/hooks'

import { HealthStackParamList } from '../HealthStackScreens'

type HealthHelpProps = StackScreenProps<HealthStackParamList, 'HealthHelp'>

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

function HealthHelp({}: HealthHelpProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { data: facilitiesInfo } = useFacilitiesInfo()
  const cernerFacilities = facilitiesInfo?.filter((f) => f.cerner) || []

  if (!facilitiesInfo) {
    return null
  }

  const allCernerFacilities = facilitiesInfo.length === cernerFacilities.length
  const multiFacilities = cernerFacilities.length > 1

  const bullets: VABulletListText[] = cernerFacilities.map((facility: Facility) => ({
    variant: 'MobileBodyBold',
    text: facility.name,
    allyLabel: facility.name,
  }))

  const multipleFacilitiesBody = (
    <>
      <TextView variant="MobileBodyBold">
        {allCernerFacilities ? t('healthHelp.usesVAHealth.multi.all') : t('healthHelp.usesVAHealth.some')}
      </TextView>
      <TextView>{t('healthHelp.manageHealthCare.multi.both')}</TextView>
      <VABulletList listOfText={bullets} />
      <TextView>{t('healthHelp.goToPortal.multi.both')}</TextView>
      {allCernerFacilities ? <></> : <TextView>{t('healthHelp.canStillUse.some')}</TextView>}
    </>
  )

  const singleFacilityBody = (
    <>
      <TextView variant="MobileBodyBold">
        {allCernerFacilities ? t('healthHelp.usesVAHealth.single.all') : t('healthHelp.usesVAHealth.some')}
      </TextView>
      <TextView
        variant="MobileBody"
        accessibilityLabel={a11yLabelVA(
          t('healthHelp.manageHealthCare.single.both.a11yLabel', {
            facilityName: cernerFacilities[0].name,
          }),
        )}>
        {t('healthHelp.manageHealthCare.single.both')}
        <TextView variant="MobileBodyBold">{cernerFacilities[0].name}</TextView>
        {'?'}
      </TextView>
      <TextView>{t('healthHelp.goToPortal.single.both')}</TextView>
      {allCernerFacilities ? <></> : <TextView>{t('healthHelp.canStillUse.some')}</TextView>}
    </>
  )
  return (
    <LargePanel title={t('healthHelp.title')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {multiFacilities ? multipleFacilitiesBody : singleFacilityBody}
        <ClickForActionLink
          displayedText={t('goToMyVAHealth')}
          a11yLabel={t('goToMyVAHealth')}
          linkType={'externalLink'}
          numberOrUrlLink={LINK_URL_GO_TO_PATIENT_PORTAL}
        />
      </Box>
    </LargePanel>
  )
}

export default HealthHelp
