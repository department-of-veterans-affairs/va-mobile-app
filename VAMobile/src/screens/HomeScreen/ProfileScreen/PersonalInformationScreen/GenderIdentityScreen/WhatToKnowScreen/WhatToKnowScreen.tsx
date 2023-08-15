import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, LargePanel, TextView, TextViewProps } from 'components'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type WhatToKnowScreenProps = StackScreenProps<HomeStackParamList, 'WhatToKnow'>

const WhatToKnowScreen: FC<WhatToKnowScreenProps> = () => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const bodyTextProps: TextViewProps = {
    variant: 'MobileBody',
  }

  return (
    <LargePanel title={t('profile.help.title')} rightButtonText={t('close')}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('personalInformation.genderIdentity.whatToKnow.title')}
        </TextView>
        <TextView {...bodyTextProps} mt={theme.dimensions.standardMarginBetween} paragraphSpacing={true}>
          {t('personalInformation.genderIdentity.whatToKnow.ReasonsToShare')}
        </TextView>
        <TextView {...bodyTextProps} paragraphSpacing={true}>
          {t('personalInformation.genderIdentity.whatToKnow.whoCanAccess')}
        </TextView>
        <TextView {...bodyTextProps}>{t('personalInformation.genderIdentity.whatToKnow.privacy')}</TextView>
      </Box>
    </LargePanel>
  )
}

export default WhatToKnowScreen
