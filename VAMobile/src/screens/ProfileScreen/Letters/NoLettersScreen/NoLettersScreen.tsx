import { ScrollView } from 'react-native'
import React, { FC } from 'react'

import { Box, ClickForActionLink, TextView } from 'components'
import { NAMESPACE } from '../../../../constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

const NoLettersScreen: FC = () => {
  const t = useTranslation(NAMESPACE.PROFILE)
  const theme = useTheme()

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} {...testIdProps('No-letters-screen')}>
      <Box justifyContent="center" mx={theme.dimensions.marginBetween} alignItems="center">
        <TextView variant="MobileBodyBold" textAlign={'center'} accessibilityRole="header">
          {t('noLetters.header')}
        </TextView>
        <TextView variant="MobileBody" textAlign={'center'} py={theme.dimensions.noLettersPaddingY}>
          {t('noLetters.ifYouThink')}
        </TextView>
        <ClickForActionLink
          displayedText={t('noLetters.benefitsAndServicesNumberDisplayed')}
          numberOrUrlLink={t('noLetters.benefitsAndServicesNumber')}
          linkType="call"
          {...a11yHintProp(t('noLetters.benefitsAndServicesNumberHint'))}
        />
      </Box>
    </ScrollView>
  )
}

export default NoLettersScreen
