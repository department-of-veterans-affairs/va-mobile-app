import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { useFacilitiesInfo } from 'api/facilities/getFacilitiesInfo'
import { Facility } from 'api/types/FacilityData'
import { Box, LargePanel, LinkWithAnalytics, TextView, VABulletList, VABulletListText } from 'components'
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

  const allCernerFacilities = facilitiesInfo?.length === cernerFacilities.length
  const multiFacilities = cernerFacilities.length > 1

  const bullets: VABulletListText[] = cernerFacilities.map((facility: Facility) => ({
    variant: 'cernerPanelFacility',
    text: facility.name,
    a11yLabel: facility.name,
  }))

  const multipleFacilitiesBody = (
    <Box>
      <TextView variant="cernerPanelHeader" mb={theme.dimensions.standardMarginBetween}>
        {allCernerFacilities ? t('healthHelp.usesVAHealth.multi.all') : t('healthHelp.usesVAHealth.some')}
      </TextView>
      <TextView variant="cernerPanelSubtext" mb={theme.dimensions.standardMarginBetween}>
        {t('healthHelp.manageHealthCare.multi.both')}
      </TextView>
      <VABulletList listOfText={bullets} />
      <TextView variant="cernerPanelSubtext" mb={theme.dimensions.condensedMarginBetween}>
        {t('healthHelp.goToPortal.multi.both')}
      </TextView>
      {allCernerFacilities ? (
        <></>
      ) : (
        <TextView variant="cernerPanelSubtext" my={theme.dimensions.condensedMarginBetween}>
          {t('healthHelp.canStillUse.some')}
        </TextView>
      )}
    </Box>
  )

  const singleFacilityBody = (
    <Box>
      <TextView variant="cernerPanelHeader" mb={theme.dimensions.standardMarginBetween}>
        {allCernerFacilities ? t('healthHelp.usesVAHealth.single.all') : t('healthHelp.usesVAHealth.some')}
      </TextView>
      <TextView
        variant="cernerPanelSubtext"
        mb={theme.dimensions.standardMarginBetween}
        accessibilityLabel={a11yLabelVA(
          t('healthHelp.manageHealthCare.single.both.a11yLabel', {
            facilityName: cernerFacilities[0].name,
          }),
        )}>
        {t('healthHelp.manageHealthCare.single.both')}
        <TextView variant="cernerPanelFacility">{cernerFacilities[0].name}</TextView>
        {'?'}
      </TextView>
      <TextView variant="cernerPanelSubtext" mb={theme.dimensions.condensedMarginBetween}>
        {t('healthHelp.goToPortal.single.both')}
      </TextView>
      {allCernerFacilities ? (
        <></>
      ) : (
        <TextView variant="cernerPanelSubtext" my={theme.dimensions.condensedMarginBetween}>
          {t('healthHelp.canStillUse.some')}
        </TextView>
      )}
    </Box>
  )
  return (
    <LargePanel title={t('healthHelp.title')} rightButtonText={t('close')}>
      <Box
        mx={theme.dimensions.standardMarginBetween}
        mt={theme.dimensions.contentMarginTop}
        mb={theme.dimensions.formMarginBetween}>
        {multiFacilities ? multipleFacilitiesBody : singleFacilityBody}
        <LinkWithAnalytics
          type={'url'}
          url={LINK_URL_GO_TO_PATIENT_PORTAL}
          text={t('goToMyVAHealth')}
          a11yLabel={a11yLabelVA(t('goToMyVAHealth'))}
          testID={'goToMyVAHealthTestID'}
        />
      </Box>
    </LargePanel>
  )
}

export default HealthHelp
