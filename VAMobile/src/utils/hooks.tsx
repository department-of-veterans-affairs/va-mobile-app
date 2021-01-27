import { BackButton } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ErrorsState, StoreState } from 'store'
import { ParamListBase } from '@react-navigation/routers/lib/typescript/src/types'
import { PixelRatio } from 'react-native'
import { ReactNode, useContext } from 'react'
import { StackHeaderLeftButtonProps, StackNavigationOptions } from '@react-navigation/stack'
import { TFunction } from 'i18next'
import { ThemeContext } from 'styled-components'
import { VATheme } from 'styles/theme'
import { getHeaderStyles } from 'styles/common'
import { i18n_NS } from 'constants/namespaces'
import { useTranslation as realUseTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import React from 'react'

/**
 * Hook to compare a screenID to the screenID in the store
 */
export const useError = (currentScreenID: string): boolean => {
  const { screenID } = useSelector<StoreState, ErrorsState>((state) => state.errors)
  return currentScreenID === screenID
}

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
    headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
      <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={true} />
    ),
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
export type RouteNavigationFunction<T extends ParamListBase> = (routeName: keyof T, args?: RouteNavParams<T>) => OnPressHandler
export const useRouteNavigation = <T extends ParamListBase>(): RouteNavigationFunction<T> => {
  const navigation = useNavigation()
  type TT = keyof T
  return <X extends TT>(routeName: X, args?: T[X]) => {
    return (): void => {
      navigation.navigate(routeName as string, args)
    }
  }
}
type RouteNavParams<T extends ParamListBase> = {
  [K in keyof T]: T[K]
}[keyof T]
