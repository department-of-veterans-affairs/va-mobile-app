import React, { FC } from 'react'

import Box from 'components/Box'
import { VA_ICON_MAP } from 'components/VAIcon'
import { VAIconColors, VATextColors } from 'styles/theme'

export type VABranchProps = {
  /** Branch Name */
  name: keyof typeof VA_ICON_MAP
  /**  optional number use to set the width; otherwise defaults to svg's width */
  width?: number
  /**  optional number use to set the height; otherwise defaults to svg's height */
  height?: number
  /** Color for duotone icons--fills icons inside main fill, defaults white */
  color?: keyof VAIconColors | keyof VATextColors | string
  /** Optional TestID */
  testID?: string
}

export const VABranch: FC<VABranchProps> = ({ name, width, height, color, testID }) => {
  const iconProps = { name, width, height, color }
  const Icon = VA_ICON_MAP[name]
  if (!Icon) {
    return <></>
  }

  return (
    <Box testID={testID}>
      <Icon {...iconProps} />
    </Box>
  )
}

export default VABranch
