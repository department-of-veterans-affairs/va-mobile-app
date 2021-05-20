import { ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { AlertBox, Box, ButtonTypesConstants, ClickToCallPhoneNumber, TextView, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VAAlertBoxColors } from 'styles/theme'
import { useTheme, useTranslation } from 'utils/hooks'

export type CallHelpCenterProps = {
  /** optional function called when the Try again button is pressed */
  onTryAgain?: () => void
  background?: keyof VAAlertBoxColors
  title?: string
  titleA11y?: string
  errorText?: string
  errorA11y?: string
  callPhone?: string
}

const CallHelpCenter: FC<CallHelpCenterProps> = ({ onTryAgain, background, title, titleA11y, errorText, errorA11y, callPhone }) => {
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
        <AlertBox
          title={title ? title : t('errors.callHelpCenter.notWorking')}
          titleA11yLabel={titleA11y ? titleA11y : t('errors.callHelpCenter.notWorking.a11yLabel')}
          text={onTryAgain ? t('errors.callHelpCenter.sorryWithRefresh') : t('errors.callHelpCenter.sorry')}
          border="error"
          background={background ? background : 'noCardBackground'}>
          <Box>
            <TextView
              color="primary"
              variant="MobileBody"
              my={standardMarginBetween}
              accessibilityLabel={errorA11y ? errorA11y : t('errors.callHelpCenter.informationLine.a11yLabel')}>
              {errorText ? errorText : t('errors.callHelpCenter.informationLine')}
            </TextView>
            <ClickToCallPhoneNumber
              displayedText={callPhone ? undefined : t('errors.callHelpCenter.informationLine.numberDisplayed')}
              phone={callPhone ? callPhone : t('errors.callHelpCenter.informationLine.number')}
            />
            {onTryAgain && (
              <Box mt={standardMarginBetween} accessibilityRole="button">
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
