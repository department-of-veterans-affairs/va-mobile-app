import { BackButton } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ReactNode } from 'react'
import { StackNavigationOptions } from '@react-navigation/stack'
import { getHeaderStyles } from 'styles/common'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'utils/hooks'
import HeaderTitle from 'components/HeaderTitle'
import React from 'react'

/**
 * Hook to get the current header styles in a component
 * @returns header style object for the top nav
 */
export const useHeaderStyles = (): StackNavigationOptions => {
  const insets = useSafeAreaInsets()
  let headerStyles = getHeaderStyles(insets.top, useTheme())

  headerStyles = {
    ...headerStyles,
    headerLeft: (props): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={true} />,
    headerTitle: (header) => <HeaderTitle headerTitle={header.children} />,
  }
  return headerStyles
}

/**
 * Hook to recreate SafeArea top padding through header styles:
 * This is for screens that are meant to look header-less (no headerTitle, or right/left buttons), since the SafeArea
 * top padding is already included in useHeaderStyles above.
 *
 * We are recreating SafeArea top padding through the header rather than just wrapping the app in a SafeArea with top padding, because
 * the latter method causes misalignment issues between the left/right header buttons and the center title for screens with headers.
 *
 * @returns the header style with padding
 */
export const useTopPaddingAsHeaderStyles = (): StackNavigationOptions => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()

  return {
    headerBackTitleVisible: false,
    headerBackTitle: undefined,
    headerTitle: '',
    headerStyle: {
      backgroundColor: theme?.colors?.background?.main,
      shadowColor: 'transparent', // removes bottom border
      height: insets.top,
    },
  }
}
