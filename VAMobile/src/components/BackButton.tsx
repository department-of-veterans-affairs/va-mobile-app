import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableWithoutFeedback } from 'react-native'

import { useFocusEffect } from '@react-navigation/native'

import { Box, TextView } from 'components'
import { BackButtonLabel } from 'constants/backButtonLabels'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp } from 'utils/accessibility'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'

/**
 *  Signifies the props that need to be passed in to {@link BackButton}
 */
export type BackButtonProps = {
  /** the onPress function for the back button */
  onPress: (() => void) | undefined
  /** a boolean indicating if the user has a screen to go back to; if false, the back button will be hidden */
  canGoBack: boolean | undefined
  /** translation key to use for the display text, as well as the testID for the component */
  label: BackButtonLabel
  /** optional param to add accessibility hint to back button */
  a11yHint?: string
  /** boolean to specify if we want accesibility to focus on the back button */
  focusOnButton?: boolean
  /** option testID */
  backButtonTestID?: string

  webview?: boolean
}

/**
 * Button used by the stack navigation to go back to the previous screen
 */
export const BackButton: FC<BackButtonProps> = ({
  onPress,
  canGoBack,
  label,
  a11yHint,
  backButtonTestID,
  focusOnButton = true,
  webview,
}) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const [focusRef, setFocus] = useAccessibilityFocus<TouchableWithoutFeedback>()

  useFocusEffect(focusOnButton ? setFocus : () => {})

  if (!canGoBack) {
    return null
  }

  const a11yHintPropParam = a11yHint ? a11yHint : t(`${label}.a11yHint`)

  return (
    // eslint-disable-next-line react-native-a11y/has-accessibility-hint
    <TouchableWithoutFeedback
      ref={focusRef}
      onPress={onPress}
      accessibilityLabel={label}
      {...a11yHintProp(a11yHintPropParam)}
      accessibilityRole="button"
      accessible={true}
      testID={backButtonTestID}>
      <Box
        display="flex"
        flexDirection="row"
        ml={theme.dimensions.headerButtonSpacing}
        height={theme.dimensions.headerHeight}
        alignItems={'center'}>
        <TextView
          variant="ActionBar"
          color={webview ? 'link' : undefined}
          ml={theme.dimensions.textIconMargin}
          allowFontScaling={false}
          accessible={false}>
          {t(label)}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default BackButton
