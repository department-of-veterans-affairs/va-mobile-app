import { Pressable, ViewStyle } from 'react-native'
import React, { FC, useState } from 'react'

import { BackgroundVariant, BorderColorVariant, BorderStyles, BorderWidths, Box, BoxProps, TextView, VAIcon } from 'components'
import { VAIconColors, VATextColors } from 'styles/theme'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import MessagesCountTag from './MessagesCountTag'

interface HomeNavButtonProps {
  /** title text */
  title: string
  /** text appearing under the title */
  subText: string
  /** accessibility hint for the button */
  a11yHint: string
  /** called when the button is pressed */
  onPress: () => void
  /** optional background color of the button */
  backgroundColor?: BackgroundVariant
  /** optional background color for the button active state */
  backgroundColorActive?: BackgroundVariant
  /** optional text color for the title */
  textColor?: keyof VATextColors
  /** optional text color for the subtext */
  secondaryTextColor?: keyof VATextColors
  /** optional color for the arrow icon */
  iconColor?: keyof VAIconColors
  /** optional width of the border */
  borderWidth?: BorderWidths
  /** optional border color */
  borderColor?: BorderColorVariant
  /** optional border color for the active state */
  borderColorActive?: BorderColorVariant
  /** optional border style */
  borderStyle?: BorderStyles
  /** optional value to display a count tag */
  tagCount?: number
  /** optional accessibility text for the count */
  tagCountA11y?: string
}

const LargeNavButton: FC<HomeNavButtonProps> = ({
  title,
  subText,
  a11yHint,
  onPress,
  backgroundColor,
  backgroundColorActive,
  textColor,
  iconColor,
  borderWidth,
  borderColor,
  borderColorActive,
  borderStyle,
  tagCount,
  tagCountA11y,
}: HomeNavButtonProps) => {
  const theme = useTheme()
  const [isPressed, setIsPressed] = useState(false)

  const _onPressIn = (): void => {
    setIsPressed(true)
  }

  const _onPressOut = (): void => {
    setIsPressed(false)
  }

  const _onPress = (): void => {
    onPress()
  }

  const getBorderColor = (): BorderColorVariant | undefined => {
    // animate borderColor
    if (isPressed && borderColorActive) {
      return borderColorActive
    }
    return borderColor
  }

  const getBackgroundColor = (): BackgroundVariant => {
    // animate backgroundColor
    if (isPressed && backgroundColorActive) {
      return backgroundColorActive
    }

    return backgroundColor ? backgroundColor : 'textBox'
  }

  const boxProps: BoxProps = {
    minHeight: 81,
    borderRadius: 6,
    p: theme.dimensions.cardPadding,
    mb: theme.dimensions.condensedMarginBetween,
    backgroundColor: getBackgroundColor(),
    borderWidth,
    borderColor: getBorderColor(),
    borderStyle,
  }

  const pressableStyles: ViewStyle = {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  }
  const testId = `${title} ${tagCountA11y || ''}`.trim()

  return (
    <Box {...boxProps}>
      <Pressable
        style={pressableStyles}
        onPress={_onPress}
        onPressIn={_onPressIn}
        onPressOut={_onPressOut}
        accessible={true}
        accessibilityRole={'menuitem'}
        {...a11yHintProp(a11yHint)}
        {...testIdProps(testId)}>
        <Box flex={1}>
          <Box flexDirection={'row'} flexWrap={'wrap'} mb={theme.dimensions.condensedMarginBetween}>
            <TextView mr={theme.dimensions.condensedMarginBetween} variant="BitterBoldHeading" color={textColor || 'primaryTitle'}>
              {title}
            </TextView>
            {!!tagCount && <MessagesCountTag unread={tagCount} />}
          </Box>
          <TextView color={textColor}>{subText}</TextView>
        </Box>
        <VAIcon name="ArrowRight" fill={`${iconColor ? iconColor : 'largeNav'}`} width={10} height={15} ml={theme.dimensions.listItemDecoratorMarginLeft} />
      </Pressable>
    </Box>
  )
}

export default LargeNavButton
