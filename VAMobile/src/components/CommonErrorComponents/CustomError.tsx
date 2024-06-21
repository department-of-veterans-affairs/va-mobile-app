import React, { FC } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { AlertBox, Box, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'
import { fixedWhiteSpaceString } from 'utils/jsonFormatting'

export type CustomErrorProps = {
  /** optional function called when the Try again button is pressed */
  onTryAgain?: () => void
  /** optional text for the title */
  titleText?: string
  /** optional text for the error */
  errorText?: string
  /** optional phone number */
  callPhone?: string
}

/**A common component to show the help center contact info for when an error happens*/
const CustomError: FC<CustomErrorProps> = ({ onTryAgain, titleText, errorText, callPhone }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const titleA11y = a11yLabelVA(fixedWhiteSpaceString(titleText))
  const errorA11y = a11yLabelVA(fixedWhiteSpaceString(errorText))

  const scrollStyles: ViewStyle = {
    justifyContent: 'center',
  }

  const containerStyles = {
    mt: theme.dimensions.contentMarginTop,
    mb: theme.dimensions.contentMarginBottom,
  }
  useEffect(() => {
    logAnalyticsEvent(Events.vama_fail())
  }, [])

  const standardMarginBetween = theme.dimensions.standardMarginBetween

  const tryAgain = () => {
    logAnalyticsEvent(Events.vama_fail_refresh())
    if (onTryAgain) {
      onTryAgain()
    }
  }

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" {...containerStyles}>
        <AlertBox
          title={fixedWhiteSpaceString(titleText)}
          titleA11yLabel={titleA11y}
          text={onTryAgain ? t('errors.callHelpCenter.sorryWithRefresh') : t('errors.callHelpCenter.sorry')}
          border="error">
          <Box>
            <TextView
              variant="MobileBody"
              paragraphSpacing={true}
              mt={theme.paragraphSpacing.spacing20FontSize}
              accessibilityLabel={errorA11y}>
              {fixedWhiteSpaceString(errorText)}
            </TextView>
            <ClickToCallPhoneNumber a11yLabel={a11yLabelID(callPhone)} phone={callPhone} />
            {onTryAgain && (
              <Box mt={standardMarginBetween} accessibilityRole="button">
                <Button onPress={tryAgain} label={t('refresh')} testID={t('refresh')} />
              </Box>
            )}
          </Box>
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default CustomError
