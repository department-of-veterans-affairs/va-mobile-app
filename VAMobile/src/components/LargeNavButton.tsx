import React, { FC } from 'react'
import ContentLoader, { Rect } from 'react-content-loader/native'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, ViewStyle } from 'react-native'

import { Box, BoxProps, TextView, VAIcon } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

const SkeletonLoader = () => {
  const theme = useTheme()
  return (
    <ContentLoader
      backgroundColor={theme.colors.background.skeletonLoader}
      foregroundColor={theme.colors.background.skeletonLoaderSecondary}
      speed={0.6}
      width="150"
      height="10">
      <Rect width="100%" height="25" />
    </ContentLoader>
  )
}

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
  /** Show loading animation in place of subtext */
  showLoading?: boolean
  /** Optional test ID for button */
  testID?: string
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
  showLoading,
}: HomeNavButtonProps) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const boxProps: BoxProps = {
    py: theme.dimensions.cardPadding,
    px: theme.dimensions.buttonPadding,
    mb: theme.dimensions.condensedMarginBetween,
    backgroundColor: 'textBox',
    style: {
      shadowColor: 'black',
      ...Platform.select({
        ios: {
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
        },
        android: {
          elevation: 2,
        },
      }),
    },
  }

  const pressableStyles: ViewStyle = {
    width: '100%',
  }
  const accessibilityLabel = `${title} ${showLoading ? t('loadingActivity') : subText || ''}`.trim()

  return (
    <Box {...boxProps}>
      <Pressable
        style={pressableStyles}
        onPress={onPress}
        accessible={true}
        accessibilityRole={'link'}
        testID={title}
        accessibilityLabel={accessibilityLabel}
        {...a11yHintProp(a11yHint || '')}>
        <Box flexDirection="row">
          <Box flex={1}>
            <TextView variant="LargeNavButton">{title}</TextView>
            {showLoading ? (
              <TextView mt={30} flexDirection={'row'}>
                <SkeletonLoader />
              </TextView>
            ) : subText ? (
              <TextView mt={20} variant={'LargeNavSubtext'}>
                {subText}
              </TextView>
            ) : (
              <></>
            )}
          </Box>
          <VAIcon
            flexDirection="row"
            alignItems="flex-end"
            width={24}
            height={24}
            name="RightArrowInCircle"
            fill={theme.colors.icon.largeNavButton}
            fill2={'transparent'}
            ml={theme.dimensions.listItemDecoratorMarginLeft}
            preventScaling={true}
          />
        </Box>
      </Pressable>
    </Box>
  )
}

export default LargeNavButton
