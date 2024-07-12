import React from 'react'
import { Image, ImageProps } from 'react-native'

import { useTheme } from 'utils/hooks'

export const VALogo = () => {
  const theme = useTheme()

  const logoProps: ImageProps = {
    width: 254,
    height: 57,
  }
  if (theme.mode === 'dark') {
    return (
      <Image style={logoProps} source={require('@department-of-veterans-affairs/mobile-assets/VALogo/VAOnDark.png')} />
    )
  } else {
    return (
      <Image style={logoProps} source={require('@department-of-veterans-affairs/mobile-assets/VALogo/VAOnLight.png')} />
    )
  }
}

export default VALogo
