import { Pressable } from 'react-native'
import Box from 'components/Box'
import React, { FC } from 'react'
import TextView from 'components/TextView'

import { ButtonTypesConstants } from 'components/VAButton'
import { FooterButton } from 'components'
import { VABackgroundColors, VAButtonBackgroundColors, VATextColors } from 'styles/theme'
import VAButton from 'components/VAButton'

export type LargePanelProps = {
  leftButtonText?: string
  /** text of the title bar title(no text it doesn't appear) */
  title?: string
  /** text of the title bar right button(no text it doesn't appear) */
  rightButtonText?: string
  /** text of the footer button(no text it doesn't appear) */
  footerButtonText?: string
  /** optional accessibility label for the left button text */
  leftButtonA11yLabel?: string
  /** optional accessibility label for the title */
  titleA11yLabel?: string
  /** optional accessibility label for the right button text */
  rightButtonA11yLabel?: string
  /** optional accessibility label for the footer button text */
  footerButtonA11yLabel?: string
  /** function called when left title button is pressed */
  onLeftTitleButtonPress?: () => void
  /** function called when right title button is pressed */
  onRightTitleButtonPress?: () => void
  /** function called when footer button is pressed */
  onFooterButtonPress?: () => void
}

const LargePanel: FC<LargePanelProps> = ({
  children,
  leftButtonText,
  title,
  rightButtonText,
  footerButtonText,
  leftButtonA11yLabel,
  titleA11yLabel,
  rightButtonA11yLabel,
  footerButtonA11yLabel,
  onLeftTitleButtonPress,
  onRightTitleButtonPress,
  onFooterButtonPress,
}) => {
  return (
    <>
      <Box>
        <Pressable onPress={onLeftTitleButtonPress} accessible={true} accessibilityRole={'button'} testID={title} accessibilityLabel={leftButtonA11yLabel}>
          <Box>
            <TextView>{leftButtonText}</TextView>
          </Box>
        </Pressable>
      </Box>
      {children}
      {footerButtonText && onFooterButtonPress && <FooterButton text={footerButtonText} backGroundColor="buttonPrimary" textColor={'navBar'} onPress={onFooterButtonPress} />}
    </>
  )
}

export default LargePanel
