import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, ClickForActionLink, LargePanel, LinkTypeOptionsConstants, TextView } from 'components'
import { HiddenTitle } from 'styles/common'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

type IncorrectServiceInfoScreenProps = StackScreenProps<HomeStackParamList, 'IncorrectServiceInfo'>

/**
 * View for What If screen
 *
 * Returns incorrectServiceInfoScreen component
 */
const IncorrectServiceInfo: FC<IncorrectServiceInfoScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme() as VATheme

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HiddenTitle accessibilityLabel={t('militaryInformation.incorrectServiceInfo.header')} accessibilityRole="header">
          {t('militaryInformation.incorrectServiceInfo.header')}
        </HiddenTitle>
      ),
    })
  })

  return (
    <LargePanel title={t('profile.help.title')} rightButtonText={t('close')} testID="IncorrectServiceTestID">
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('militaryInformation.incorrectServiceInfo')}
        </TextView>
        <TextView {...testIdProps(t('militaryInformation.incorrectServiceInfo.bodyA11yLabel'))} variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('militaryInformation.incorrectServiceInfo.body')}
        </TextView>
        <ClickForActionLink
          testID="incorrectServiceDMDCNumberTestID"
          displayedText={t('militaryInformation.incorrectServiceInfo.DMDCNumberDisplayed')}
          a11yLabel={t('militaryInformation.incorrectServiceInfo.DMDCNumberDisplayed.a11yLabel')}
          numberOrUrlLink={t('militaryInformation.incorrectServiceInfo.DMDCNumber')}
          linkType={LinkTypeOptionsConstants.call}
          {...a11yHintProp(t('militaryInformation.incorrectServiceInfo.DMDCNumber.a11yHint'))}
        />
      </Box>
    </LargePanel>
  )
}

export default IncorrectServiceInfo
