import { Pressable, PressableProps } from 'react-native'
import React, { FC, ReactElement } from 'react'

import { HiddenA11yElement } from 'styles/common'
import { useTheme } from 'utils/hooks'
import Box, { BoxProps } from './Box'

export type MultiTouchCardProps = {
  /** read by screen readers to identify the cards place in a list */
  orderIdentifier?: string
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

const MultiTouchCard: FC<MultiTouchCardProps> = ({ orderIdentifier, mainContent, bottomContent, bottomOnPress, bottomA11yHint, mainA11yLabel, bottomA11yLabel }) => {
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
      {orderIdentifier && <HiddenA11yElement accessibilityLabel={orderIdentifier}>{orderIdentifier}</HiddenA11yElement>}
      <Box {...mainBoxProps}>{mainContent}</Box>
      {hasBottomContent && getBottomContent()}
    </>
  )
}

export default MultiTouchCard
