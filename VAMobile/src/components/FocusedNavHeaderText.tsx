import { View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'

import { useAccessibilityFocus } from 'utils/hooks'
import HeaderTitle from './HeaderTitle'

/**
 *  Properties for {@link FocusedNavHeaderText}
 */
export type FocusedNavHeaderTextProps = {
  headerTitle: string
}

/**
 * Component to use as a navigation header where accessibility focus is needed on the header in iOS on screen load
 */
export const FocusedNavHeaderText: FC<FocusedNavHeaderTextProps> = ({ headerTitle }) => {
  const [focusRef, setFocus] = useAccessibilityFocus<View>()
  useFocusEffect(setFocus)

  return <HeaderTitle headerTitle={headerTitle} focusRef={focusRef} />
}

export default FocusedNavHeaderText
