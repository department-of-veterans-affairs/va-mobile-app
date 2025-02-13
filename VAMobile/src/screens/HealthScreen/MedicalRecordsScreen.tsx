import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate, LargeNavButton, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'

import { HealthStackParamList } from './HealthStackScreens'

type MedicalRecordsScreenProps = StackScreenProps<HealthStackParamList, 'MedicalRecordsList'>

const { LINK_URL_VA_MEDICAL_RECORDS } = getEnv()

const MedicalRecordsScreen = ({ navigation }: MedicalRecordsScreenProps) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { gutter } = theme.dimensions

  return (
    <FeatureLandingTemplate
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('vaMedicalRecords.title')}>
      <Box mb={theme.dimensions.standardMarginBetween}>
        <LargeNavButton
          title={t('labsAndTests.buttonTitle')}
          onPress={() => navigateTo('LabsAndTestsList')}
          testID="toLabsAndTestListID"
        />
        <LargeNavButton
          title={t('vaVaccines.buttonTitle')}
          onPress={() => navigateTo('VaccineList')}
          testID="toVaccineListID"
        />
        <LargeNavButton
          title={t('vaAllergies.buttonTitle')}
          onPress={() => navigateTo('AllergyList')}
          testID="toAllergyListID"
        />
      </Box>
      <Box mx={theme.dimensions.gutter}>
        <TextView variant={'HelperText'}>{`${t('vaMedicalRecords.viewCompleteRecord')}:`}</TextView>
      </Box>
      <Box mx={gutter}>
        <LinkWithAnalytics
          type="url"
          url={LINK_URL_VA_MEDICAL_RECORDS}
          text={t('vaMedicalRecords.viewCompleteRecord.link')}
          a11yLabel={a11yLabelVA(t('vaMedicalRecords.viewCompleteRecord'))}
          testID="viewMedicalRecordsLinkID"
        />
      </Box>
    </FeatureLandingTemplate>
  )
}

export default MedicalRecordsScreen
