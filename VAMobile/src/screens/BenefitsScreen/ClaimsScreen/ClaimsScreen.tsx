import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React from 'react'

import { BenefitsStackParamList } from '../BenefitsStackScreens'
import { Box, FeatureLandingTemplate, LargeNavButton } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { logAnalyticsEvent } from 'utils/analytics'
import { useRouteNavigation } from 'utils/hooks'
import { useTheme } from 'styled-components'

type ClaimsScreenProps = StackScreenProps<BenefitsStackParamList, 'Claims'>

const ClaimsScreen = ({ navigation }: ClaimsScreenProps) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme() as VATheme
  const navigateTo = useRouteNavigation()

  const onClaimLettersPress = () => {
    logAnalyticsEvent(Events.vama_ddl_landing_click())
    navigateTo('ClaimLettersScreen')()
  }

  return (
    <FeatureLandingTemplate backLabel={t('benefits.title')} backLabelOnPress={navigation.goBack} title={t('claims.title')}>
      <Box mb={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter}>
        <LargeNavButton
          title={t('claimsHistory.title')}
          onPress={navigateTo('ClaimsHistory')}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
        <LargeNavButton
          title={t('claimLetters.title')}
          onPress={onClaimLettersPress}
          borderWidth={theme.dimensions.buttonBorderWidth}
          borderColor={'secondary'}
          borderColorActive={'primaryDarkest'}
          borderStyle={'solid'}
        />
      </Box>
    </FeatureLandingTemplate>
  )
}

export default ClaimsScreen
