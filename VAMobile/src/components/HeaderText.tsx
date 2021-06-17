import { Text } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'
import styled from 'styled-components'

import { useAccessibilityFocus } from 'utils/hooks'

/**
 *  Signifies the props that need to be passed in to {@link BackButton}
 */
export type HeaderTextProps = {
  label: string
}

const HeaderStyledText = styled(Text)``

/**
 * Button used by the stack navigation to go back to the previous screen
 */
export const HeaderText: FC<HeaderTextProps> = ({ label }) => {
  const [focusRef, setFocus] = useAccessibilityFocus()
  useFocusEffect(setFocus)

  return <HeaderStyledText ref={focusRef}>{label}</HeaderStyledText>
}

export default HeaderText
