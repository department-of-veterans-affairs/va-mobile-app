import * as React from 'react'
import { PropsWithChildren } from 'react'

import { Platform, StyleSheet, Text, TextProps, TouchableHighlight, TouchableHighlightProps, View, ViewProps } from 'react-native'

interface TouchableProps {
  disabled: boolean
  underlayColor: TouchableHighlightProps['underlayColor']
  style: TouchableHighlightProps['style']
  onPress: TouchableHighlightProps['onPress']
}

const Touchable = ({ disabled, underlayColor, style, children, onPress, ...props }: PropsWithChildren<TouchableProps>) => {
  return (
    <TouchableHighlight disabled={disabled} onPress={onPress} style={[styles.container, style]} underlayColor={underlayColor} {...props}>
      {children}
    </TouchableHighlight>
  )
}

interface MenuItemTextProps {
  disabled?: boolean
  disabledTextColor?: string
  underlayColor?: TouchableHighlightProps['underlayColor']
  touchableStyle?: TouchableHighlightProps['style']
  textStyle?: TextProps['style']
  onPress: TouchableHighlightProps['onPress']
}

export const MenuItemText = ({
  disabled = false,
  disabledTextColor = '#BDBDBD',
  underlayColor = '#E0E0E0',
  touchableStyle,
  textStyle,
  children,
  onPress,
}: PropsWithChildren<MenuItemTextProps>): JSX.Element => {
  return (
    <Touchable disabled={disabled} underlayColor={underlayColor} style={touchableStyle} onPress={onPress}>
      <Text ellipsizeMode={Platform.OS === 'ios' ? 'clip' : 'tail'} numberOfLines={1} style={[styles.title, disabled && { color: disabledTextColor }, textStyle]}>
        {children}
      </Text>
    </Touchable>
  )
}

interface MenuItemViewProps {
  disabled?: boolean
  underlayColor?: TouchableHighlightProps['underlayColor']
  disabledStyle?: ViewProps['style']
  touchableStyle?: TouchableHighlightProps['style']
  viewStyle?: ViewProps['style']
  onPress: TouchableHighlightProps['onPress']
}

export const MenuItemView = ({
  disabled = false,
  underlayColor = '#E0E0E0',
  viewStyle,
  touchableStyle,
  disabledStyle,
  children,
  onPress,
}: PropsWithChildren<MenuItemViewProps>): JSX.Element => {
  return (
    <Touchable disabled={disabled} underlayColor={underlayColor} style={touchableStyle} onPress={onPress}>
      <View style={[viewStyle, disabled && disabledStyle]}>{children}</View>
    </Touchable>
  )
}

const MenuItem = MenuItemText
export { MenuItem }

const styles = StyleSheet.create({
  container: {
    height: 48,
    justifyContent: 'center',
    maxWidth: 248,
    minWidth: 124,
  },
  title: {
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 16,
  },
})
