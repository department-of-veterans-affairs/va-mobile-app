import { ScrollView, ScrollViewProps } from 'react-native'
import React, { FC, Ref } from 'react'

import { BackgroundVariant } from './Box'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../utils/hooks'

export type VAScrollViewProps = {
  /** Optional reference prop to determine scroll position */
  scrollViewRef?: Ref<ScrollView>
  /** optional background color to override the main background */
  backgroundColor?: BackgroundVariant
} & ScrollViewProps

/**A common component that provides a scrollable view. Use this instead of ScrollView. This component is a wrapper for react-native ScrollView that has a scrollbar styling fix */
const VAScrollView: FC<VAScrollViewProps> = (props) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()

  const style = {
    paddingRight: insets.right,
    paddingLeft: insets.left,
    backgroundColor: props.backgroundColor ? props.backgroundColor : theme.colors.background.main,
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
