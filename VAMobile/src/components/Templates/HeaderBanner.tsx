import { TouchableWithoutFeedback } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'

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
  /** flag to indicate title visible in header, "VA" text when not shown */
  titleShowing: boolean
  /** Scroll offset position to control transition behavior */
  scrollOffset: number
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
    minHeight: 64,
    backgroundColor: 'main',
    borderBottomWidth: bannerDivider ? 1 : 0,
    borderBottomColor: 'menuDivider',
  }

  const commonBoxProps: BoxProps = {
    alignItems: 'center',
    p: theme.dimensions.buttonPadding,
    minHeight: 64,
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
      variant: 'MobileBodyBold',
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

        {title?.type === 'Static' && (
          <Box mt={theme.dimensions.buttonPadding} flex={2}>
            <Box {...titleBoxProps}>
              <Box display="flex" flexDirection="row" alignItems="center">
                <TextView {...titleTextViewProps}>{title.text}</TextView>
              </Box>
            </Box>
          </Box>
        )}

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
