import { Image, useWindowDimensions } from 'react-native'
import React, { FC } from 'react'

import { testIdProps } from 'utils/accessibility'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/**
 * Add images to android('res/drawable') and in xcode('Images.xcassets') when new ones are added.
 * Android and IOS are not rendering using local path(ex. require('./images/asset.png')) and needs to be added as an asset resource.
 * Width and height should match whatever the image is.
 */
export const VA_IMAGES_MAP = {
  PaperCheck: {
    width: 922,
    height: 492,
    source: { uri: 'paper_check' },
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
 * A common component to display static images. New images need to be placed in VAImge/image and in Xcode under VAMobile/Images.xcassets. Examples/details can be found in VAImage component.
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
