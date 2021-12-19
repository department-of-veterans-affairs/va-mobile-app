import * as React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export interface MenuDividerProps {
  color?: string
}

export const MenuDivider = ({ color = 'rgba(0,0,0,0.12)' }: MenuDividerProps): JSX.Element => {
  const dividerStyleProps: StyleProp<ViewStyle> = {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color,
  }
  return <View {...dividerStyleProps} />
}
