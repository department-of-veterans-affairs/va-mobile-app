import { Animated, Easing, TouchableWithoutFeedback } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC, useEffect, useState } from 'react'

import { Box, BoxProps, TextView, TextViewProps, VAIcon, VAIconProps } from 'components'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'

export type HeaderLeftButtonProps = {
  text: string
  a11yLabel?: string
  onPress: () => void
  icon?: VAIconProps
  /** icon position relative to text, default Left */
  iconPosition?: 'Left' | 'Top'
}
// TODO: FIGURE OUT HOW DOING DESC BACK BUTTON, MAYBE DELETE icon(Position)

/** Static header title */
export type HeaderStaticTitleProps = {
  type: 'Static'
  text: string
  a11yLabel?: string
}

/** Transitioning based on scroll header title */
export type HeaderTransitionTitleProps = {
  type: 'Transition'
  text: string
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

  const [VaOpacity, setVaOpacity] = useState(1)
  const [titleShowing, setTitleShowing] = useState(false)
  const [titleFade] = useState(new Animated.Value(0))

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
    leftBoxProps = {
      ...commonBoxProps,
      flexDirection: leftButton.iconPosition === 'Top' ? 'column' : 'row',
    }

    leftTextViewProps = {
      color: 'footerButton',
      variant: leftButton.icon ? 'textWithIconButton' : 'MobileBody',
      accessibilityLabel: leftButton.a11yLabel,
      allowFontScaling: false,
    }
  }

  if (title?.type === 'VA') {
    titleBoxProps = { ...commonBoxProps }

    titleTextViewProps = {
      variant: 'BitterBoldHeading',
      allowFontScaling: false,
    }
  } else {
    titleBoxProps = {
      ...commonBoxProps,
      accessibilityElementsHidden: title?.type === 'Transition' ? true : false,
      importantForAccessibility: title?.type === 'Transition' ? 'no-hide-descendants' : 'yes',
    }

    titleTextViewProps = {
      variant: title?.type === 'Transition' ? 'MobileBody' : 'MobileBodyBold',
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

  /**
   * With useEffect below, handles carrying out transitioning header functionality
   */
  useEffect(() => {
    if (title?.type === 'Transition' && (title.scrollOffset <= title.transitionHeaderHeight || !titleShowing)) {
      setVaOpacity(1 - title.scrollOffset / title.transitionHeaderHeight)
      setTitleShowing(title.scrollOffset >= title.transitionHeaderHeight)
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
        duration: 250,
        useNativeDriver: true,
        easing: Easing.sin,
      }).start()
  })

  const buildTitleDisplay = () => {
    if (!title) {
      return null
    }

    switch (title.type) {
      case 'Static': {
        return (
          <Box {...titleBoxProps}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <TextView {...titleTextViewProps}>{title.text}</TextView>
            </Box>
          </Box>
        )
      }

      case 'Transition': {
        // TODO: ADD HIDDEN A11Y ELEMENT THAT ALWAYS READS TITLE
        return (
          <Box {...titleBoxProps}>
            {titleShowing ? (
              <Animated.View style={{ opacity: titleFade }}>
                <TextView {...titleTextViewProps}>{title.text}</TextView>
              </Animated.View>
            ) : (
              // TODO: Update variant after Theo's branch merged to dev
              <TextView variant="BitterBoldHeading" opacity={VaOpacity} allowFontScaling={false}>
                VA
              </TextView>
            )}
          </Box>
        )
      }

      case 'VA': {
        return (
          // TODO: Update variant after Theo's branch merged to dev
          <TextView variant="BitterBoldHeading" accessibilityLabel={'V-A'} allowFontScaling={false}>
            VA
          </TextView>
        )
      }
    }
  }

  return (
    <>
      <Box {...titleBannerProps}>
        <Box ml={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding} flex={1} alignItems={'flex-start'}>
          {leftButton && (
            <TouchableWithoutFeedback ref={focusButton === 'Left' ? focusRef : () => {}} onPress={leftButton.onPress} accessibilityRole="button">
              <Box {...leftBoxProps}>
                {leftButton.icon && <VAIcon {...leftButton.icon} preventScaling={true} />}
                <Box display="flex" flexDirection="row" alignItems="center">
                  <TextView {...leftTextViewProps}>{leftButton.text}</TextView>
                </Box>
              </Box>
            </TouchableWithoutFeedback>
          )}
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
