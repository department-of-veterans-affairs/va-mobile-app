import { ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { AlertBox, Box, ButtonTypesConstants, ClickToCallPhoneNumber, TextView, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme, useTranslation } from 'utils/hooks'

export type CallHelpCenterProps = {
  /** optional function called when the Try again button is pressed */
  onTryAgain?: () => void
}

const CallHelpCenter: FC<CallHelpCenterProps> = ({ onTryAgain }) => {
  const t = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const scrollStyles: ViewStyle = {
    justifyContent: 'center',
    backgroundColor: theme.colors.background.main,
  }

  const containerStyles = {
    mx: theme.dimensions.gutter,
    mt: theme.dimensions.contentMarginTop,
    mb: theme.dimensions.contentMarginBottom,
  }

  const standardMarginBetween = theme.dimensions.standardMarginBetween

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" {...containerStyles}>
        <AlertBox title={t('errors.callHelpCenter.notWorking')} titleA11yLabel={t('errors.callHelpCenter.notWorking.a11yLabel')} border="error" background="noCardBackground">
          <Box>
            <TextView color="primary" variant="MobileBody" my={standardMarginBetween}>
              {onTryAgain ? t('errors.callHelpCenter.sorryWithRefresh') : t('errors.callHelpCenter.sorry')}
            </TextView>
            <TextView color="primary" variant="MobileBody" my={standardMarginBetween} accessibilityLabel={t('errors.callHelpCenter.informationLine.a11yLabel')}>
              {t('errors.callHelpCenter.informationLine')}
            </TextView>
            <ClickToCallPhoneNumber displayedText={t('errors.callHelpCenter.informationLine.numberDisplayed')} phone={t('errors.callHelpCenter.informationLine.number')} />
            {onTryAgain && (
              <Box mt={standardMarginBetween} accessibilityRole="button">
                <VAButton
                  onPress={onTryAgain}
                  label={t('tryAgain')}
                  buttonType={ButtonTypesConstants.buttonPrimary}
                  testID={t('tryAgain')}
                  a11yHint={t('errors.callHelpCenter.button.a11yHint')}
                />
              </Box>
            )}
          </Box>
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default CallHelpCenter
