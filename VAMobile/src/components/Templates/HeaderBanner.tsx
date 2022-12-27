import { TouchableWithoutFeedback } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'

import { Box, BoxProps, TextView, TextViewProps, VAIcon, VAIconProps } from 'components'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'

export type HeaderBannerProps = {
  /** text of the title bar left button(no text or on press it doesn't appear) */
  leftButtonText?: string
  /** a11y label for left button text */
  leftButtonA11yLabel?: string
  /** text of the title bar title(no text it doesn't appear) */
  title?: string
  /** a11y label for title text */
  titleA11yLabel?: string
  /** text of the title bar right button(no text or on press it doesn't appear) */
  rightButtonText?: string
  /** a11y label for right button text */
  rightButtonA11yLabel?: string
  /** function called when left button is pressed(no text or on press it doesn't appear) */
  onLeftTitleButtonPress?: () => void
  /** function called when right button is pressed(no text or on press it doesn't appear) */
  onRightTitleButtonPress?: () => void
  /** sets the banner border */
  bannerDivider?: boolean
  /** icon for title bar left button(must have left button text to display) */
  leftVAIconProps?: VAIconProps
  /** icon for title bar right button(must have right button text to display) */
  rightVAIconProps?: VAIconProps
  /** left icon placement, default is left, true is top, false is left */
  leftIconOnTop?: boolean
  /** focus on left Button */
  focusLeftButton?: boolean
  /** focus on right Button */
  focusRightButton?: boolean
  /** hide title accessibility */
  titleAccesibilityHidden?: boolean
}

const HeaderBanner: FC<HeaderBannerProps> = ({
  leftButtonText,
  title,
  rightButtonText,
  onLeftTitleButtonPress,
  onRightTitleButtonPress,
  bannerDivider,
  leftVAIconProps,
  rightVAIconProps,
  leftIconOnTop,
  leftButtonA11yLabel,
  rightButtonA11yLabel,
  titleA11yLabel,
  focusLeftButton,
  focusRightButton,
  titleAccesibilityHidden,
}) => {
  const theme = useTheme()
  const [focusRef, setFocus] = useAccessibilityFocus<TouchableWithoutFeedback>()
  useFocusEffect(setFocus)

  const titleBannerProps: BoxProps = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    minHeight: 64,
    backgroundColor: 'main',
    borderBottomWidth: bannerDivider ? 1 : 0,
    borderBottomColor: 'menuDivider',
  }

  const boxProps: BoxProps = {
    alignItems: 'center',
    p: theme.dimensions.buttonPadding,
    minHeight: 64,
  }

  const titleBoxProps: BoxProps = {
    alignItems: 'center',
    p: theme.dimensions.buttonPadding,
    minHeight: 64,
    accessibilityElementsHidden: titleAccesibilityHidden ? true : false,
    importantForAccessibility: titleAccesibilityHidden ? 'no-hide-descendants' : 'yes',
  }

  const leftBoxProps: BoxProps = {
    alignItems: 'center',
    p: theme.dimensions.buttonPadding,
    minHeight: 64,
    flexDirection: leftIconOnTop ? 'column' : 'row',
  }

  const rightTextViewProps: TextViewProps = {
    color: 'footerButton',
    variant: rightVAIconProps ? 'textWithIconButton' : 'MobileBody',
    accessibilityLabel: rightButtonA11yLabel,
  }

  const leftTextViewProps: TextViewProps = {
    color: 'footerButton',
    variant: leftVAIconProps ? 'textWithIconButton' : 'MobileBody',
    accessibilityLabel: leftButtonA11yLabel,
  }

  const titleTextProps: TextViewProps = {
    variant: 'MobileBodyBold',
    accessibilityLabel: titleA11yLabel,
  }

  return (
    <>
      <Box {...titleBannerProps}>
        <Box ml={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding} flex={1} alignItems={'flex-start'}>
          {leftButtonText && onLeftTitleButtonPress && (
            <TouchableWithoutFeedback ref={focusLeftButton ? focusRef : () => {}} onPress={onLeftTitleButtonPress} accessibilityRole="button">
              <Box {...leftBoxProps}>
                {leftVAIconProps && <VAIcon name={leftVAIconProps.name} width={leftVAIconProps.width} height={leftVAIconProps.height} fill={leftVAIconProps.fill} />}
                <Box display="flex" flexDirection="row" alignItems="center">
                  <TextView {...leftTextViewProps}>{leftButtonText}</TextView>
                </Box>
              </Box>
            </TouchableWithoutFeedback>
          )}
        </Box>
        {title && (
          <Box mt={theme.dimensions.buttonPadding} flex={3}>
            <Box {...titleBoxProps}>
              <Box display="flex" flexDirection="row" alignItems="center">
                <TextView {...titleTextProps}>{title}</TextView>
              </Box>
            </Box>
          </Box>
        )}
        <Box mr={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding} flex={1} alignItems={'flex-end'}>
          {rightButtonText && onRightTitleButtonPress && (
            <TouchableWithoutFeedback ref={focusRightButton ? focusRef : () => {}} onPress={onRightTitleButtonPress} accessibilityRole="button">
              <Box {...boxProps}>
                {rightVAIconProps && <VAIcon name={rightVAIconProps.name} width={rightVAIconProps.width} height={rightVAIconProps.height} fill={rightVAIconProps.fill} />}
                <Box display="flex" flexDirection="row" alignItems="center">
                  <TextView {...rightTextViewProps}>{rightButtonText}</TextView>
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
