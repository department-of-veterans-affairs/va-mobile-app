import { ScrollView, ScrollViewProps } from 'react-native'
import React, { FC } from 'react'

const VAScrollView: FC<ScrollViewProps> = (props) => {
  return (
    /**
     * force scroll position by default to avoid visual bug where scrollbar appears in the center of a screen
     * scrollIndicatorInsets is an iOS only prop, this bug only appears on iOS
     */
    <ScrollView scrollIndicatorInsets={{ right: 1 }} {...props} />
  )
}

export default VAScrollView
