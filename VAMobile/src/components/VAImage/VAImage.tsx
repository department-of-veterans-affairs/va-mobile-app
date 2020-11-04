import { Image, useWindowDimensions } from 'react-native'
import React, { FC } from 'react'

import { testIdProps } from 'utils/accessibility'

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
  /** margins for the image */
  marginX: number
}

/**
 * VAImage displays a static image
 *
 * @returns VAImage component
 */
const VAImage: FC<VAImageProps> = ({ name, a11yLabel, marginX }) => {
  const width = useWindowDimensions().width - 2 * marginX
  const imageProps = VA_IMAGES_MAP[name]

  if (!imageProps) {
    return <></>
  }

  const ratio = width / imageProps.width

  return (
    <Image source={imageProps.source} style={{ width: width, height: imageProps.height * ratio }} {...testIdProps(a11yLabel)} accessibilityLabel={a11yLabel} accessible={true} />
  )
}

export default VAImage
