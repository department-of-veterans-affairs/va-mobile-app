import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import { TextView } from 'components'
import { VATheme } from 'styles/theme'
import { useTheme } from 'utils/hooks'
import Box from './Box'
import VAIcon, { VA_ICON_MAP } from './VAIcon'

/**
 *  Signifies the props that need to be passed in to {@link CloseModalButton}
 */
export type HeaderIconBtnProps = {
  /** the onPress function for the close button */
  onPress: (() => void) | undefined
  /** optional param to add accessibility hint to close button */
  accessibilityHint?: string
  /** optional param to add accessibility label to close button */
  accessibilityLabel?: string
  /** icon name to use */
  iconName: keyof typeof VA_ICON_MAP
  /** optional param for the icon width*/
  iconWidth?: number
  /** optional param for the icon height */
  iconHeight?: number
  /** optional param text to appear under icon */
  title?: string
}

/**
 * Button used by the request appointment modal
 */
export const HeaderIconBtn: FC<HeaderIconBtnProps> = ({ onPress, accessibilityHint, accessibilityLabel, iconName, iconHeight, iconWidth, title }) => {
  const theme = useTheme()

  return (
    <TouchableWithoutFeedback onPress={onPress} accessibilityLabel={accessibilityLabel} accessibilityHint={accessibilityHint} accessibilityRole="button" accessible={true}>
      <Box mr={20} height={theme.dimensions.headerHeight} alignItems={'center'} justifyContent={'center'} width={45}>
        <VAIcon name={iconName} width={iconWidth ?? 20} height={iconHeight ?? 20} fill="primary" preventScaling={true} />
        {!!title && <TextView variant="HelperTextBold">{title}</TextView>}
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default HeaderIconBtn
