import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickForActionLink, LargePanel, LinkTypeOptionsConstants, TextView } from 'components'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelID } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type IncorrectServiceInfoScreenProps = StackScreenProps<HomeStackParamList, 'IncorrectServiceInfo'>

/**
 * View for What If screen
 *
 * Returns incorrectServiceInfoScreen component
 */
const IncorrectServiceInfo: FC<IncorrectServiceInfoScreenProps> = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  return (
    <LargePanel title={t('profile.help.title')} rightButtonText={t('close')} testID="IncorrectServiceTestID">
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('militaryInformation.incorrectServiceInfo')}
        </TextView>
        <TextView
          accessibilityLabel={t('militaryInformation.incorrectServiceInfo.bodyA11yLabel.1')}
          variant="MobileBody"
          mt={theme.dimensions.standardMarginBetween}
          paragraphSpacing={true}>
          {t('militaryInformation.incorrectServiceInfo.body.1')}
        </TextView>
        <TextView accessibilityLabel={t('militaryInformation.incorrectServiceInfo.bodyA11yLabel.2')} variant="MobileBody" paragraphSpacing={true}>
          {t('militaryInformation.incorrectServiceInfo.body.2')}
        </TextView>
        <TextView accessibilityLabel={t('militaryInformation.incorrectServiceInfo.bodyA11yLabel.3')} variant="MobileBody" paragraphSpacing={true}>
          {t('militaryInformation.incorrectServiceInfo.body.3')}
        </TextView>
        <ClickForActionLink
          testID="incorrectServiceDMDCNumberTestID"
          displayedText={displayedTextPhoneNumber(t('8005389552'))}
          a11yLabel={a11yLabelID(t('8005389552'))}
          numberOrUrlLink={t('8005389552')}
          linkType={LinkTypeOptionsConstants.call}
        />
      </Box>
    </LargePanel>
  )
}

export default IncorrectServiceInfo
