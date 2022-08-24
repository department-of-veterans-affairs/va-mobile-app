// This component code is from the original code in https://github.com/breeffy/react-native-popup-menu with some modification made to make it work for us.
import { StyleProp, TouchableHighlight, TouchableHighlightProps, View, ViewProps, ViewStyle } from 'react-native'
import React, { PropsWithChildren } from 'react'

import theme from 'styles/themes/standardTheme'

interface MenuItemViewProps {
  /** disables the menu item */
  disabled?: boolean
  /** sets the underlay color */
  underlayColor?: TouchableHighlightProps['underlayColor']
  /** sets the disable style */
  disabledStyle?: ViewProps['style']
  /** sets the menu button style */
  touchableStyle?: TouchableHighlightProps['style']
  /** sets the menu container style*/
  viewStyle?: ViewProps['style']
  /** sets the method to execute on press */
  onPress: TouchableHighlightProps['onPress']
  /** accessibility label for the menu item */
  accessibilityLabel?: string
}

/** This is the menu item common component. This component will be the actions shown inside the menu.
 */
export const MenuItem = ({
  disabled = false,
  underlayColor = theme.colors.buttonBackground.overFlowMenuButton,
  viewStyle,
  touchableStyle,
  disabledStyle,
  children,
  onPress,
  accessibilityLabel,
}: PropsWithChildren<MenuItemViewProps>): JSX.Element => {
  const touchableInitialStyle: StyleProp<ViewStyle> = {
    justifyContent: 'center',
    minWidth: 191,
    flexWrap: 'wrap',
  }

  return (
    <TouchableHighlight
      disabled={disabled}
      onPress={onPress}
      style={[touchableInitialStyle, touchableStyle]}
      underlayColor={underlayColor}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}>
      <View style={[viewStyle, disabled && disabledStyle]}>{children}</View>
    </TouchableHighlight>
  )
}
