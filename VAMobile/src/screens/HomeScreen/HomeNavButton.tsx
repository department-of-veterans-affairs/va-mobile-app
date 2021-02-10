import { Pressable, ViewStyle } from 'react-native'
import React, { FC, useState } from 'react'

import { BackgroundVariant, BorderColorVariant, BorderStyles, BorderWidths, Box, BoxProps, TextView, VAIcon } from 'components'
import { VAIconColors, VATextColors } from 'styles/theme'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
import { useTheme } from 'utils/hooks'

interface HomeNavButtonProps {
  title: string
  subText: string
  a11yHint: string
  onPress: () => void
  backgroundColor?: BackgroundVariant
  backgroundColorActive?: BackgroundVariant
  textColor?: keyof VATextColors
  iconColor?: keyof VAIconColors
  borderWidth?: BorderWidths
  borderColor?: BorderColorVariant
  borderColorActive?: BorderColorVariant
  borderStyle?: BorderStyles
}

/**
 * Reusable menu item for the HomeScreen
 *
 * @param title - string for header and used to create testID for accessibility
 * @param subText - string secondary text that seats on the second row
 * @param onPress - function to be called when press occurs
 * @param a11yHint - string for accessibility hint
 * @param backgroundColor - BackgroundVariant color for background
 * @param backgroundColorActive - BackgroundVariant color for active state
 * @param textColor - VATextColors color for text
 * @param iconColor - VAIconColors icon color
 * @param borderWidth - BorderWidths possible widths for HomeNavButton
 * @param borderColor - BorderColorVariant color for the borders
 * @param borderColorActive - BorderColorVariant color for active state for the borders
 * @param borderStyle - BorderStyles denotes the styling of the borders
 *
 * @returns HomeNavButton component
 */
const HomeNavButton: FC<HomeNavButtonProps> = ({
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

  const testId = generateTestID(title, '')

  const boxProps: BoxProps = {
    minHeight: 81,
    borderRadius: 6,
    p: theme.dimensions.cardPadding,
    mb: theme.dimensions.marginBetweenCards,
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

  return (
    <Box {...boxProps}>
      <Pressable
        style={pressableStyles}
        onPress={_onPress}
        onPressIn={_onPressIn}
        onPressOut={_onPressOut}
        {...testIdProps(testId)}
        accessible={true}
        accessibilityRole={'menuitem'}
        {...a11yHintProp(a11yHint)}>
        <Box flex={1}>
          <TextView mb={10} variant="BitterBoldHeading" {...testIdProps(testId + '-title')} color={textColor}>
            {title}
          </TextView>
          <TextView {...testIdProps(testId + '-subtext')} color={textColor}>
            {subText}
          </TextView>
        </Box>
        <VAIcon name="ArrowRight" fill={`${iconColor ? iconColor : 'inactive'}`} width={10} height={15} ml={theme.dimensions.listItemDecoratorMarginLeft} />
      </Pressable>
    </Box>
  )
}

export default HomeNavButton
