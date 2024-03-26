import React, { FC } from 'react'
import { Platform, Pressable, ViewStyle } from 'react-native'

import { Box, BoxProps, TextView, VAIcon } from 'components'
import { a11yHintProp } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

import colors from '../styles/themes/VAColors'

interface HomeNavButtonProps {
  /**string for header and used to create testID for accessibility*/
  title: string
  /**string secondary text that seats on the second row */
  subText?: string
  /**a11y string secondary text that seats on the second row */
  subTextA11yLabel?: string
  /**string for accessibility hint */
  a11yHint?: string
  /**function to be called when press occurs */
  onPress: () => void
}

/**
 * Reusable large navigation button
 * @returns LargeNavButton component
 */
const LargeNavButton: FC<HomeNavButtonProps> = ({ title, subText, a11yHint, onPress }: HomeNavButtonProps) => {
  const theme = useTheme()

  const boxProps: BoxProps = {
    py: theme.dimensions.cardPadding,
    px: theme.dimensions.buttonPadding,
    mb: theme.dimensions.condensedMarginBetween,
    backgroundColor: 'textBox',
    style: {
      shadowColor: colors.black,
      ...Platform.select({
        ios: {
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
  }

  const pressableStyles: ViewStyle = {
    flexDirection: 'row',
  }

  return (
    <Box {...boxProps}>
      <Pressable
        style={pressableStyles}
        onPress={onPress}
        accessible={true}
        accessibilityRole={'menuitem'}
        testID={title}
        accessibilityLabel={title}
        accessibilityValue={{ text: subText }}
        {...a11yHintProp(a11yHint || '')}>
        <Box flex={1}>
          <Box
            flexDirection={'row'}
            flexWrap={'wrap'}
            mb={subText ? theme.dimensions.condensedMarginBetween : undefined}>
            <TextView variant="LargeNavButton">{title}</TextView>
          </Box>
          <Box flexDirection={'row'} alignItems={'center'}>
            <Box flex={1}>
              <TextView variant={'LargeNavSubtext'}>{subText}</TextView>
            </Box>
            <VAIcon
              width={24}
              height={24}
              name="RightArrowInCircle"
              fill={theme.colors.icon.largeNavButton}
              fill2={theme.colors.icon.transparent}
              ml={theme.dimensions.listItemDecoratorMarginLeft}
            />
          </Box>
        </Box>
      </Pressable>
    </Box>
  )
}

export default LargeNavButton
