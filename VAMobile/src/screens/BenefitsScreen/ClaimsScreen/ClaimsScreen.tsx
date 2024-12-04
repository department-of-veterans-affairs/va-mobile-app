import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate, LargeNavButton } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { useRouteNavigation, useTheme } from 'utils/hooks'

import { BenefitsStackParamList } from '../BenefitsStackScreens'

type ClaimsScreenProps = StackScreenProps<BenefitsStackParamList, 'Claims'>

const ClaimsScreen = ({ navigation }: ClaimsScreenProps) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const onClaimsHistory = () => {
    navigateTo('ClaimsHistoryScreen')
  }

  const onClaimLettersPress = () => {
    logAnalyticsEvent(Events.vama_ddl_landing_click())
    navigateTo('ClaimLettersScreen')
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('benefits.title')}
      backLabelA11y={t('back.a11yLabel', { screenName: t('benefits.title') })}
      backLabelOnPress={navigation.goBack}
      title={t('claims.title')}>
      <Box mb={theme.dimensions.standardMarginBetween}>
        <LargeNavButton title={t('claimsHistory.title')} onPress={onClaimsHistory} testID="toClaimsHistoryID" />
        <LargeNavButton title={t('claimLetters.title')} onPress={onClaimLettersPress} testID="toClaimLettersID" />
      </Box>
    </FeatureLandingTemplate>
  )
}

export default ClaimsScreen
