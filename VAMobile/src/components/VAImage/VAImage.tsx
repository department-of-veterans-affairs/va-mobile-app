import { Image, useWindowDimensions } from 'react-native'
import React, { FC } from 'react'

import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

export const VA_IMAGES_MAP = {
  PaperCheck: {
    width: 922,
    height: 492,
    source: require('./images/paperCheck.png'),
  },
}
/**
 *  Signifies the props that need to be passed in to {@link VAImage}
 */
export type VAImageProps = {
  /** enum name of the image */
  name: keyof typeof VA_IMAGES_MAP
  /** accessibilityLabel for the overall component */
  a11yLabel: string
}

/**
 * VAImage displays a static image that takes up the full width of device minus the gutters
 *
 * @returns VAImage component
 */
const VAImage: FC<VAImageProps> = ({ name, a11yLabel }) => {
  const theme = useTheme()

  // ex. '20px' -> 20
  const gutterStr = theme.dimensions.gutter
  const gutter = parseInt(gutterStr.slice(0, gutterStr.indexOf('px')), 10)

  const width = useWindowDimensions().width - 2 * gutter
  const imageProps = VA_IMAGES_MAP[name]

  if (!imageProps) {
    return <></>
  }

  const ratio = width / imageProps.width

  return <Image source={imageProps.source} style={{ width: width, height: imageProps.height * ratio }} {...testIdProps(a11yLabel)} />
}

export default VAImage
