import React, { FC } from 'react'
import { Image, ImageProps } from 'react-native'

import { useTheme } from 'utils/hooks'

export type VALogoProps = {
  /** Optional TestID */
  testID?: string
}

export const VALogo: FC<VALogoProps> = ({ testID }) => {
  const theme = useTheme()

  const logoProps: ImageProps = {
    width: 254,
    height: 57,
  }
  if (theme.mode === 'dark') {
    return (
      <Image
        testID={testID}
        style={logoProps}
        source={require('../../../node_modules/@department-of-veterans-affairs/mobile-assets/VALogo/VAOnDark.png')}
      />
    )
  } else {
    return (
      <Image
        testID={testID}
        style={logoProps}
        source={require('../../../node_modules/@department-of-veterans-affairs/mobile-assets/VALogo/VAOnLight.png')}
      />
    )
  }
}

export default VALogo
