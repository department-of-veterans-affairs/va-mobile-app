import React, { FC } from 'react'
import styled from 'styled-components/native'

import { Box, BoxProps, TextView, VAIcon } from 'components'
import { VABackgroundColors, VAIconColors, VATextColors } from '../../styles/theme'
import { ViewFlexRowSpaceBetween } from 'styles/common'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
import { useTheme } from 'utils/hooks'

const StyledTouchableOpacity = styled(ViewFlexRowSpaceBetween)`
  width: 100%;
`

interface HomeNavButtonProps {
  title: string
  subText: string
  a11yHint: string
  onPress: () => void
  backgroundColor?: keyof VABackgroundColors
  textColor?: keyof VATextColors
  iconColor?: keyof VAIconColors
}

/**
 * Reusable menu item for the HomeScreen
 *
 * @param title - string for header and used to create testID for accessibility
 * @param subText - string secondary text that seats on the second row
 * @param onPress - function to be called when press occurs
 * @param a11yHint - string for accessibility hint
 *
 * @returns HomeNavButton component
 */
const HomeNavButton: FC<HomeNavButtonProps> = ({ title, subText, a11yHint, onPress, backgroundColor, textColor, iconColor }: HomeNavButtonProps) => {
  const theme = useTheme()

  const _onPress = (): void => {
    onPress()
  }

  const testId = generateTestID(title, '')

  const boxProps: BoxProps = {
    minHeight: 81,
    borderRadius: 6,
    p: theme.dimensions.cardPadding,
    mb: theme.dimensions.marginBetweenCards,
    backgroundColor: backgroundColor ? backgroundColor : 'textBox',
  }

  return (
    <Box {...boxProps}>
      <StyledTouchableOpacity onPress={_onPress} {...testIdProps(testId)} accessible={true} accessibilityRole={'menuitem'} {...a11yHintProp(a11yHint)}>
        <Box flex={1}>
          <TextView mb={10} variant="BitterBoldHeading" {...testIdProps(testId + '-title')} color={textColor}>
            {title}
          </TextView>
          <TextView {...testIdProps(testId + '-subtext')} color={textColor}>
            {subText}
          </TextView>
        </Box>
        <VAIcon name="ArrowRight" fill={`${iconColor ? iconColor : 'inactive'}`} width={10} height={15} />
      </StyledTouchableOpacity>
    </Box>
  )
}

export default HomeNavButton
