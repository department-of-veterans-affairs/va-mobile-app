import { Animated, Easing, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, Pressable, StatusBar, Text, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import React, { FC, useEffect, useState } from 'react'

import { Box, BoxProps, CrisisLineCta, DescriptiveBackButton, TextView, TextViewProps, VAIcon, VAIconProps } from 'components'
import { themeFn } from 'utils/theme'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import VAScrollView, { VAScrollViewProps } from 'components/VAScrollView'
import styled from 'styled-components'

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
  /** Optional label for back button  */
  backLabel?: string
  /** Optional a11y label for back button  */
  backLabelA11y?: string
  /** Optional onPress function for back button  */
  backLabelOnPress?: () => void
  /** Optional title for page that transitions to header */
  title?: string
  /** Optional header button requiring label, icon, and onPress props */
  headerButton?: headerButton
  /** Optional ScrollView props to pass through to VAScrollView if desired */
  scrollViewProps?: VAScrollViewProps
}

export const CategoryLanding: FC<CategoryLandingProps> = ({ title, headerButton, children, scrollViewProps, backLabel, backLabelA11y, backLabelOnPress }) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const [VaOpacity, setVaOpacity] = useState(1)
  const [titleShowing, setTitleShowing] = useState(false)
  const [titleFade] = useState(new Animated.Value(0))
  const [transitionHeaderHeight, setTransitionHeaderHeight] = useState(0)

  const fillStyle: ViewStyle = {
    paddingTop: insets.top,
    backgroundColor: theme.colors.background.main,
    flex: 1,
  }

  const headerStyle: ViewStyle = {
    height: theme.dimensions.navBarHeight,
    alignItems: 'center',
    justifyContent: 'center',
  }

  const headerTitleBoxProps: BoxProps = {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    m: theme.dimensions.headerButtonSpacing,
    justifyContent: 'center',
    alignItems: 'center',
    accessibilityElementsHidden: true,
    importantForAccessibility: 'no-hide-descendants',
  }

  const subtitleProps: TextViewProps = {
    variant: 'BitterBoldHeading',
    mt: 0,
    ml: theme.dimensions.condensedMarginBetween,
    mb: theme.dimensions.standardMarginBetween,
    mr: theme.dimensions.condensedMarginBetween,
  }

  const StyledLabel = styled(Text)`
	color: ${themeFn((styleTheme) => styleTheme.colors.icon.active)}
	align-self: center;
	margin-top: 24px;
	font-size: 12px;
  font-weight: normal;
	letter-spacing: -0.2px;
`

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
      setVaOpacity(1 - offsetValue / transitionHeaderHeight)
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

  return (
    <View style={fillStyle}>
      <StatusBar translucent barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background.main} />
      <View style={headerStyle}>
        <Box display="flex" flex={1} flexDirection={'row'} width="100%" height={theme.dimensions.headerHeight} alignItems={'center'}>
          <Box display="flex" width="25%">
            {backLabel && backLabelOnPress && <DescriptiveBackButton label={backLabel} labelA11y={backLabelA11y} onPress={backLabelOnPress} />}
          </Box>

          <Box {...headerTitleBoxProps}>
            {titleShowing ? (
              <Animated.View style={{ opacity: titleFade }}>
                <TextView variant="MobileBody" selectable={false} allowFontScaling={false}>
                  {title}
                </TextView>
              </Animated.View>
            ) : (
              <TextView variant="BitterBoldHeading" selectable={false} opacity={VaOpacity} allowFontScaling={false}>
                VA
              </TextView>
            )}
          </Box>

          <Box display="flex" width="25%" alignItems="center">
            {headerButton ? (
              <Pressable onPress={headerButton.onPress} accessibilityRole="button" accessible={true}>
                <Box alignSelf="center" position="absolute" mt={theme.dimensions.buttonBorderWidth}>
                  <VAIcon name={headerButton.icon.name} fill={'active'} height={22} width={22} preventScaling={true} />
                </Box>
                <StyledLabel allowFontScaling={false}>{headerButton.label}</StyledLabel>
              </Pressable>
            ) : null}
          </Box>
        </Box>
      </View>

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
