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

  const bullets: VABulletListText[] = cernerFacilities.map((facility: Facility) => ({
    variant: 'MobileBody',
    text: facility.name,
    a11yLabel: a11yLabelVA(facility.name),
  }))

  return (
    <LargePanel title={t('healthHelp.title')} rightButtonText={t('close')}>
      <Box
        mx={theme.dimensions.standardMarginBetween}
        mt={theme.dimensions.contentMarginTop}
        mb={theme.dimensions.formMarginBetween}>
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView
          variant="MobileBodyBold"
          accessibilityRole="header"
          accessibilityLabel={a11yLabelVA(t('healthHelp.usesVAHealth'))}
          mb={theme.dimensions.standardMarginBetween}>
          {t('healthHelp.usesVAHealth')}
        </TextView>
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView
          variant="MobileBody"
          accessibilityLabel={a11yLabelVA(t('healthHelp.goToPortal'))}
          mb={theme.dimensions.condensedMarginBetween}>
          {t('healthHelp.goToPortal')}
        </TextView>
        <VABulletList listOfText={bullets} paragraphSpacing={true} />
        <Box mb={allCernerFacilities ? undefined : theme.dimensions.standardMarginBetween}>
          <LinkWithAnalytics
            type={'url'}
            url={LINK_URL_GO_TO_PATIENT_PORTAL}
            text={t('goToMyVAHealth')}
            a11yLabel={a11yLabelVA(t('goToMyVAHealth'))}
            testID={'goToMyVAHealthTestID'}
          />
        </Box>
        {allCernerFacilities ? (
          <></>
        ) : (
          // eslint-disable-next-line react-native-a11y/has-accessibility-hint
          <TextView
            variant="MobileBody"
            accessibilityLabel={a11yLabelVA(t('healthHelp.canStillUse'))}
            my={theme.dimensions.condensedMarginBetween}>
            {t('healthHelp.canStillUse')}
          </TextView>
        )}
      </Box>
    </LargePanel>
  )
}

export default HealthHelp
