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
    return <Image style={logoProps} source={{ uri: 'va_on_dark.png' }} />
  } else {
    return <Image style={logoProps} source={{ uri: 'va_on_light.png' }} />
  }
}

export default VALogo
