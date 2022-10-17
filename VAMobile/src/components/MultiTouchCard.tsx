import { Pressable, PressableProps } from 'react-native'
import React, { FC, ReactElement } from 'react'

import { useTheme } from '../utils/hooks'
import Box, { BoxProps } from './Box'

export type MultiTouchCardProps = {
  /** accessibility value used by all three buttons */
  a11yValue?: string
  /** accessibility label for the main section */
  mainA11yLabel?: string
  /** content to display in the main section */
  mainContent: ReactElement
  /** called when the bottom button is pressed */
  bottomOnPress?: () => void
  /** content to display in the bottom button */
  bottomContent?: ReactElement
  /** hint for the bottom button action */
  bottomA11yHint?: string
  /** accessibility label for the bottom section */
  bottomA11yLabel?: string
}

const MultiTouchCard: FC<MultiTouchCardProps> = ({ a11yValue, mainContent, bottomContent, bottomOnPress, bottomA11yHint, mainA11yLabel, bottomA11yLabel }) => {
  const theme = useTheme()

  const hasBottomContent = !!bottomContent

  const background = 'list'

  let mainBoxProps: BoxProps = {
    width: '100%',
    minHeight: theme.dimensions.touchableMinHeight,
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.gutter,
    borderWidth: theme.dimensions.borderWidth,
    borderColor: 'primary',
    borderStyle: 'solid',
    backgroundColor: background,
    borderRadiusTop: 8,
    borderRadiusBottom: hasBottomContent ? 0 : 8,
  }

  if (mainA11yLabel) {
    mainBoxProps = { ...mainBoxProps, accessibilityLabel: mainA11yLabel }
  }

  let bottomPressableProps: PressableProps = {
    onPress: bottomOnPress,
    accessible: true,
    accessibilityRole: 'button',
    accessibilityValue: { text: a11yValue },
    accessibilityHint: bottomA11yHint,
  }

  let bottomBoxProps: BoxProps = {
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.gutter,
    backgroundColor: background,
    borderRadiusBottom: 8,
    borderTopWidth: 0,
    borderWidth: theme.dimensions.borderWidth,
    borderColor: 'primary',
    borderStyle: 'solid',
  }

  const getBottomContent = () => {
    if (bottomOnPress) {
      if (bottomA11yLabel) {
        bottomPressableProps = { ...mainBoxProps, accessibilityLabel: bottomA11yLabel }
      }

      return (
        <Pressable {...bottomPressableProps}>
          <Box {...bottomBoxProps}>{bottomContent}</Box>
        </Pressable>
      )
    } else {
      if (bottomA11yLabel) {
        bottomBoxProps = { ...mainBoxProps, accessibilityLabel: bottomA11yLabel }
      }

      return <Box {...bottomBoxProps}>{bottomContent}</Box>
    }
  }

  return (
    <>
      <Box {...mainBoxProps}>{mainContent}</Box>
      {hasBottomContent && getBottomContent()}
    </>
  )
}

export default MultiTouchCard
