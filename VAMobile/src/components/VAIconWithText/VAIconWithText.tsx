import React, { FC } from 'react'

import { Box, ColorVariant, TextView, TextViewProps, VAIcon, VAIconProps } from 'components'

export type VAIconWithTextProps = VAIconProps & {
  /** label to display below icon */
  label: string
  /** label color variant. default is textWithIconButton  */
  labelColor?: ColorVariant
}

/**
 * Display icon with text label underneath
 *
 * @returns VAIconWithText component
 */
const VAIconWithText: FC<VAIconWithTextProps> = ({ label, labelColor, ...vaIconProps }) => {
  const iconProps: VAIconProps = {
    ...vaIconProps,
    fill: vaIconProps.fill || 'link',
    height: vaIconProps.height || 24,
    width: vaIconProps.width || 24,
    preventScaling: vaIconProps.preventScaling ?? true,
  }

  const textProps: TextViewProps = {
    variant: 'textWithIconButton',
    mt: 3, // 6px total combined with line height
    color: labelColor || 'textWithIconButton',
    allowFontScaling: false,
  }

  return (
    <Box alignItems="center">
      <VAIcon {...iconProps} />
      <TextView {...textProps}>{label}</TextView>
    </Box>
  )
}

export default VAIconWithText
