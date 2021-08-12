import { AccessibilityInfo, ActionSheetIOS, Alert, PixelRatio, StyleSheet, UIManager, findNodeHandle } from 'react-native'
import { MutableRefObject, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypes } from '../store/api/types'
import { ThemeContext } from 'styled-components'
import { VATheme } from 'styles/theme'
import { i18n_NS } from 'constants/namespaces'
import { isAndroid, isIOS } from './platform'
import { updateAccessibilityFocus } from 'store/actions'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/**
 * Hook to determine if an error should be shown for a given screen id
 */
export const useError = (currentScreenID: ScreenIDTypes): boolean => {
  const { errorsByScreenID } = useSelector<StoreState, ErrorsState>((state) => {
    return state.errors
  })
  return !!errorsByScreenID[currentScreenID]
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
  const insets = useSafeAreaInsets()
  let headerStyles = getHeaderStyles(insets.top, useTheme())
  const {
    dimensions: { headerHeight },
  } = useTheme()

  // for ios to be able to traverse using keyboard on accessibility
  const defaultStyle = StyleSheet.create({
    headerText: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      height: headerHeight,
    },
  })

  headerStyles = {
    ...headerStyles,
    headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
      <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.back} showCarat={true} />
    ),
    headerTitle: (header: HeaderTitleType) => (
      <Box accessibilityRole="header" accessible={true} style={defaultStyle.headerText}>
        <HeaderTitle {...header} />
      </Box>
    ),
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
 */
export const useTopPaddingAsHeaderStyles = (): StackNavigationOptions => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()

  return {
    headerBackTitleVisible: false,
    headerBackTitle: undefined,
    headerTitle: '',
    headerStyle: {
      backgroundColor: theme?.colors?.background?.navHeader,
      shadowColor: 'transparent', // removes bottom border
      height: insets.top,
    },
  }
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

/**
 * On iOS, voiceover will focus on the element closest to what the user last interacted with on the
 * previous screen rather than what is on the top left (https://github.com/react-navigation/react-navigation/issues/7056) This hook allows you to manually set the accessibility
 * focus on the element we know will be in the correct place.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAccessibilityFocus(): [MutableRefObject<any>, () => void] {
  const ref = useRef(null)
  const dispatch = useDispatch()
  const screanReaderEnabled = useIsScreanReaderEnabled()

  const setFocus = useCallback(() => {
    if (ref.current && screanReaderEnabled) {
      /**
       * There is a race condition during transition that causes the accessibility focus
       * to intermittently fail to be set https://github.com/facebook/react-native/issues/30097
       */
      const timeOutPageFocus = setTimeout(() => {
        const focusPoint = findNodeHandle(ref.current)
        if (focusPoint) {
          /**
           * Due to bug https://github.com/react-navigation/react-navigation/issues/6909 when setting
           * the focus on android with this timeout and using the keyboard the keyboard focus and the
           * accessibiltiy focus are not sync so trigering a render after accessibility focus is set makes
           * the keyboard focus and accessibilty focus synced.
           */
          if (isAndroid()) {
            dispatch(updateAccessibilityFocus(false))
            // @ts-ignore: sendAccessibilityEvent is missing from @types/react-native
            UIManager.sendAccessibilityEvent(
              focusPoint,
              // @ts-ignore: AccessibilityEventTypes is missing from @types/react-native
              UIManager.AccessibilityEventTypes.typeViewFocused,
            )
            dispatch(updateAccessibilityFocus(true))
          } else {
            AccessibilityInfo.setAccessibilityFocus(focusPoint)
          }
        }
      }, 50)

      return () => clearTimeout(timeOutPageFocus)
    }
  }, [ref, dispatch, screanReaderEnabled])

  return [ref, setFocus]
}

/**
 * Hook to check if the screan reader is enabled
 */
export function useIsScreanReaderEnabled(): boolean {
  const [screanReaderEnabled, setScreanReaderEnabled] = useState(false)

  useEffect(() => {
    let isMounted = true
    AccessibilityInfo.isScreenReaderEnabled().then((isScreenReaderEnabled) => {
      if (isMounted) {
        setScreanReaderEnabled(isScreenReaderEnabled)
      }
    })
    return () => {
      isMounted = false
    }
  }, [screanReaderEnabled])

  return screanReaderEnabled
}

export function useDestructiveAlert(): (alertTitle: string, alertMsg: string, onPress: () => void) => void {
  const dispatch = useDispatch()
  const t = useTranslation(NAMESPACE.SETTINGS)
  return (alertTitle: string, alertMsg: string, onPress: () => void) => {
    if (isIOS()) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: alertTitle,
          message: alertMsg,
          options: [t('common:cancel'), t('common:confirm')],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            // cancel action
          } else if (buttonIndex === 1) {
            dispatch(onPress())
          }
        },
      )
    } else {
      Alert.alert(alertTitle, alertMsg, [
        { text: t('common:cancel'), style: 'cancel' },
        { text: t('common:confirm'), onPress: () => dispatch(onPress()) },
      ])
    }
  }
}
