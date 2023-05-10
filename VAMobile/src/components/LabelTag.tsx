import { Pressable, PressableProps } from 'react-native'
import React, { FC } from 'react'

import { useTheme } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

export const LabelTagTypeConstants: {
  tagBlue: LabelTagTypes
  tagInactive: LabelTagTypes
  tagYellow: LabelTagTypes
  tagGreen: LabelTagTypes
} = {
  tagBlue: 'tagBlue',
  tagInactive: 'tagInactive',
  tagYellow: 'tagYellow',
  tagGreen: 'tagGreen',
}

export type LabelTagTypes = 'tagBlue' | 'tagInactive' | 'tagYellow' | 'tagGreen'

export type LabelTagProps = {
  /** Message to be shown on the tag*/
  text: string

  /** Defines the color and look of the tag */
  labelType: LabelTagTypes

  /** Optional accessibility label */
  a11yLabel?: string

  /** Optional method called when tag is pressed */
  onPress?: () => void

  /** Optional accessibility hint if there is an on press */
  a11yHint?: string
}

/**Common component to show a text inside a tag*/
const LabelTag: FC<LabelTagProps> = ({ text, labelType, onPress, a11yHint, a11yLabel }) => {
  const theme = useTheme()

  const textView = (
    <TextView flexWrap={'wrap'} color={'labelTag'} variant={'LabelTag'} px={12} py={4}>
      {text}
    </TextView>
  )

  let wrapperProps: BoxProps = {
    minWidth: theme.dimensions.tagMinWidth,
    minHeight: theme.dimensions.touchableMinHeight,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: labelType,
    borderColor: labelType,
    borderWidth: 1,
    borderRadius: 100,
  }

  const getContent = () => {
    if (!onPress) {
      if (a11yLabel) {
        wrapperProps = {
          ...wrapperProps,
          accessibilityLabel: a11yLabel,
        }
      }

      return <Box {...wrapperProps}>{textView}</Box>
    }

    let pressableProps: PressableProps = {
      onPress: onPress,
      accessible: true,
      accessibilityRole: 'button',
    }

    if (a11yHint) {
      pressableProps = {
        ...pressableProps,
        accessibilityHint: a11yHint,
      }
    }

    if (a11yLabel) {
      pressableProps = {
        ...pressableProps,
        accessibilityLabel: a11yLabel,
      }
    }

    const infoIconProps: VAIconProps = {
      name: 'Info',
      fill: 'tagInfoIcon',
      fill2: 'transparent',
      height: 16,
      width: 16,
      mr: 10,
    }

    return (
      <Pressable {...pressableProps}>
        <Box {...wrapperProps}>
          {textView}
          <VAIcon {...infoIconProps} />
        </Box>
      </Pressable>
    )
  }

  return getContent()
}

export default LabelTag
