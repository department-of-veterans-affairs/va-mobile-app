import { Animated, Easing, LayoutChangeEvent, Pressable, StatusBar, Text, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { Box, BoxProps, DescriptiveBackButton, TextView, TextViewProps, VAIcon, VAIconProps } from 'components'
import { themeFn } from 'utils/theme'
import { useTheme } from 'utils/hooks'
import VAScrollView, { VAScrollViewProps } from 'components/VAScrollView'
import styled from 'styled-components'

/* To use these templates:
1. Wrap the screen content you want in <FeatureLandingTemplate> </FeatureLandingTemplate> or <ChildTemplate> </ChildTemplate> and
  supply the appropriate props for desired functionality
2. In the screen navigator update 'screenOptions={{ headerShown: false }}' to hide the previous navigation display for all screens in the navigator.
  Use 'options={{headerShown: false}}'(preferred method for subtask) in the individual screen if only an individual screen is supposed to do it.
*/

type headerButton = {
  label: string
  labelA11y?: string
  icon: VAIconProps
  onPress: () => void
}

export type ChildTemplateProps = {
  /** Translated label text for descriptive back button */
  backLabel: string
  /** On press navigation for descriptive back button */
  backLabelOnPress: () => void
  /** Title for page that transitions to header */
  title: string
  /** Optional header button requiring label, icon, and onPress props */
  headerButton?: headerButton
  /** Optional footer content pinned below the scrollable space */
  footerContent?: ReactNode
  /** Optional ScrollView props to pass through to VAScrollView if desired */
  scrollViewProps?: VAScrollViewProps
}

export type FeatureLandingProps = ChildTemplateProps // Passthrough to same props

export const ChildTemplate: FC<ChildTemplateProps> = ({ backLabel, backLabelOnPress, title, headerButton, children, footerContent, scrollViewProps }) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()

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
	letter-spacing: -0.2px;
`

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
   * @param event - Layout change event wrapping the subtitle
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
            <DescriptiveBackButton label={backLabel} onPress={backLabelOnPress} />
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

      <>
        <VAScrollView
          scrollEventThrottle={1}
          onScroll={(event) => {
            transitionHeader(event.nativeEvent.contentOffset.y)
          }}
          {...scrollViewProps}>
          <View onLayout={getTransitionHeaderHeight}>
            <TextView {...subtitleProps}>{title}</TextView>
          </View>
          {children}
        </VAScrollView>
        {footerContent}
      </>
    </View>
  )
}

export const FeatureLandingTemplate: FC<FeatureLandingProps> = ChildTemplate // Passthrough to same template component
