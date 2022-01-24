import { Animated, StyleProp, TextStyle } from 'react-native'

import { CardStyleInterpolators } from '@react-navigation/stack'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'
import styled from 'styled-components'

import { VATheme } from 'styles/theme'
import TextView from '../components/TextView'

export const HiddenTitle = styled(TextView)`
  position: absolute;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
`

export type HeaderTitleType = {
  children?: string
  tintColor?: string
  style?: Animated.WithAnimatedValue<StyleProp<TextStyle>>
}

export const getHeaderStyles = (insetsTop: number, theme: VATheme): StackNavigationOptions => {
  return {
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerStyle: {
      backgroundColor: theme?.colors?.background?.navHeader,
      height: insetsTop + theme.dimensions.headerHeight,
      borderBottomWidth: 0,
      shadowColor: 'transparent',
    },
    headerTintColor: theme?.colors?.text?.primaryContrast,
    headerTitleStyle: {
      fontSize: 20,
      letterSpacing: -0.2,
    },
    headerTitleAllowFontScaling: false,
    headerBackAllowFontScaling: false,
    headerBackTitleVisible: true,
    headerTitleAlign: 'center',
  }
}
