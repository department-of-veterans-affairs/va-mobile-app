import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import { BackButtonLabel } from 'constants/backButtonLabels'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
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
  /** translation key to use for the display text, as well as the testID for the component */
  label: BackButtonLabel
  /** whether to show the carat left of the text */
  showCarat?: boolean | true
  /** optional param to add accessibility hint to back button */
  a11yHint?: string
}

/**
 * Button used by the stack navigation to go back to the previous screen
 */
export const BackButton: FC<BackButtonProps> = ({ onPress, canGoBack, label, showCarat, a11yHint }) => {
  const t = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  if (!canGoBack) {
    return null
  }

  const chevron = showCarat ? <VAIcon mt={1} name={'ArrowLeft'} fill="contrast" /> : <></>

  const a11yHintPropParam = a11yHint ? a11yHint : t(`${label}.a11yHint`)

  return (
    <TouchableWithoutFeedback onPress={onPress} {...testIdProps(label)} {...a11yHintProp(a11yHintPropParam)} accessibilityRole="button" accessible={true}>
      <Box display="flex" flexDirection="row" ml={theme.dimensions.headerButtonMargin} height={theme.dimensions.headerHeight} alignItems={'center'}>
        {chevron}
        <TextView variant="ActionBar" color="primaryContrast" ml={theme.dimensions.textIconMargin} allowFontScaling={false} accessible={false}>
          {t(label)}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default BackButton
