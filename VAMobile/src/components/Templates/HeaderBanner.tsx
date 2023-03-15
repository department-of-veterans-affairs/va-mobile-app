import { Animated, Easing, TouchableWithoutFeedback, View, ViewProps } from 'react-native'
import { Shadow, ShadowProps } from 'react-native-shadow-2'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC, useEffect, useReducer, useState } from 'react'

import { Box, BoxProps, DescriptiveBackButton, TextView, TextViewProps, VAIcon, VAIconProps } from 'components'
import { useAccessibilityFocus, useIsScreenReaderEnabled, useTheme } from 'utils/hooks'
import MenuView, { MenuViewActionsType } from 'components/Menu'

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
  /** shows the menu icon with the specified action types (won't be shown if rightButton is set) */
  menuViewActions?: MenuViewActionsType
}

const HeaderBanner: FC<HeaderBannerProps> = ({ leftButton, title, rightButton, divider: bannerDivider, menuViewActions }) => {
  const theme = useTheme()
  const [focusRef, setFocus] = useAccessibilityFocus<TouchableWithoutFeedback>()
  const [focusTitle, setFocusTitle] = useAccessibilityFocus<View>()
  const focus = leftButton ? 'Left' : title ? 'Title' : 'Right'
  useFocusEffect(focus === 'Title' ? setFocusTitle : setFocus)
  const screenReaderEnabled = useIsScreenReaderEnabled(true)

  const TEXT_CONSTRAINT_THRESHOLD = 30

  const transition = title?.type === 'Transition'

  /**
   * Reducer to swap between "VA" and title based on scroll
   */
  const titleShowingReducer = (initTitleShowing: boolean) => {
    if (screenReaderEnabled) {
      return true
    }
    return transition ? title.scrollOffset >= title.transitionHeaderHeight : initTitleShowing
  }

  const [titleShowing, updateTitleShowing] = useReducer(titleShowingReducer, false)
  const [titleFade] = useState(new Animated.Value(0))

  /**
   * With reducers above and useEffect below, handles carrying out transitioning header functionality
   */
  useEffect(() => {
    if (transition && (title.scrollOffset <= title.transitionHeaderHeight || !titleShowing)) {
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

  const zIndex = {
    zIndex: 1,
  }

  const headerDropShadow: ShadowProps =
    titleShowing && !screenReaderEnabled
      ? {
          startColor: theme.colors.background.headerDropShadow,
          distance: 4,
          sides: { start: false, top: false, bottom: true, end: false },
        }
      : { disabled: true }

  const titleBannerProps: BoxProps = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    minHeight: theme.dimensions.headerHeight,
    backgroundColor: bannerDivider ? 'largePanelHeader' : 'main',
    borderBottomWidth: bannerDivider ? theme.dimensions.borderWidth : 0,
    borderBottomColor: 'menuDivider',
  }

  const commonBoxProps: BoxProps = {
    alignItems: 'center',
    justifyContent: 'center',
    p: theme.dimensions.buttonPadding,
    minHeight: theme.dimensions.headerHeight,
  }

  let leftTextViewProps: TextViewProps = {}
  let titleTextViewProps: TextViewProps = {}
  let rightTextViewProps: TextViewProps = {}

  // Calculate total length of header text. If too long, force title to wrap
  const titleLength = title?.type === 'VA' ? 2 : title?.title.length || 0
  const totalTextLength = (leftButton?.text.length || 0) + titleLength + (rightButton?.text.length || 0)
  const constrainTitle = totalTextLength > TEXT_CONSTRAINT_THRESHOLD

  if (leftButton) {
    leftTextViewProps = {
      color: 'footerButton',
      variant: 'MobileBody',
      accessibilityLabel: leftButton.a11yLabel,
      allowFontScaling: false,
    }
  }

  const titleA11y = title?.type === 'VA' ? 'V-A' : title?.a11yLabel ? title.a11yLabel : title?.title
  const titleViewProps: ViewProps = { accessibilityLabel: titleA11y, accessibilityRole: 'header', accessible: true }
  const titleBoxProps: BoxProps = {
    ...commonBoxProps,
    accessibilityElementsHidden: true,
    importantForAccessibility: 'no-hide-descendants',
  }
  if (title) {
    titleTextViewProps = {
      variant: transition ? 'MobileBodyTight' : title.type === 'VA' ? 'VAHeader' : 'MobileBodyBold',
      textAlign: 'center',
      allowFontScaling: false,
    }
  }

  if (rightButton) {
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
      case 'Static':
      case 'VA': {
        const titleText = title?.type === 'VA' ? 'VA' : title.title
        return <TextView {...titleTextViewProps}>{titleText}</TextView>
      }

      case 'Transition': {
        if (titleShowing) {
          return (
            <Animated.View style={{ opacity: titleFade }}>
              <TextView {...titleTextViewProps}>{title.title}</TextView>
            </Animated.View>
          )
        } else {
          return (
            <TextView variant="VAHeader" allowFontScaling={false}>
              VA
            </TextView>
          )
        }
      }
    }
  }

  return (
    <View {...zIndex}>
      <Shadow {...headerDropShadow}>
        <View {...titleBannerProps}>
          <Box {...titleBannerProps}>
            <Box flex={4} alignItems="flex-start">
              {leftButton?.descriptiveBack ? (
                <DescriptiveBackButton label={leftButton.text} onPress={leftButton.onPress} focusOnButton={focus === 'Left'} />
              ) : leftButton ? (
                <Box ml={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding}>
                  <TouchableWithoutFeedback ref={focus === 'Left' ? focusRef : () => {}} onPress={leftButton.onPress} accessibilityRole="button">
                    <Box {...commonBoxProps}>
                      <Box display="flex" flexDirection="row" alignItems="center">
                        <TextView {...leftTextViewProps}>{leftButton.text}</TextView>
                      </Box>
                    </Box>
                  </TouchableWithoutFeedback>
                </Box>
              ) : null}
            </Box>

            {title && (
              <Box mt={theme.dimensions.buttonPadding} flex={constrainTitle ? 5 : undefined}>
                <View {...titleViewProps} ref={focus === 'Title' ? focusTitle : () => {}}>
                  <Box {...titleBoxProps}>{buildTitleDisplay()}</Box>
                </View>
              </Box>
            )}

            <Box mr={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding} flex={4} alignItems={'flex-end'}>
              {rightButton && (
                <TouchableWithoutFeedback ref={focus === 'Right' ? focusRef : () => {}} onPress={rightButton.onPress} accessibilityRole="button">
                  <Box {...commonBoxProps}>
                    {rightButton.icon && <VAIcon fill="link" height={24} width={24} preventScaling={true} {...rightButton.icon} />}
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <TextView {...rightTextViewProps}>{rightButton.text}</TextView>
                    </Box>
                  </Box>
                </TouchableWithoutFeedback>
              )}
              {!rightButton && menuViewActions && (
                <Box {...commonBoxProps}>
                  <MenuView actions={menuViewActions} />
                </Box>
              )}
            </Box>
          </Box>
        </View>
      </Shadow>
    </View>
  )
}

export default HeaderBanner
