import React, { FC } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { AlertWithHaptics, Box, ClickToCallPhoneNumber, TextView, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
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
const CallHelpCenter: FC<CallHelpCenterProps> = ({
  onTryAgain,
  titleText,
  titleA11yHint,
  errorText,
  errorA11y,
  callPhone,
}) => {
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
    logAnalyticsEvent(Events.vama_fail())
  }, [])

  const tryAgain = () => {
    logAnalyticsEvent(Events.vama_fail_refresh())
    if (onTryAgain) {
      onTryAgain()
    }
  }

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box justifyContent="center" {...containerStyles}>
        <AlertWithHaptics
          variant="error"
          header={titleText ? titleText : t('errors.callHelpCenter.vaAppNotWorking')}
          headerA11yLabel={titleA11yHint ? titleA11yHint : a11yLabelVA(t('errors.callHelpCenter.vaAppNotWorking'))}
          description={onTryAgain ? t('errors.callHelpCenter.sorryWithRefresh') : t('errors.callHelpCenter.sorry')}
          primaryButton={onTryAgain && { label: t('refresh'), onPress: tryAgain, testID: t('refresh') }}>
          <Box>
            <TextView
              variant="MobileBody"
              paragraphSpacing={true}
              accessibilityLabel={errorA11y ? errorA11y : t('errors.callHelpCenter.informationLine.a11yLabel')}>
              {errorText ? errorText : t('errors.callHelpCenter.informationLine')}
            </TextView>
            <ClickToCallPhoneNumber
              a11yLabel={a11yLabelID(callPhone || t('8006982411'))}
              displayedText={callPhone ? undefined : displayedTextPhoneNumber(t('8006982411'))}
              phone={callPhone ? callPhone : t('8006982411')}
            />
          </Box>
        </AlertWithHaptics>
      </Box>
    </VAScrollView>
  )
}

export default CallHelpCenter
