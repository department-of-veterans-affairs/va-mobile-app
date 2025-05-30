import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Box, ClickToCallPhoneNumber, LargePanel, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

const { WEBVIEW_URL_CHANGE_LEGAL_NAME, WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type HowDoIUpdateScreenProps = StackScreenProps<HomeStackParamList, 'HowDoIUpdate'>

function HowDoIUpdateScreen({ route }: HowDoIUpdateScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { screenType } = route.params

  function renderUI() {
    if (screenType === 'name') {
      return nameUpdateScreen()
    } else if (screenType === 'DOB') {
      return dateOfBirthUpdateScreen()
    } else {
      return <></>
    }
  }

  function renderVAMedicalCenterSection() {
    return (
      <Box>
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView
          variant="MobileBody"
          accessibilityLabel={a11yLabelVA(t('howDoIUpdate.ifEnrolledInVAHealth'))}
          my={theme.dimensions.standardMarginBetween}>
          {t('howDoIUpdate.ifEnrolledInVAHealth')}
        </TextView>
        <LinkWithAnalytics
          type="url"
          url={WEBVIEW_URL_FACILITY_LOCATOR}
          text={t('howDoIUpdate.findYourNearestVAMedicalCenter')}
          a11yLabel={a11yLabelVA(t('howDoIUpdate.findYourNearestVAMedicalCenter'))}
          a11yHint={t('howDoIUpdate.findYourNearestVAMedicalCenter.a11yHint')}
          testID="findNearestVAMedicalCenterID"
        />
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView
          variant="MobileBody"
          accessibilityLabel={t('howDoIUpdate.ifNotEnrolledInVAHealth.a11yLabel')}
          my={theme.dimensions.standardMarginBetween}>
          {t('howDoIUpdate.ifNotEnrolledInVAHealth')}
        </TextView>
        <ClickToCallPhoneNumber
          phone={t('8008271000')}
          a11yLabel={a11yLabelID(t('8008271000'))}
          displayedText={displayedTextPhoneNumber(t('8008271000'))}
        />
      </Box>
    )
  }

  function nameUpdateScreen() {
    return (
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('howDoIUpdate.name.title')}
        </TextView>
        <TextView
          variant="MobileBody"
          mt={theme.dimensions.condensedMarginBetween}
          mb={theme.dimensions.standardMarginBetween}>
          {t('howDoIUpdate.name.legalName')}
        </TextView>
        <LinkWithAnalytics
          type="url"
          url={WEBVIEW_URL_CHANGE_LEGAL_NAME}
          text={t('howDoIUpdate.learnToChangeLegalName')}
          a11yLabel={a11yLabelVA(t('howDoIUpdate.learnToChangeLegalName'))}
          testID="learnToChangeLegalNameID"
        />
        <TextView
          variant="MobileBody"
          mt={theme.dimensions.standardMarginBetween}
          mb={theme.dimensions.condensedMarginBetween}>
          {t('howDoIUpdate.name.incorrectRecords')}
        </TextView>
        {renderVAMedicalCenterSection()}
      </Box>
    )
  }

  function dateOfBirthUpdateScreen() {
    return (
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('howDoIUpdate.dateOfBirth.title')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.condensedMarginBetween}>
          {t('howDoIUpdate.dateOfBirth.body')}
        </TextView>
        {renderVAMedicalCenterSection()}
      </Box>
    )
  }

  return (
    <LargePanel
      title={t('profile.help.title')}
      rightButtonText={t('close')}
      testID="howDoIUpdateTestID"
      rightButtonTestID="howDoIUpdateCloseTestID">
      {renderUI()}
    </LargePanel>
  )
}

export default HowDoIUpdateScreen
