import { Animated, Easing, TouchableWithoutFeedback } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC, useEffect, useReducer, useState } from 'react'

import { Box, BoxProps, DescriptiveBackButton, TextView, TextViewProps, VAIcon, VAIconProps } from 'components'
import { HiddenA11yElement } from 'styles/common'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'

export type HeaderLeftButtonProps = {
  text: string
  a11yLabel?: string
  onPress: () => void
  descriptiveBack?: boolean
}

/** Static header title */
export type HeaderStaticTitleProps = {
  type: 'Static'
  title: string
  a11yLabel?: string
}

/** Transitioning based on scroll header title */
export type HeaderTransitionTitleProps = {
  type: 'Transition'
  title: string
  a11yLabel?: string
  /** Scroll offset position in pixels to control transition behavior */
  scrollOffset: number
  /** Height in pixels to determine "VA" opacity/transition animation behavior */
  transitionHeaderHeight: number
}

/** Static "VA" title */
export type HeaderVATitleProps = {
  type: 'VA'
}

export type HeaderRightButtonProps = {
  text: string
  a11yLabel?: string
  onPress: () => void
  icon?: VAIconProps
}

export type HeaderBannerProps = {
  /** left header button */
  leftButton?: HeaderLeftButtonProps
  /** header title in 3 forms: Static, Transition, VA */
  title?: HeaderStaticTitleProps | HeaderTransitionTitleProps | HeaderVATitleProps
  /** right header button */
  rightButton?: HeaderRightButtonProps
  /** 1px banner border dividing the header from page content, default no divider */
  divider?: boolean
  /** set screen reader focus to left or right button */
  focusButton?: 'Left' | 'Right'
}

