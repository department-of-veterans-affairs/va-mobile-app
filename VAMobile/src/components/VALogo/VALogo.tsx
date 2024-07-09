import React from 'react'
import { Image, ImageProps } from 'react-native'

import { useTheme } from 'utils/hooks'

export const VALogo = () => {
  const theme = useTheme()

  const logoProps: ImageProps = {
    width: 254,
    height: 57,
  }

  return <Image style={logoProps} source={theme.mode === 'dark' ? { uri: 'VAOnDark' } : { uri: 'VAOnLight' }} />
}

export default VALogo
