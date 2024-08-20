import React, { FC } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { AlertWithHaptics, Box, ClickToCallPhoneNumber, VAScrollView } from 'components'
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
        <AlertWithHaptics
          variant="error"
          header={fixSpacingAndSpecialCharacters(titleText)}
          headerA11yLabel={titleA11y}
          description={fixSpacingAndSpecialCharacters(errorText)}
          descriptionA11yLabel={errorA11y}
          primaryButton={onTryAgain && { label: t('refresh'), onPress: tryAgain, testID: t('refresh') }}>
          {!!callPhone && <ClickToCallPhoneNumber a11yLabel={a11yLabelID(callPhone)} phone={callPhone} />}
        </AlertWithHaptics>
      </Box>
    </VAScrollView>
  )
}

export default CustomError
