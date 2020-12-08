import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { isIOS } from 'utils/platform'
import { useTheme, useTranslation } from 'utils/hooks'
import Box from './Box'
import TextView from './TextView'
import VAIcon from './VAIcon'

/**
 *  Signifies the props that need to be passed in to {@link BackButton}
 */
export type BackButtonProps = {
  /** the onPress function for the back button */
  onPress: (() => void) | undefined
  /** a boolean indicating if the user has a screen to go back to; if false, the back button will be hidden */
  canGoBack: boolean | undefined
  /** a string value used to set the back buttons testID/accessibility label; defaults to 'back' */
  testID?: string
  /** translation key to use for the display text */
  i18nId: string
  /** whether to show the carat left of the text */
  showCarat?: boolean | true
  /** optional param to add accessibility hint to back button */
  a11yHint?: string
}

/**
 * Button used by the stack navigation to go back to the previous screen
 */
export const BackButton: FC<BackButtonProps> = ({ onPress, canGoBack, testID = 'back', i18nId, showCarat, a11yHint }) => {
  const t = useTranslation()
  const theme = useTheme()

  if (!canGoBack) {
    return null
  }

  const chevron = showCarat ? <VAIcon mt={1} name={'ArrowLeft'} fill="contrast" /> : <></>

  return (
    <TouchableWithoutFeedback onPress={onPress} {...testIdProps(testID)} {...a11yHintProp(a11yHint || '')} accessibilityRole="button" accessible={true}>
      <Box display="flex" flexDirection="row" ml={theme.dimensions.headerButtonMargin} height={isIOS() ? 92 : 50} py={theme.dimensions.headerButtonPadding}>
        {chevron}
        <TextView variant="MobileBody" color="primaryContrast" ml={theme.dimensions.textIconMargin} height={45} allowFontScaling={false} accessible={false}>
          {t(i18nId)}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default BackButton
