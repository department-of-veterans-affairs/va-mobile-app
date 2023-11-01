import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement } from 'react'

import { Box, ClickToCallPhoneNumber, LargePanel, TextView, TextViewProps } from 'components'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { WEBVIEW_URL_CHANGE_LEGAL_NAME, WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type HowDoIUpdateScreenProps = StackScreenProps<HomeStackParamList, 'HowDoIUpdate'>

const HowDoIUpdateScreen: FC<HowDoIUpdateScreenProps> = ({ route }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { screenType } = route.params

  const linkProps: TextViewProps = {
    onPress: navigateTo('Webview', { url: WEBVIEW_URL_FACILITY_LOCATOR, displayTitle: t('webview.vagov'), loadingMessage: t('webview.valocation.loading') }),
    variant: 'MobileBody',
    color: 'link',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    accessibilityRole: 'link',
    accessibilityLabel: a11yLabelVA(t('howDoIUpdate.findYourNearestVAMedicalCenter')),
    accessibilityHint: t('howDoIUpdate.findYourNearestVAMedicalCenter.a11yHint'),
    paragraphSpacing: true,
  }

  const linkNameProps: TextViewProps = {
    onPress: navigateTo('Webview', { url: WEBVIEW_URL_CHANGE_LEGAL_NAME, displayTitle: t('webview.vagov'), loadingMessage: t('webview.changeLegalName.loading') }),
    variant: 'MobileBody',
    color: 'link',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    accessibilityRole: 'link',
    accessibilityLabel: a11yLabelVA(t('howDoIUpdate.learnToChangeLegalName')),
    paragraphSpacing: true,
  }

  const renderUI = (): ReactElement => {
    if (screenType === 'name') {
      return nameUpdateScreen()
    } else if (screenType === 'DOB') {
      return dateOfBirthUpdateScreen()
    } else {
      return <></>
    }
  }

  const renderVAMedicalCenterSection = (): ReactElement => {
    return (
      <Box>
        <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(t('howDoIUpdate.ifEnrolledInVAHealth'))} paragraphSpacing={true}>
          {t('howDoIUpdate.ifEnrolledInVAHealth')}
        </TextView>
        <TextView {...linkProps}>{t('howDoIUpdate.findYourNearestVAMedicalCenter')}</TextView>
        <TextView variant="MobileBody" accessibilityLabel={t('howDoIUpdate.ifNotEnrolledInVAHealth.a11yLabel')} paragraphSpacing={true}>
          {t('howDoIUpdate.ifNotEnrolledInVAHealth')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('8008271000')} a11yLabel={a11yLabelID(t('8008271000'))} displayedText={displayedTextPhoneNumber(t('8008271000'))} />
      </Box>
    )
  }

  const nameUpdateScreen = (): ReactElement => {
    return (
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('howDoIUpdate.name.title')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true}>
          {t('howDoIUpdate.name.legalName')}
        </TextView>
        <TextView {...linkNameProps}>{t('howDoIUpdate.learnToChangeLegalName')}</TextView>
        <TextView variant="MobileBody" paragraphSpacing={true}>
          {t('howDoIUpdate.name.incorrectRecords')}
        </TextView>
        {renderVAMedicalCenterSection()}
      </Box>
    )
  }

  const dateOfBirthUpdateScreen = (): ReactElement => {
    return (
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('howDoIUpdate.dateOfBirth.title')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true}>
          {t('howDoIUpdate.dateOfBirth.body')}
        </TextView>
        {renderVAMedicalCenterSection()}
      </Box>
    )
  }

  return (
    <LargePanel title={t('profile.help.title')} rightButtonText={t('close')}>
      {renderUI()}
    </LargePanel>
  )
}

export default HowDoIUpdateScreen
