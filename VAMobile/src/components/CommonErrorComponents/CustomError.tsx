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
import { fixSpecialCharacters, fixedWhiteSpaceString } from 'utils/jsonFormatting'

export type CustomErrorProps = {
  /** optional function called when the Try again button is pressed */
  onTryAgain?: () => void
  /** text for the title */
  titleText: string
  /** text for the error */
  errorText: string
  /** optional phone number */
  callPhone?: string
}

/**A common component to show the help center contact info for when an error happens*/
const CustomError: FC<CustomErrorProps> = ({ onTryAgain, titleText, errorText, callPhone }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const scrollStyles: ViewStyle = {
    justifyContent: 'center',
  }

  const containerStyles = {
    mt: theme.dimensions.contentMarginTop,
    mb: theme.dimensions.contentMarginBottom,
  }
  useEffect(() => {
    logAnalyticsEvent(Events.vama_be_af_shown())
  }, [])

  const standardMarginBetween = theme.dimensions.standardMarginBetween

  const fixSpacingAndSpecialCharacters = (text: string) => {
    return fixedWhiteSpaceString(fixSpecialCharacters(text))
  }

  const titleA11y = a11yLabelVA(fixSpacingAndSpecialCharacters(titleText))
  const errorA11y = a11yLabelVA(fixSpacingAndSpecialCharacters(errorText))

  const tryAgain = () => {
    logAnalyticsEvent(Events.vama_be_af_refresh())
    if (onTryAgain) {
      onTryAgain()
    }
  }

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" {...containerStyles}>
        <AlertBox title={fixSpacingAndSpecialCharacters(titleText)} titleA11yLabel={titleA11y} border="error">
          <Box>
            <TextView
              variant="MobileBody"
              paragraphSpacing={true}
              mt={theme.dimensions.standardMarginBetween}
              accessibilityLabel={errorA11y}>
              {fixSpacingAndSpecialCharacters(errorText)}
            </TextView>
            {!!callPhone && <ClickToCallPhoneNumber a11yLabel={a11yLabelID(callPhone)} phone={callPhone} />}
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
