import { PixelRatio } from 'react-native'
import { ReactNode, useContext } from 'react'
import { StackHeaderLeftButtonProps, StackNavigationOptions } from '@react-navigation/stack'
import { TFunction } from 'i18next'
import { ThemeContext } from 'styled-components'
import { useTranslation as realUseTranslation } from 'react-i18next'
import React from 'react'

import { BackButton } from 'components'
import { VATheme } from 'styles/theme'
import { getHeaderStyles } from 'styles/common'
import { i18n_NS } from 'constants/namespaces'
import { useNavigation } from '@react-navigation/native'

/**
 * Returns a function to calculate 'value' based on fontScale
 */
export const useFontScale = (): ((val: number) => number) => {
  return (value: number): number => {
    return PixelRatio.getFontScale() * value
  }
}

/**
 * Hook to get the theme in a component
 */
export const useTheme = (): VATheme => {
  return useContext<VATheme>(ThemeContext)
}

/** Provides a helper function to get typed checked namespace for VA
 * @param ns - the namespace
 */
export const useTranslation = (ns?: i18n_NS): TFunction => {
  const { t } = realUseTranslation(ns)
  return t
}

/**
 * Hook to get the current header styles in a component
 */
export const useHeaderStyles = (): StackNavigationOptions => {
  let headerStyles = getHeaderStyles(useTheme())

  headerStyles = {
    ...headerStyles,
    headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} i18nId={'back'} showCarat={true} />,
  }
  return headerStyles
}

/**
 * Navigation hook to use in onPress events.
 *
 * routeName - the string value for Navigation Route to open
 *
 * @returns useRouteNavigation function to use as a closure for onPress events
 */
export type OnPressHandler = () => void

export const useRouteNavigation = (): ((routeName: string) => OnPressHandler) => {
  const navigation = useNavigation()
  return (routeName: string) => (): void => {
    navigation.navigate(routeName)
  }
}
