import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import { Box, LargePanel, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { useTheme } from 'utils/hooks'

type ConsolidatedClaimsNoteProps = StackScreenProps<BenefitsStackParamList, 'ConsolidatedClaimsNote'>

function ConsolidatedClaimsNote({}: ConsolidatedClaimsNoteProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel
      title={t('claimDetails.claimsHelp.pageTitle')}
      rightButtonText={t('close')}
      rightButtonTestID="claimsWhyCombineCloseID">
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('claimDetails.whyWeCombinePanel')}
        </TextView>
        <TextView variant="MobileBody">{t('claimDetails.consolidatedClaims.noteContent')}</TextView>
      </Box>
    </LargePanel>
  )
}

export default ConsolidatedClaimsNote
