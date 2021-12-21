//  This component code is from the original code in https://github.com/breeffy/react-native-popup-menu.
import * as React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import theme from 'styles/themes/standardTheme'

export interface MenuDividerProps {
  /** color of the divider */
  color?: string
}

/**
 * Common menu item divider component.
 *

 */
export const MenuDivider = ({ color = theme.colors.border.menuDivider }: MenuDividerProps): JSX.Element => {
  const dividerStyleProps: StyleProp<ViewStyle> = {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color,
  }
  return <View {...dividerStyleProps} />
}
