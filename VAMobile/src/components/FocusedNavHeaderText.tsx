import { HeaderTitle } from '@react-navigation/stack'
import { View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'

import { HeaderTitleType } from 'styles/common'
import { useAccessibilityFocus } from 'utils/hooks'

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

  return (
    <View ref={focusRef} accessibilityRole="header" accessible={true}>
      <HeaderTitle {...headerTitleType} />
    </View>
  )
}

export default FocusedNavHeaderText
