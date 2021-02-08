import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect } from 'react'

import { Box, TextArea, TextView } from 'components'
import { ClaimsStackParamList } from '../../../ClaimsStackScreens'
import { HiddenTitle } from 'styles/common'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type ConsolidatedClaimsNoteProps = StackScreenProps<ClaimsStackParamList, 'ConsolidatedClaimsNote'>

const ConsolidatedClaimsNote: FC<ConsolidatedClaimsNoteProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HiddenTitle accessibilityLabel={t('claimDetails.consolidatedClaims.pageTitle')} accessibilityRole="header">
          {t('claimDetails.consolidatedClaims.pageTitle')}
        </HiddenTitle>
      ),
    })
  })

  return (
    <ScrollView {...testIdProps(t('claimDetails.consolidatedClaims.pageTitle'))}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('claimDetails.consolidatedClaims.noteHeader')}
          </TextView>
          <TextView variant="MobileBody">{t('claimDetails.consolidatedClaims.noteContent')}</TextView>
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default ConsolidatedClaimsNote
