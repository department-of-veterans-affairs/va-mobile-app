import { ScrollView, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { AlertBox, Box, ClickForActionLink, LinkTypeOptionsConstants, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

export type CallHelpCenterProps = {
  /** optional function called when the Try again button is pressed */
  onTryAgain?: () => void
}

const CallHelpCenter: FC<CallHelpCenterProps> = ({ onTryAgain }) => {
  const t = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.main,
  }

  const containerStyles = {
    flex: 1,
    mx: theme.dimensions.gutter,
    mt: theme.dimensions.contentMarginTop,
    mb: theme.dimensions.contentMarginBottom,
  }

  const marginBetween = theme.dimensions.marginBetween

  return (
    <ScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" {...containerStyles}>
        <AlertBox title={t('errors.callHelpCenter.notWorking')} border="error" background="noCardBackground">
          <Box>
            <TextView color="primary" variant="MobileBody" my={marginBetween}>
              {t('errors.callHelpCenter.sorry')}
            </TextView>
            <TextView color="primary" variant="MobileBody" my={marginBetween} accessibilityLabel={t('errors.callHelpCenter.informationLine.a11yLabel')}>
              {t('errors.callHelpCenter.informationLine')}
            </TextView>
            <ClickForActionLink
              displayedText={t('errors.callHelpCenter.informationLine.numberDisplayed')}
              numberOrUrlLink={t('errors.callHelpCenter.informationLine.number')}
              linkType={LinkTypeOptionsConstants.call}
              {...a11yHintProp(t('errors.callHelpCenter.a11yHint'))}
            />
            <TextView color="primary" variant="MobileBody" my={marginBetween}>
              {t('errors.callHelpCenter.tty')}
            </TextView>
            <ClickForActionLink
              displayedText={t('errors.callHelpCenter.tty.number')}
              numberOrUrlLink={t('errors.callHelpCenter.tty.number')}
              linkType={LinkTypeOptionsConstants.call}
              {...a11yHintProp(t('errors.callHelpCenter.a11yHint'))}
            />
            {onTryAgain && (
              <Box mt={marginBetween} accessibilityRole="button">
                <VAButton onPress={onTryAgain} label={t('tryAgain')} textColor="primaryContrast" backgroundColor="button" a11yHint={t('errors.callHelpCenter.button.a11yHint')} />
              </Box>
            )}
          </Box>
        </AlertBox>
      </Box>
    </ScrollView>
  )
}

export default CallHelpCenter
