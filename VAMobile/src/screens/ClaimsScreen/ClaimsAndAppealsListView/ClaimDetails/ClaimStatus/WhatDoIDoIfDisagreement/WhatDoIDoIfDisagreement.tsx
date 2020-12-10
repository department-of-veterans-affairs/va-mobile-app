import { Box, TextArea, TextView } from 'components'
import { ClaimsStackParamList } from '../../../../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTheme, useTranslation } from 'utils/hooks'
import React, { FC, useEffect } from 'react'

type WhatDoIDoIfDisagreementProps = StackScreenProps<ClaimsStackParamList, 'WhatDoIDoIfDisagreement'>

const WhatDoIDoIfDisagreement: FC<WhatDoIDoIfDisagreementProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <TextView accessibilityLabel={t('claimDetails.whatDoIDoIfDisagreement.pageTitle')} accessibilityRole="header" />,
    })
  })

  return (
    <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
      <TextArea>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('claimsDetails.whatDoIDoIfDisagreement.header')}
        </TextView>
        <TextView variant="MobileBody">{t('claimsDetails.whatDoIDoIfDisagreement.content')}</TextView>
        <TextView variant="MobileBodyLink" color="link" mt={theme.dimensions.marginBetween} accessibilityRole="link">
          {t('claimsDetails.whatDoIDoIfDisagreement.learnAboutDecisionReview')}
        </TextView>
      </TextArea>
    </Box>
  )
}

export default WhatDoIDoIfDisagreement
