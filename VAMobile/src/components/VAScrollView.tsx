import { ScrollView, ScrollViewProps } from 'react-native'
import React, { FC, Ref } from 'react'

import { useSafeAreaInsets } from 'react-native-safe-area-context'

export type VAScrollViewProps = {
  /** Optional reference prop to determine scroll position */
  scrollViewRef?: Ref<ScrollView>
} & ScrollViewProps

const VAScrollView: FC<VAScrollViewProps> = (props) => {
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
    <ScrollView ref={props.scrollViewRef} scrollIndicatorInsets={{ right: 1 }} {...props} style={style} />
  )
}

export default VAScrollView
