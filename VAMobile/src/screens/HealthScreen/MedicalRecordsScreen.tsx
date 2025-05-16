import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate, LargeNavButton, LinkWithAnalytics, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { isIOS } from 'utils/platform'
import { featureEnabled } from 'utils/remoteConfig'
import { getWaygateToggles } from 'utils/waygateConfig'

import { HealthStackParamList } from './HealthStackScreens'

type MedicalRecordsScreenProps = StackScreenProps<HealthStackParamList, 'MedicalRecordsList'>

const { LINK_URL_MHV_VA_MEDICAL_RECORDS, SMHD_APPLE_STORE_LINK, SMHD_GOOGLE_PLAY_LINK } = getEnv()

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
      <Box mx={gutter}>
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView accessibilityLabel={a11yLabelVA(t('vaMedicalRecords.viewCompleteRecord'))}>
          {t('vaMedicalRecords.viewCompleteRecord')}
        </TextView>
      </Box>
      <Box mx={gutter} mb={theme.dimensions.standardMarginBetween}>
        <LinkWithAnalytics
          type="custom"
          onPress={() => {
            logAnalyticsEvent(Events.vama_webview(LINK_URL_MHV_VA_MEDICAL_RECORDS))
            navigateTo('Webview', {
              url: LINK_URL_MHV_VA_MEDICAL_RECORDS,
              displayTitle: t('webview.vagov'),
              loadingMessage: t('webview.medicalRecords.loading'),
              useSSO: true,
            })
          }}
          text={t('vaMedicalRecords.viewCompleteRecord.link')}
          a11yLabel={a11yLabelVA(t('vaMedicalRecords.viewCompleteRecord.link'))}
          testID="viewMedicalRecordsLinkID"
        />
      </Box>
      {featureEnabled('shareMyHealthDataLink') && (
        <>
          <Box mx={gutter}>
            <TextView>{t('vaMedicalRecords.shareMyHealthDataApp')}</TextView>
          </Box>
          <Box mx={gutter}>
            <LinkWithAnalytics
              type="url"
              url={isIOS() ? SMHD_APPLE_STORE_LINK : SMHD_GOOGLE_PLAY_LINK}
              text={t('vaMedicalRecords.shareMyHealthDataApp.link')}
              a11yLabel={t('vaMedicalRecords.shareMyHealthDataApp.link')}
              testID="shareMyHealthDataLinkID"
            />
          </Box>
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default MedicalRecordsScreen
