import { Animated, Easing, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, Pressable, StatusBar, Text, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import React, { FC, useEffect, useState } from 'react'

import { Box, CrisisLineCta, TextView, TextViewProps, VAIcon, VAIconProps } from 'components'
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
  title?: string
  headerButton?: headerButton
  scrollViewProps?: VAScrollViewProps
}

export const CategoryLanding: FC<CategoryLandingProps> = ({ title, headerButton, children, scrollViewProps }) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const [VaOpacity, setVaOpacity] = useState(1)

  const [titleShowing, setTitleShowing] = useState(false)
  const [titleFade] = useState(new Animated.Value(0))

  const [transitionHeaderHeight, setTransitionHeaderHeight] = useState(0)

  const onScroll = (offsetValue: number) => {
    if (offsetValue <= transitionHeaderHeight || !titleShowing) {
      setVaOpacity(1 - offsetValue / transitionHeaderHeight)
      setTitleShowing(offsetValue >= transitionHeaderHeight)
    }
  }

  useEffect(() => {
    // Revert title to transparent (out of view)
    titleShowing === false &&
      Animated.timing(titleFade, {
        toValue: 0,
        duration: 10,
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
	letter-spacing: -0.2px;
`

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
          <Box display="flex" width="25%" />

          <Box
            display="flex"
            flex={1}
            flexDirection={'row'}
            m={theme.dimensions.headerButtonSpacing}
            justifyContent={'center'}
            alignItems={'center'}
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants">
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

      <VAScrollView
        scrollEventThrottle={1}
        onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
          onScroll(event.nativeEvent.contentOffset.y)
        }}
        {...scrollViewProps}>
        <View onLayout={getTransitionHeaderHeight}>
          <CrisisLineCta onPress={navigateTo('VeteransCrisisLine')} />
          <TextView {...subtitleProps}>{title}</TextView>
        </View>
        {children}
      </VAScrollView>
    </View>
  )
}
