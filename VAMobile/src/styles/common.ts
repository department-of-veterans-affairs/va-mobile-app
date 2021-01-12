import { CardStyleInterpolators } from '@react-navigation/stack'
import { StackNavigationOptions } from '@react-navigation/stack/lib/typescript/src/types'

import styled from 'styled-components/native'

import { VATheme } from 'styles/theme'
import TextView from '../components/TextView'

export const ViewFlexRowSpaceBetween = styled.TouchableOpacity`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`

export const HiddenTitle = styled(TextView)`
  position: absolute;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
`

export const getHeaderStyles = (theme: VATheme): StackNavigationOptions => {
  return {
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    headerStyle: {
      backgroundColor: theme?.colors?.icon?.active,
      height: 64,
    },
    headerTintColor: theme?.colors?.text?.primaryContrast,
    headerTitleStyle: {
      fontSize: 20,
      letterSpacing: -0.2,
      flex: 1,
      textAlignVertical: 'center',
    },
    headerTitleAllowFontScaling: false,
    headerBackAllowFontScaling: false,
    headerBackTitleVisible: true,
    headerTitleAlign: 'center',
    headerTitleContainerStyle: {
      height: 64,
    },
  }
}
