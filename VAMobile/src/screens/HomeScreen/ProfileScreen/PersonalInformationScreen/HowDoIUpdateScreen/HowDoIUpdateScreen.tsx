import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement } from 'react'

import { Box, ClickToCallPhoneNumber, LargePanel, TextView, TextViewProps } from 'components'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation } from 'utils/hooks'
import { useTheme } from 'utils/hooks/useTheme'
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
    accessibilityLabel: t('howDoIUpdate.findYourNearestVAMedicalCenter.a11yLabel'),
    accessibilityHint: t('howDoIUpdate.findYourNearestVAMedicalCenter.a11yHint'),
    my: theme.dimensions.standardMarginBetween,
  }

  const linkNameProps: TextViewProps = {
    onPress: navigateTo('Webview', { url: WEBVIEW_URL_CHANGE_LEGAL_NAME, displayTitle: t('webview.vagov'), loadingMessage: t('webview.changeLegalName.loading') }),
    variant: 'MobileBody',
    color: 'link',
    textDecoration: 'underline',
    textDecorationColor: 'link',
    accessibilityRole: 'link',
    accessibilityLabel: t('howDoIUpdate.learnToChangeLegalName.a11yLabel'),
    accessibilityHint: t('howDoIUpdate.learnToChangeLegalName.a11yHint'),
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
        <TextView variant="MobileBody" accessibilityLabel={t('howDoIUpdate.ifEnrolledInVAHealth.a11yLabel')}>
          {t('howDoIUpdate.ifEnrolledInVAHealth')}
        </TextView>
        <TextView {...linkProps}>{t('howDoIUpdate.findYourNearestVAMedicalCenter')}</TextView>
        <TextView variant="MobileBody" accessibilityLabel={t('howDoIUpdate.ifNotEnrolledInVAHealth.a11yLabel')}>
          {t('howDoIUpdate.ifNotEnrolledInVAHealth')}
        </TextView>
        <ClickToCallPhoneNumber phone={t('howDoIUpdate.profileNumber')} a11yLabel={t('howDoIUpdate.profileNumber.a11yLabel')} />
      </Box>
    )
  }

  const nameUpdateScreen = (): ReactElement => {
    return (
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('howDoIUpdate.name.title')}
        </TextView>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('howDoIUpdate.name.legalName')}
        </TextView>
        <TextView {...linkNameProps}>{t('howDoIUpdate.learnToChangeLegalName')}</TextView>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('howDoIUpdate.name.incorrectRecords')}
        </TextView>
        {renderVAMedicalCenterSection()}
      </Box>
    )
  }

  const dateOfBirthUpdateScreen = (): ReactElement => {
    return (
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('howDoIUpdate.dateOfBirth.title')}
        </TextView>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
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
