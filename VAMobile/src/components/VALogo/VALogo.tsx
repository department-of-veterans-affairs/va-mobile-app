import React, { FC } from 'react'
import { Image, ImageProps } from 'react-native'

import { useTheme } from 'utils/hooks'

export type VALogoProps = {
  /** Manually set which logo variant to use. Defaults to setting based on theme */
  variant?: 'light' | 'dark'
  /** Optional TestID */
  testID?: string
}

export const VALogo: FC<VALogoProps> = ({ variant, testID }) => {
  const theme = useTheme()

  const logoProps: ImageProps = {
    width: 256,
    height: 57,
  }

  return (
    <Image
      testID={testID}
      style={logoProps}
      source={
        (variant || theme.mode) === 'dark'
          ? require('@department-of-veterans-affairs/mobile-assets/VALogo/VAOnDark.png')
          : require('@department-of-veterans-affairs/mobile-assets/VALogo/VAOnLight.png')
      }
    />
  )
}

export default VALogo
