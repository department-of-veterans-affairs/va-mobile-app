import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate, LargeNavButton, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'
import { getWaygateToggles } from 'utils/waygateConfig'

import { HealthStackParamList } from './HealthStackScreens'

type MedicalRecordsScreenProps = StackScreenProps<HealthStackParamList, 'MedicalRecordsList'>

const { LINK_URL_MHV_VA_MEDICAL_RECORDS } = getEnv()

const MedicalRecordsScreen = ({ navigation }: MedicalRecordsScreenProps) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { gutter } = theme.dimensions

  const { WG_LabsAndTestsEnabled } = getWaygateToggles()
  const isLabsAndTestsEnabled = WG_LabsAndTestsEnabled?.enabled

  return (
    <FeatureLandingTemplate
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('vaMedicalRecords.title')}>
      <Box mb={theme.dimensions.standardMarginBetween}>
        {isLabsAndTestsEnabled && (
          <LargeNavButton
            title={t('labsAndTests.buttonTitle')}
            onPress={() => navigateTo('LabsAndTestsList')}
            testID="toLabsAndTestListID"
          />
        )}
        <LargeNavButton
          title={t('vaVaccines.buttonTitle')}
          onPress={() => navigateTo('VaccineList')}
          testID="toVaccineListID"
        />
        {featureEnabled('allergies') && (
          <LargeNavButton
            title={t('vaAllergies.buttonTitle')}
            onPress={() => navigateTo('AllergyList')}
            testID="toAllergyListID"
          />
        )}
      </Box>
      <Box mx={theme.dimensions.gutter}>
        <TextView accessibilityLabel={a11yLabelVA(t('vaMedicalRecords.viewCompleteRecord'))}>
          {t('vaMedicalRecords.viewCompleteRecord')}
        </TextView>
      </Box>
      <Box mx={gutter}>
        <LinkWithAnalytics
          type="url"
          url={LINK_URL_MHV_VA_MEDICAL_RECORDS}
          text={t('vaMedicalRecords.viewCompleteRecord.link')}
          a11yLabel={a11yLabelVA(t('vaMedicalRecords.viewCompleteRecord.link'))}
          testID="viewMedicalRecordsLinkID"
        />
      </Box>
    </FeatureLandingTemplate>
  )
}

export default MedicalRecordsScreen
