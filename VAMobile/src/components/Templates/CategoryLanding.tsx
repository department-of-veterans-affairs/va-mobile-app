import { Animated, Easing, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, StatusBar, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import React, { FC, useEffect, useState } from 'react'

import { CrisisLineCta, TextView, TextViewProps, VAIconProps } from 'components'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import HeaderBanner, { HeaderBannerProps } from './HeaderBanner'
import VAScrollView, { VAScrollViewProps } from 'components/VAScrollView'

/* To use these templates:
1. Wrap the screen content you want in <CategoryLanding> </CategoryLanding> and supply the appropriate props for desired functionality
2. In the screen navigator update 'screenOptions={{ headerShown: false }}' to hide the previous navigation display for all screens in the navigator.
  Use 'options={{headerShown: false}}'(preferred method for subtask) in the individual screen if only an individual screen is supposed to do it.
*/

type headerButton = {
  label: string
  labelA11y?: string
  icon: VAIconProps
  onPress: () => void
}

export type CategoryLandingProps = {
  /** Optional title for page that transitions to header */
  title?: string
  /** Optional header button requiring label, icon, and onPress props */
  headerButton?: headerButton
  /** Optional ScrollView props to pass through to VAScrollView if desired */
  scrollViewProps?: VAScrollViewProps
}

export const CategoryLanding: FC<CategoryLandingProps> = ({ title, headerButton, children, scrollViewProps }) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const [titleShowing, setTitleShowing] = useState(false)
  const [titleFade] = useState(new Animated.Value(0))
  const [transitionHeaderHeight, setTransitionHeaderHeight] = useState(0)

  const fillStyle: ViewStyle = {
    paddingTop: insets.top,
    backgroundColor: theme.colors.background.main,
    flex: 1,
  }

  const subtitleProps: TextViewProps = {
    variant: 'BitterBoldHeading',
    mt: 0,
    ml: theme.dimensions.condensedMarginBetween,
    mb: theme.dimensions.standardMarginBetween,
    mr: theme.dimensions.condensedMarginBetween,
  }

  /**
   * Handles which onScroll behavior is used
   * @param event - Native scroll event
   * @returns A logic for transitioning the header or a function that does nothing (no title)
   */
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    return title ? transitionHeader(event.nativeEvent.contentOffset.y) : () => {}
  }

  /**
   * With useEffect below, handles carrying out transitioning header functionality
   * @param offsetValue - The scroll offset position in pixels
   */
  const transitionHeader = (offsetValue: number) => {
    if (offsetValue <= transitionHeaderHeight || !titleShowing) {
      setTitleShowing(offsetValue >= transitionHeaderHeight)
    }
  }

  /**
   * Handles animation effect on the title
   */
  useEffect(() => {
    // Revert title to transparent (out of view)
    titleShowing === false &&
      Animated.timing(titleFade, {
        toValue: 0,
        duration: 1,
        useNativeDriver: true,
        easing: Easing.sin,
      }).start()

    // Trigger transition header animation when titleShowing becomes true
    titleShowing === true &&
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.sin,
      }).start()
  })

  /**
   * At (re)render time, gets and sets the height for transitioning header behavior
   * @param event - Layout change event wrapping the Veteran's Crisis Line and subtitle
   */
  const getTransitionHeaderHeight = (event: LayoutChangeEvent) => {
    // Subtract out bottom padding to closely align transition with subtitle fully disappearing
    const height = event.nativeEvent.layout.height - theme.dimensions.standardMarginBetween
    setTransitionHeaderHeight(height)
  }

  const leftIconProps: VAIconProps = {
    name: 'ArrowLeft',
    fill: theme.colors.icon.link,
    height: 13,
    mt: 1,
  }

  const headerProps: HeaderBannerProps = {
    title: titleShowing ? title : 'VA',
    rightButtonText: headerButton ? headerButton.label : undefined,
    rightButtonA11yLabel: headerButton ? headerButton.labelA11y : undefined,
    onRightTitleButtonPress: headerButton ? headerButton.onPress : undefined,
    bannerDivider: false,
    leftVAIconProps: leftIconProps,
    rightVAIconProps: headerButton ? headerButton.icon : undefined,
    titleAccesibilityHidden: true,
  }

  return (
    <View style={fillStyle}>
      <StatusBar translucent barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background.main} />
      <HeaderBanner {...headerProps} />
      <VAScrollView scrollEventThrottle={title ? 1 : 0} onScroll={onScroll} {...scrollViewProps}>
        <View onLayout={getTransitionHeaderHeight}>
          <CrisisLineCta onPress={navigateTo('VeteransCrisisLine')} />
          {title ? <TextView {...subtitleProps}>{title}</TextView> : null}
        </View>
        {children}
      </VAScrollView>
    </View>
  )
}
