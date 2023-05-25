import { ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, ButtonTypesConstants, ClickToCallPhoneNumber, TextView, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { useTheme } from 'utils/hooks'

export type CallHelpCenterProps = {
  /** optional function called when the Try again button is pressed */
  onTryAgain?: () => void
  /** optional text for the title */
  titleText?: string
  /** optional title a11y hint*/
  titleA11yHint?: string
  /** optional text for the error */
  errorText?: string
  /** optional a11y hint for the error */
  errorA11y?: string
  /** optional phone number */
  callPhone?: string
}

/**A common component to show the help center contact info for when an error happens*/
const CallHelpCenter: FC<CallHelpCenterProps> = ({ onTryAgain, titleText, titleA11yHint, errorText, errorA11y, callPhone }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme() as VATheme

  const scrollStyles: ViewStyle = {
    justifyContent: 'center',
  }

  const containerStyles = {
    mt: theme.dimensions.contentMarginTop,
    mb: theme.dimensions.contentMarginBottom,
  }

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" {...containerStyles}>
        <AlertBox
          title={titleText ? titleText : t('errors.callHelpCenter.vaAppNotWorking')}
          titleA11yLabel={titleA11yHint ? titleA11yHint : t('errors.callHelpCenter.vaAppNotWorking')}
          text={onTryAgain ? t('errors.callHelpCenter.sorryWithRefresh') : t('errors.callHelpCenter.sorry')}
          border="error">
          <Box>
            <TextView
              variant="MobileBody"
              my={theme.dimensions.standardMarginBetween}
              accessibilityLabel={errorA11y ? errorA11y : t('errors.callHelpCenter.informationLine.a11yLabel')}>
              {errorText ? errorText : t('errors.callHelpCenter.informationLine')}
            </TextView>
            <ClickToCallPhoneNumber
              displayedText={callPhone ? undefined : t('errors.callHelpCenter.informationLine.numberDisplayed')}
              phone={callPhone ? callPhone : t('errors.callHelpCenter.informationLine.number')}
            />
            {onTryAgain && (
              <Box mt={theme.dimensions.standardMarginBetween} accessibilityRole="button">
                <VAButton
                  onPress={onTryAgain}
                  label={t('refresh')}
                  buttonType={ButtonTypesConstants.buttonPrimary}
                  testID={t('refresh')}
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
