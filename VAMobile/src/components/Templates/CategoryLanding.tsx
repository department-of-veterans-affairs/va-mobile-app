import React, { FC, useState } from 'react'
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CrisisLineButton, HeaderButton, TextView, TextViewProps, WaygateWrapper } from 'components'
import VAScrollView, { VAScrollViewProps } from 'components/VAScrollView'
import { useIsScreenReaderEnabled, useTheme } from 'utils/hooks'

import HeaderBanner, { HeaderBannerProps } from './HeaderBanner'

/* To use these templates:
1. Wrap the screen content you want in <CategoryLanding> </CategoryLanding> and supply the appropriate props for desired functionality
2. In the screen navigator update 'screenOptions={{ headerShown: false }}' to hide the previous navigation display for all screens in the navigator.
  Use 'options={{headerShown: false}}'(preferred method for subtask) in the individual screen if only an individual screen is supposed to do it.
*/

export type CategoryLandingProps = {
  /** Optional title for page that transitions to header */
  title?: string
  /** Optional header button requiring label, icon, and onPress props */
  headerButton?: HeaderButton
  /** Optional ScrollView props to pass through to VAScrollView if desired */
  scrollViewProps?: VAScrollViewProps
  /** optional testID for scrollView */
  testID?: string
}

export const CategoryLanding: FC<CategoryLandingProps> = ({
  title,
  headerButton,
  children,
  scrollViewProps,
  testID,
}) => {
  const insets = useSafeAreaInsets()
  const fontScale = useWindowDimensions().fontScale
  const theme = useTheme()
  const screenReaderEnabled = useIsScreenReaderEnabled(true)

  const [scrollOffset, setScrollOffset] = useState(0)
  const [trackScrollOffset, setTrackScrollOffset] = useState(true)
  const [transitionHeaderHeight, setTransitionHeaderHeight] = useState(0)

  const fillStyle: ViewStyle = {
    paddingTop: insets.top,
    backgroundColor: theme.colors.background.main,
    flex: 1,
  }

  const headerProps: HeaderBannerProps = {
    title: title ? { type: 'Transition', title, scrollOffset, transitionHeaderHeight } : { type: 'VA' },
    rightButton: headerButton
      ? {
          text: headerButton.label,
          a11yLabel: headerButton.labelA11y,
          onPress: headerButton.onPress,
          icon: headerButton.icon,
        }
      : undefined,
    shadow: theme.mode === 'light',
  }

  const subtitleProps: TextViewProps = {
    variant: 'BitterHeading',
    mt: theme.dimensions.condensedMarginBetween,
    ml: theme.dimensions.condensedMarginBetween,
    mb: theme.dimensions.standardMarginBetween,
    mr: theme.dimensions.condensedMarginBetween,
    accessible: false,
    importantForAccessibility: 'no-hide-descendants',
  }

  /**
   * Handles which onScroll behavior is used
   * @param event - Native scroll event
   * @returns Logic for transitioning the header or a function that does nothing (no title)
   */
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    return title ? transitionHeader(event.nativeEvent.contentOffset.y) : () => {}
  }

  /**
   * Handles controlling transitioning header functionality
   * @param offsetValue - The scroll offset position in pixels
   */
  const transitionHeader = (offsetValue: number) => {
    if (offsetValue <= transitionHeaderHeight || trackScrollOffset) {
      setScrollOffset(offsetValue)
      // Stops tracking scroll offset outside the relevant range so more scrolling doesn't prevent animation rendering
      setTrackScrollOffset(offsetValue < transitionHeaderHeight)
    }
  }

  /**
   * At (re)render time, gets and sets the height for transitioning header behavior
   * @param event - Layout change event wrapping the Veteran's Crisis Line and subtitle
   */
  const getTransitionHeaderHeight = (event: LayoutChangeEvent) => {
    // Subtract out bottom padding and 1/3 scaled font line height to closely align transition before subtitle fully disappearing
    const partialFontHeight = (theme.fontSizes.BitterBoldHeading.lineHeight * fontScale) / 3
    const height = event.nativeEvent.layout.height - theme.dimensions.standardMarginBetween - partialFontHeight
    setTransitionHeaderHeight(height)
  }

  return (
    <View style={fillStyle}>
      <StatusBar
        translucent
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background.main}
      />
      <HeaderBanner {...headerProps} />
      <VAScrollView testID={testID} scrollEventThrottle={title ? 1 : 0} onScroll={onScroll} {...scrollViewProps}>
        <View onLayout={getTransitionHeaderHeight}>
          <CrisisLineButton />
          {title && !screenReaderEnabled ? <TextView {...subtitleProps}>{title}</TextView> : null}
        </View>
        <WaygateWrapper>{children}</WaygateWrapper>
      </VAScrollView>
    </View>
  )
}
