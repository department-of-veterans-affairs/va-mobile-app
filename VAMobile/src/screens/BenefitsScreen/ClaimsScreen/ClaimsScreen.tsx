import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React from 'react'

import { BenefitsStackParamList } from '../BenefitsStackScreens'
import { Box, FeatureLandingTemplate, LargeNavButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type ClaimsScreenProps = StackScreenProps<BenefitsStackParamList, 'Claims'>

const ClaimsScreen = ({ navigation }: ClaimsScreenProps) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

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
          onPress={navigateTo('ClaimLettersScreen')}
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
