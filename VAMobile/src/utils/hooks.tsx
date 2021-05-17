import { PixelRatio } from 'react-native'
import { ReactNode, useContext } from 'react'
import { useSelector } from 'react-redux'
import React from 'react'

import { HeaderTitle, StackHeaderLeftButtonProps, StackNavigationOptions } from '@react-navigation/stack'
import { ParamListBase } from '@react-navigation/routers/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useTranslation as realUseTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'

import { AccessibilityState, ErrorsState, StoreState } from 'store'
import { BackButton, Box } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { HeaderTitleType, getHeaderStyles } from 'styles/common'
import { ThemeContext } from 'styled-components'
import { VATheme } from 'styles/theme'
import { i18n_NS } from 'constants/namespaces'
import { isIOS } from './platform'

/**
 * Hook to determine if an error should be shown for a given screen id
 */
export const useError = (currentScreenID: string, currMessageID?: number): boolean => {
  const { screenID, messageID } = useSelector<StoreState, ErrorsState>((state) => state.errors)
  return currentScreenID === screenID && currMessageID === messageID
}

/**
 * Returns a function to calculate 'value' based on fontScale
 */
export const useFontScale = (): ((val: number) => number) => {
  const { fontScale } = useSelector<StoreState, AccessibilityState>((state) => state.accessibility)

  return (value: number): number => {
    const pixelRatio = PixelRatio.getFontScale()
    const fs = isIOS() ? fontScale : pixelRatio
    return fs * value
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
    headerTitle: (header: HeaderTitleType) => (
      <Box accessibilityRole="header" accessible={true}>
        <HeaderTitle {...header} />
      </Box>
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
