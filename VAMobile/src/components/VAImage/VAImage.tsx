import { Image, useWindowDimensions } from 'react-native'
import React, { FC } from 'react'

import { isIOS } from 'utils/platform'
import { testIdProps } from 'utils/accessibility'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/**
 * Add images to './images' and in xcode('Images.xcassets') when new ones are added.
 * IOS does not handle images from local path correctly and needs to be added as an asset resource.
 */
export const VA_IMAGES_MAP = {
  PaperCheck: {
    width: 922,
    height: 492,
    source: isIOS() ? { uri: 'paperCheck' } : require('./images/paperCheck.png'),
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
 * VAImage displays a static image that takes up the full width of device minus the gutters
 *
 * @returns VAImage component
 */
const VAImage: FC<VAImageProps> = ({ name, a11yLabel, marginX }) => {
  const safeAreaRightMargin = useSafeAreaInsets().right
  const safeAreaLeftMargin = useSafeAreaInsets().left

  // Subtracting safe area insets from image width
  const width = useWindowDimensions().width - 2 * marginX - safeAreaLeftMargin - safeAreaRightMargin
  const imageProps = VA_IMAGES_MAP[name]

  if (!imageProps) {
    return <></>
  }

  const ratio = width / imageProps.width

  return (
    <Image
      source={imageProps.source}
      style={{ width: width, height: imageProps.height * ratio }}
      {...testIdProps(a11yLabel)}
      accessibilityLabel={a11yLabel}
      accessible={true}
      accessibilityRole={'image'}
    />
  )
}

export default VAImage
