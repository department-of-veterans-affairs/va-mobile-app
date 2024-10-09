import React, { FC } from 'react'

import { Icon, IconProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'

import { Box, ColorVariant, TextView, TextViewProps } from 'components'

export type IconWithTextProps = IconProps & {
  /** label to display below icon */
  label: string
  /** label color variant. default is textWithIconButton  */
  labelColor?: ColorVariant
  /** optional a11y label  */
  labelA11y?: string
}

/**
 * Display icon with text label underneath
 *
 * @returns IconWithText component
 */
const IconWithText: FC<IconWithTextProps> = ({ label, labelColor, labelA11y, ...iconProps }) => {
  const props: IconProps = {
    ...iconProps,
    fill: iconProps.fill || 'link',
    height: iconProps.height || 24,
    width: iconProps.width || 24,
    preventScaling: iconProps.preventScaling ?? true,
  }

  const textProps: TextViewProps = {
    variant: 'textWithIconButton',
    mt: 3, // 6px total combined with line height
    color: labelColor || 'textWithIconButton',
    accessibilityLabel: labelA11y,
    allowFontScaling: false,
  }

  return (
    <Box alignItems="center">
      <Icon {...props} />
      <TextView {...textProps}>{label}</TextView>
    </Box>
  )
}

export default IconWithText
