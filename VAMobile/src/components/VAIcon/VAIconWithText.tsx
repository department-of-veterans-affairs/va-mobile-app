import React, { FC } from 'react'

import { Box, TextView, TextViewProps, VAIcon, VAIconProps, VA_ICON_MAP } from 'components'

export type VAIconWithTextProps = {
  /** name of icon to use **/
  name: keyof typeof VA_ICON_MAP
  /** true if icon is active. defaults to false  */
  isActive?: boolean
}

/**
 * Display icon with text label underneath
 *
 * @returns VAIconWithText component
 */
const VAIconWithText: FC<VAIconWithTextProps> = ({ name, isActive = false }) => {
  const iconProps: VAIconProps = {
    name: `${name}${isActive ? 'Selected' : 'Unselected'}` as keyof typeof VA_ICON_MAP,
    fill: `${isActive ? 'active' : 'inactive'}`,
  }

  const textProps: TextViewProps = {
    variant: 'textWithIconButton',
    mt: 3, // add to line height for 6px total spacing
    color: isActive ? 'textWithIconButton' : 'textWithIconButtonInactive',
    allowFontScaling: false,
  }

  return (
    <Box alignItems="center">
      <VAIcon {...iconProps} />
      <TextView {...textProps}>{name}</TextView>
    </Box>
  )
}

export default VAIconWithText
