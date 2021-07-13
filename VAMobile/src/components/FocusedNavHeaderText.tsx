import { HeaderTitle } from '@react-navigation/stack'
import { HeaderTitleType } from 'styles/common'
import { StyleSheet } from 'react-native'
import { View } from 'react-native'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'

/**
 *  Properties for {@link FocusedNavHeaderText}
 */
export type FocusedNavHeaderTextProps = {
  headerTitleType: HeaderTitleType
}

/**
 * Component to use as a navigation header where accessibility focus is needed on the header in iOS on screen load
 */
export const FocusedNavHeaderText: FC<FocusedNavHeaderTextProps> = ({ headerTitleType }) => {
  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  const {
    dimensions: { headerHeight },
  } = useTheme()

  const combinestyle = StyleSheet.flatten([{ height: headerHeight }, defaultStyle.headerText])

  return (
    <View ref={focusRef} accessibilityRole="header" accessible={true} style={combinestyle}>
      <HeaderTitle {...headerTitleType} />
    </View>
  )
}

const defaultStyle = StyleSheet.create({
  headerText: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
})

export default FocusedNavHeaderText
