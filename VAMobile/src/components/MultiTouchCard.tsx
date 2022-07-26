import { Pressable, PressableProps } from 'react-native'
import React, { FC, ReactElement, useState } from 'react'

import { ButtonDecorator } from './BaseListItem'
import { VAButtonTextColors, VAIconColors, VATextColors } from 'styles/theme'
import { useTheme } from '../utils/hooks'
import Box, { BackgroundVariant, BoxProps } from './Box'
import TextView, { TextViewProps } from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

export type MultiTouchCardProps = {
  /** called when the top button is pressed */
  topOnPress?: () => void
  /** Text to display in the top button */
  topText?: string
  /** color of the text in the top bar */
  topTextColor?: keyof VATextColors | keyof VAButtonTextColors
  /** background color of the top button */
  topBackgroundColor?: BackgroundVariant
  /** color of the icon if necessary to contrast the background */
  topIconColor?: keyof VAIconColors
  /** accessibility value used by all three buttons */
  a11yValue?: string
  /** hint for the top button action */
  topA11yHint?: string
  /** called when the middle button is pressed */
  middleOnPress?: () => void
  /** hint for the middle button action */
  middleA11yHint?: string
  /** content to display in the middle button */
  middleContent: ReactElement
  /** called when the bottom button is pressed */
  bottomOnPress?: () => void
  /** content to display in the bottom button */
  bottomContent?: ReactElement
  /** hint for the bottom button action */
  bottomA11yHint?: string
}

const MultiTouchCard: FC<MultiTouchCardProps> = ({
  topText,
  topTextColor,
  topBackgroundColor,
  a11yValue,
  topA11yHint,
  topIconColor,
  topOnPress,
  middleContent,
  middleA11yHint,
  middleOnPress,
  bottomContent,
  bottomOnPress,
  bottomA11yHint,
}) => {
  const theme = useTheme()
  const [isPressed, setIsPressed] = useState(false)

  const _onPressIn = (): void => {
    setIsPressed(true)
  }

  const _onPressOut = (): void => {
    setIsPressed(false)
  }

  const hasBottomContent = !!bottomContent
  const hasTopContent = !!topText

  const background = 'list'
  const activeBackground = 'listActive'

  const topPressableProps: PressableProps = {
    onPress: topOnPress,
    accessible: true,
    accessibilityRole: 'button',
    accessibilityValue: { text: a11yValue },
    accessibilityHint: topA11yHint,
  }

  const topTextProps: TextViewProps = topTextColor
    ? {
        color: topTextColor,
      }
    : {}

  const topBoxProps: BoxProps = {
    backgroundColor: topBackgroundColor ? topBackgroundColor : background,
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.gutter,
    borderBottomWidth: topBackgroundColor ? 0 : theme.dimensions.borderWidth,
    borderColor: 'primary',
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadiusTop: 8,
  }

  const topIcon: VAIconProps = {
    name: 'InfoIcon',
    fill: topIconColor || 'infoIcon',
    height: 16,
    width: 16,
  }

  const middlePressableProps: PressableProps = {
    onPress: middleOnPress,
    onPressIn: _onPressIn,
    onPressOut: _onPressOut,
    accessible: true,
    accessibilityRole: 'button',
    accessibilityValue: { text: a11yValue },
    accessibilityHint: middleA11yHint,
  }

  const middleBoxProps: BoxProps = {
    width: '100%',
    minHeight: theme.dimensions.touchableMinHeight,
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.gutter,
    borderBottomWidth: hasBottomContent ? theme.dimensions.borderWidth : 0,
    borderColor: 'primary',
    borderStyle: 'solid',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isPressed ? activeBackground : background,
    borderRadiusTop: hasTopContent ? 0 : 8,
    borderRadiusBottom: hasBottomContent ? 0 : 8,
  }

  const bottomPressableProps: PressableProps = {
    onPress: bottomOnPress,
    accessible: true,
    accessibilityRole: 'button',
    accessibilityValue: { text: a11yValue },
    accessibilityHint: bottomA11yHint,
  }

  const bottomBoxProps: BoxProps = {
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.gutter,
    backgroundColor: background,
    borderRadiusBottom: 8,
  }

  return (
    <>
      {hasTopContent && (
        <Pressable {...topPressableProps}>
          <Box {...topBoxProps}>
            <TextView {...topTextProps}>{topText}</TextView>
            <Box>
              <VAIcon {...topIcon} />
            </Box>
          </Box>
        </Pressable>
      )}
      <Pressable {...middlePressableProps}>
        <Box {...middleBoxProps}>
          {middleContent}
          <Box ml={theme.dimensions.listItemDecoratorMarginLeft}>
            <ButtonDecorator />
          </Box>
        </Box>
      </Pressable>
      {hasBottomContent && (
        <Pressable {...bottomPressableProps}>
          <Box {...bottomBoxProps}>{bottomContent}</Box>
        </Pressable>
      )}
    </>
  )
}

export default MultiTouchCard
