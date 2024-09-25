import React, { FC } from 'react'
import { Image, ImageProps } from 'react-native'

export type VABranchProps = {
  name: string
  /**  optional number use to set the width; otherwise defaults to svg's width */
  width?: number
  /**  optional number use to set the height; otherwise defaults to svg's height */
  height?: number
  /** Optional TestID */
  testID?: string
}

export const VABranch: FC<VABranchProps> = ({ name, width, height, testID }) => {
  const logoProps: ImageProps = {
    width,
    height,
  }

  return <Image testID={testID} style={logoProps} source={{ uri: name }} />
}

export default VABranch
