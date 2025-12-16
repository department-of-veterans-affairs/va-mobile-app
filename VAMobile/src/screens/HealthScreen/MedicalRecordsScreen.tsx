import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { Box, FeatureLandingTemplate, LargeNavButton, LinkWithAnalytics, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { CONNECTION_STATUS } from 'constants/offline'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useOfflineSnackbar, useRouteNavigation, useTheme } from 'utils/hooks'
import { useAppIsOnline } from 'utils/hooks/offline'
import { isIOS } from 'utils/platform'
import { featureEnabled } from 'utils/remoteConfig'
import { vaGovWebviewTitle } from 'utils/webview'

type MedicalRecordsScreenProps = StackScreenProps<HealthStackParamList, 'MedicalRecordsList'>

const { LINK_URL_MHV_VA_MEDICAL_RECORDS, SMHD_APPLE_STORE_LINK, SMHD_GOOGLE_PLAY_LINK } = getEnv()

const MedicalRecordsScreen = ({ navigation }: MedicalRecordsScreenProps) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { gutter } = theme.dimensions
  const connectionStatus = useAppIsOnline()
  const showOfflineSnackbar = useOfflineSnackbar()

  const { data: authorizedServices } = useAuthorizedServices()

  return (
    <FeatureLandingTemplate
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('vaMedicalRecords.title')}>
      <Box mb={theme.dimensions.standardMarginBetween}>
        {featureEnabled('labsAndTests') && authorizedServices?.labsAndTestsEnabled && (
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
        <LargeNavButton
          title={t('vaAllergies.buttonTitle')}
          onPress={() => navigateTo('AllergyList')}
          testID="toAllergyListID"
        />
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
            if (connectionStatus === CONNECTION_STATUS.DISCONNECTED) {
              showOfflineSnackbar()
              return
            }

            logAnalyticsEvent(Events.vama_webview(LINK_URL_MHV_VA_MEDICAL_RECORDS))
            navigateTo('Webview', {
              url: LINK_URL_MHV_VA_MEDICAL_RECORDS,
              displayTitle: vaGovWebviewTitle(t),
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
