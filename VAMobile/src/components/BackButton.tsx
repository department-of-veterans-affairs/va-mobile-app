import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import { isIOS } from 'utils/platform'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'utils/hooks'
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
}

/**
 * Button used by the stack navigation to go back to the previous screen
 */
export const BackButton: FC<BackButtonProps> = ({ onPress, canGoBack, testID = 'back', i18nId, showCarat }) => {
  const t = useTranslation()

  if (!canGoBack) {
    return null
  }

  const chevron = showCarat ? <VAIcon mt={1} name={'ArrowLeft'} fill="contrast" /> : <></>

  return (
    <TouchableWithoutFeedback onPress={onPress} {...testIdProps(testID)} accessibilityRole="button" accessible={true}>
      <Box display="flex" flexDirection="row" ml={16} height={isIOS() ? 92 : 50} py={14}>
        {chevron}
        <TextView variant="MobileBody" color="primaryContrast" ml={8} height={45} allowFontScaling={false} accessible={false}>
          {t(i18nId)}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default BackButton
