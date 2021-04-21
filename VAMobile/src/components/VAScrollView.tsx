import { ScrollView, ScrollViewProps } from 'react-native'
import React, { FC } from 'react'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

const VAScrollView: FC<ScrollViewProps> = (props) => {
  const insets = useSafeAreaInsets()
  const style = {
    paddingRight: insets.right,
    paddingLeft: insets.left,
  }

  return (
    /**
     * force scroll position by default to avoid visual bug where scrollbar appears in the center of a screen
     * scrollIndicatorInsets is an iOS only prop, this bug only appears on iOS
     */
    <ScrollView scrollIndicatorInsets={{ right: 1 }} {...props} style={style} />
  )
}

export default VAScrollView
