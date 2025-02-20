import React, { FC } from 'react'
import { AccessibilityRole, Pressable, PressableProps, useWindowDimensions } from 'react-native'

import { Icon, IconProps } from '@department-of-veterans-affairs/mobile-component-library'

import { useTheme } from 'utils/hooks'

import Box, { BoxProps } from './Box'
import TextView from './TextView'

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

  /** Optional role to override the default role of button */
  a11yRole?: AccessibilityRole
}

/**Common component to show a text inside a tag*/
const LabelTag: FC<LabelTagProps> = ({ text, labelType, onPress, a11yHint, a11yLabel, a11yRole }) => {
  const theme = useTheme()
  const fontScale = useWindowDimensions().fontScale
  const adjustSize = fontScale >= 2
  const textView = (
    <TextView
      flexWrap={'wrap'}
      color={'labelTag'}
      variant={'LabelTag'}
      pl={adjustSize ? 30 : 12}
      pr={adjustSize ? 8 : 12}
      pt={adjustSize ? 8 : 4}
      pb={adjustSize ? 12 : 4}>
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
      accessibilityRole: a11yRole || 'button',
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

    const infoIconProps: IconProps = {
      name: 'Info',
      fill: theme.colors.icon.tagInfoIcon,
      height: adjustSize ? 13 : 20,
      width: adjustSize ? 13 : 20,
    }

    return (
      <Pressable {...pressableProps}>
        <Box {...wrapperProps}>
          {textView}
          <Box mr={adjustSize ? 5 : 10}>
            <Icon {...infoIconProps} />
          </Box>
        </Box>
      </Pressable>
    )
  }

  return getContent()
}

export default LabelTag
