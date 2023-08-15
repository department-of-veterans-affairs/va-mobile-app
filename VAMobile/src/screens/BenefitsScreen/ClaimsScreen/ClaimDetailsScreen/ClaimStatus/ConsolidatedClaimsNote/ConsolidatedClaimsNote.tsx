import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Box, LargePanel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type ConsolidatedClaimsNoteProps = StackScreenProps<BenefitsStackParamList, 'ConsolidatedClaimsNote'>

const ConsolidatedClaimsNote: FC<ConsolidatedClaimsNoteProps> = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel title={t('claimDetails.claimsHelp.pageTitle')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('claimDetails.consolidatedClaims.noteHeader')}
        </TextView>
        <TextView variant="MobileBody">{t('claimDetails.consolidatedClaims.noteContent')}</TextView>
      </Box>
    </LargePanel>
  )
}

export default ConsolidatedClaimsNote
