import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate, LargeNavButton, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { getWaygateToggles } from 'utils/waygateConfig'

import { HealthStackParamList } from './HealthStackScreens'

type MedicalRecordsScreenProps = StackScreenProps<HealthStackParamList, 'MedicalRecordsList'>

const { LINK_URL_MHV_VA_MEDICAL_RECORDS } = getEnv()

const MedicalRecordsScreen = ({ navigation }: MedicalRecordsScreenProps) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  // This will hide the allergies button if the toggle is enabled
  // Yes its backwards, but its so we can roll this back once we release
  // This toggle should be removed once the feature is stable
  const { WG_AllergyListDisabled } = getWaygateToggles()
  const hideAllergies = WG_AllergyListDisabled?.enabled

  return (
    <FeatureLandingTemplate
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('vaMedicalRecords.title')}>
      <Box mb={theme.dimensions.standardMarginBetween}>
        <LargeNavButton
          title={t('vaVaccines.buttonTitle')}
          onPress={() => navigateTo('VaccineList')}
          testID="toVaccineListID"
        />
        {!hideAllergies && (
          <LargeNavButton
            title={t('vaAllergies.buttonTitle')}
            onPress={() => navigateTo('AllergyList')}
            testID="toAllergyListID"
          />
        )}
      </Box>
      <Box mx={theme.dimensions.gutter}>
        <TextView>
          <LinkWithAnalytics
            type="url"
            icon="no icon"
            url={LINK_URL_MHV_VA_MEDICAL_RECORDS}
            text={t('vaMedicalRecords.viewCompleteRecord.link')}
            a11yLabel={a11yLabelVA(t('vaMedicalRecords.viewCompleteRecord.link'))}
            testID="viewMedicalRecordsLinkID"
          />
        </TextView>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default MedicalRecordsScreen
