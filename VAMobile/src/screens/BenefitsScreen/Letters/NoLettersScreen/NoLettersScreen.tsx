import { ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

const NoLettersScreen: FC = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }

  return (
    <VAScrollView contentContainerStyle={scrollStyles} {...testIdProps('Letters: No-letters-page')}>
      <Box justifyContent="center" mx={theme.dimensions.gutter} alignItems="center">
        <TextView variant="MobileBodyBold" accessibilityLabel={a11yLabelVA(t('noLetters.header'))} textAlign={'center'} accessibilityRole="header">
          {t('noLetters.header')}
        </TextView>
        <TextView variant="MobileBody" textAlign={'center'} paragraphSpacing={true}>
          {t('noLetters.ifYouThink')}
        </TextView>
        <ClickToCallPhoneNumber center={true} phone={t('8008271000')} displayedText={displayedTextPhoneNumber(t('8008271000'))} />
      </Box>
    </VAScrollView>
  )
}

export default NoLettersScreen