const HeaderBanner: FC<HeaderBannerProps> = ({ leftButton, title, rightButton, divider: bannerDivider, focusButton }) => {
  const theme = useTheme()
  const [focusRef, setFocus] = useAccessibilityFocus<TouchableWithoutFeedback>()
  useFocusEffect(setFocus)

  const transition = title?.type === 'Transition'

  /**
   * Reducer to update the "VA" header opacity based on scroll
   */
  const VaOpacityReducer = (initOffset: number) => {
    return transition ? 1 - title.scrollOffset / title.transitionHeaderHeight : initOffset
  }

  /**
   * Reducer to swap between "VA" and title based on scroll
   */
  const titleShowingReducer = (initTitleShowing: boolean) => {
    return transition ? title.scrollOffset >= title.transitionHeaderHeight : initTitleShowing
  }

  const [VaOpacity, updateVaOpacity] = useReducer(VaOpacityReducer, transition ? title.scrollOffset : 0)
  const [titleShowing, updateTitleShowing] = useReducer(titleShowingReducer, false)
  const [titleFade] = useState(new Animated.Value(0))

  /**
   * With reducers above and useEffect below, handles carrying out transitioning header functionality
   */
  useEffect(() => {
    if (transition && (title.scrollOffset <= title.transitionHeaderHeight || !titleShowing)) {
      updateVaOpacity()
      updateTitleShowing()
    }
  })

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
        duration: 300,
        useNativeDriver: true,
        easing: Easing.sin,
      }).start()
  })

  let leftBoxProps: BoxProps = {}
  let leftTextViewProps: TextViewProps = {}
  let titleBoxProps: BoxProps = {}
  let titleTextViewProps: TextViewProps = {}
  let rightBoxProps: BoxProps = {}
  let rightTextViewProps: TextViewProps = {}

  const titleBannerProps: BoxProps = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    minHeight: theme.dimensions.headerHeight,
    backgroundColor: 'main',
    borderBottomWidth: bannerDivider ? theme.dimensions.borderWidth : 0,
    borderBottomColor: 'menuDivider',
  }

  const commonBoxProps: BoxProps = {
    alignItems: 'center',
    p: theme.dimensions.buttonPadding,
    minHeight: theme.dimensions.headerHeight,
  }

  if (leftButton) {
    leftBoxProps = { ...commonBoxProps }

    leftTextViewProps = {
      color: 'footerButton',
      variant: 'MobileBody',
      accessibilityLabel: leftButton.a11yLabel,
      allowFontScaling: false,
    }
  }

  if (title?.type === 'VA') {
    titleBoxProps = { ...commonBoxProps }

    titleTextViewProps = {
      variant: 'VAHeader',
      accessibilityLabel: 'V-A',
      allowFontScaling: false,
    }
  } else {
    titleBoxProps = {
      ...commonBoxProps,
      accessibilityElementsHidden: transition ? true : false,
      importantForAccessibility: transition ? 'no-hide-descendants' : 'yes',
    }

    titleTextViewProps = {
      variant: transition ? 'MobileBody' : 'MobileBodyBold',
      accessibilityLabel: title?.a11yLabel,
      allowFontScaling: false,
    }
  }

  if (rightButton) {
    rightBoxProps = { ...commonBoxProps }

    rightTextViewProps = {
      color: 'footerButton',
      variant: rightButton.icon ? 'textWithIconButton' : 'MobileBody',
      accessibilityLabel: rightButton.a11yLabel,
      allowFontScaling: false,
    }
  }

  const buildTitleDisplay = () => {
    if (!title) {
      return null
    }

    switch (title.type) {
      case 'Static': {
        return (
          <Box {...titleBoxProps}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <TextView {...titleTextViewProps}>{title.title}</TextView>
            </Box>
          </Box>
        )
      }

      case 'Transition': {
        const a11y = title?.a11yLabel ? title.a11yLabel : title.title
        return (
          <>
            <HiddenA11yElement accessibilityLabel={a11y} accessibilityRole="header">
              {a11y}
            </HiddenA11yElement>
            <Box {...titleBoxProps}>
              {titleShowing ? (
                <Animated.View style={{ opacity: titleFade }}>
                  <TextView {...titleTextViewProps}>{title.title}</TextView>
                </Animated.View>
              ) : (
                <TextView variant="VAHeader" opacity={VaOpacity} allowFontScaling={false}>
                  VA
                </TextView>
              )}
            </Box>
          </>
        )
      }

      case 'VA': {
        return (
          <Box {...titleBoxProps}>
            <TextView {...titleTextViewProps}>VA</TextView>
          </Box>
        )
      }
    }
  }

  return (
    <>
      <Box {...titleBannerProps}>
        <Box flex={1}>
          {leftButton?.descriptiveBack ? (
            <DescriptiveBackButton label={leftButton.text} onPress={leftButton.onPress} focusOnButton={focusButton === 'Left'} />
          ) : leftButton ? (
            <Box ml={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding}>
              <TouchableWithoutFeedback ref={focusButton === 'Left' ? focusRef : () => {}} onPress={leftButton.onPress} accessibilityRole="button">
                <Box {...leftBoxProps}>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <TextView {...leftTextViewProps}>{leftButton.text}</TextView>
                  </Box>
                </Box>
              </TouchableWithoutFeedback>
            </Box>
          ) : null}
        </Box>

        <Box mt={theme.dimensions.buttonPadding} flex={2}>
          {buildTitleDisplay()}
        </Box>

        <Box mr={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding} flex={1} alignItems={'flex-end'}>
          {rightButton && (
            <TouchableWithoutFeedback ref={focusButton === 'Right' ? focusRef : () => {}} onPress={rightButton.onPress} accessibilityRole="button">
              <Box {...rightBoxProps}>
                {rightButton.icon && <VAIcon {...rightButton.icon} preventScaling={true} />}
                <Box display="flex" flexDirection="row" alignItems="center">
                  <TextView {...rightTextViewProps}>{rightButton.text}</TextView>
                </Box>
              </Box>
            </TouchableWithoutFeedback>
          )}
        </Box>
      </Box>
    </>
  )
}

export default HeaderBanner
