import { Pressable, ViewStyle } from 'react-native'
import React, { FC, useState } from 'react'

import { BackgroundVariant, BorderColorVariant, BorderStyles, BorderWidths, Box, BoxProps, TextView, VAIcon } from 'components'
import { VAIconColors, VATextColors } from 'styles/theme'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import MessagesCountTag from './MessagesCountTag'

interface HomeNavButtonProps {
  /**string for header and used to create testID for accessibility*/
  title: string
  /**string secondary text that seats on the second row */
  subText: string
  /**string for accessibility hint */
  a11yHint?: string
  /**function to be called when press occurs */
  onPress: () => void
  /**BackgroundVariant color for background */
  backgroundColor?: BackgroundVariant
  /**BackgroundVariant color for active state */
  backgroundColorActive?: BackgroundVariant
  /**VATextColors color for text */
  textColor?: keyof VATextColors
  /** VAIconColors icon color*/
  iconColor?: keyof VAIconColors
  /**BorderWidths possible widths for HomeNavButton*/
  borderWidth?: BorderWidths
  /**BorderColorVariant color for the borders*/
  borderColor?: BorderColorVariant
  /**BorderColorVariant color for active state for the borders*/
  borderColorActive?: BorderColorVariant
  /**BorderStyles denotes the styling of the borders*/
  borderStyle?: BorderStyles
  /**number for the tag */
  tagCount?: number
  /**a11y for the tag */
  tagCountA11y?: string
}

/**
 * Reusable large navigation button
 * @returns LargeNavButton component
 */
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
  const accessibilityLabel = `${title} ${tagCountA11y || ''} ${subText}`.trim()

  return (
    <Box {...boxProps}>
      <Pressable
        style={pressableStyles}
        onPress={_onPress}
        onPressIn={_onPressIn}
        onPressOut={_onPressOut}
        accessible={true}
        accessibilityRole={'menuitem'}
        testID={title}
        accessibilityLabel={accessibilityLabel}
        {...a11yHintProp(a11yHint || '')}>
        <Box flex={1}>
          <Box flexDirection={'row'} flexWrap={'wrap'} mb={theme.dimensions.condensedMarginBetween}>
            <TextView mr={theme.dimensions.condensedMarginBetween} variant="BitterBoldHeading" color={textColor}>
              {title}
            </TextView>
            {!!tagCount && <MessagesCountTag unread={tagCount} />}
          </Box>
          <TextView color={textColor}>{subText}</TextView>
        </Box>
        <VAIcon name="ArrowRight" fill={`${iconColor ? iconColor : 'inactive'}`} width={10} height={15} ml={theme.dimensions.listItemDecoratorMarginLeft} />
      </Pressable>
    </Box>
  )
}

export default LargeNavButton
