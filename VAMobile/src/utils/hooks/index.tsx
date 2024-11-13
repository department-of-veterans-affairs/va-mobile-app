import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  AccessibilityInfo,
  Alert,
  AlertButton,
  AppState,
  Dimensions,
  EmitterSubscription,
  Keyboard,
  Linking,
  PixelRatio,
  ScrollView,
  UIManager,
  View,
  findNodeHandle,
} from 'react-native'
import { ImagePickerResponse } from 'react-native-image-picker'
import { useDispatch, useSelector } from 'react-redux'

import { CommonActions, EventArg, useNavigation } from '@react-navigation/native'
import { ParamListBase } from '@react-navigation/routers/lib/typescript/src/types'
import { StackNavigationProp } from '@react-navigation/stack'

import { useActionSheet } from '@expo/react-native-action-sheet'
import { ActionSheetOptions } from '@expo/react-native-action-sheet/lib/typescript/types'
import { DateTime } from 'luxon'
import { useTheme as styledComponentsUseTheme } from 'styled-components'

import { SecureMessagingSignatureDataAttributes } from 'api/types'
import { Events } from 'constants/analytics'
import { WebProtocolTypesConstants } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { PREPOPULATE_SIGNATURE } from 'constants/secureMessaging'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { AppDispatch, RootState } from 'store'
import { DowntimeFeatureType, ScreenIDToDowntimeFeatures, ScreenIDTypes } from 'store/api/types'
import { DowntimeWindowsByFeatureType, ErrorsState } from 'store/slices'
import { AccessibilityState, updateAccessibilityFocus } from 'store/slices/accessibilitySlice'
import { VATheme } from 'styles/theme'
import { getTheme } from 'styles/themes/standardTheme'
import { EventParams, logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { capitalizeFirstLetter, stringToTitleCase } from 'utils/formattingUtils'
import { isAndroid, isIOS, isIpad } from 'utils/platform'
import { WaygateToggleType, waygateNativeAlert } from 'utils/waygateConfig'

const textAlign = isIOS() ? 'center' : 'left'
/**
 * Hook to determine if an error should be shown for a given screen id
 * @param currentScreenID - the id of the screen being check for errors
 * @returns boolean to show the error
 */
export const useError = (currentScreenID: ScreenIDTypes): boolean => {
  const { errorsByScreenID } = useSelector<RootState, ErrorsState>((state) => state.errors)
  const downtime = useDowntimeByScreenID(currentScreenID)
  if (downtime) {
    return true
  }

  return !!errorsByScreenID[currentScreenID]
}

export const useDowntime = (feature: DowntimeFeatureType): boolean => {
  const { downtimeWindowsByFeature } = useSelector<RootState, ErrorsState>((state) => state.errors)
  return featureInDowntime(feature, downtimeWindowsByFeature)
}

export const useDowntimeByScreenID = (currentScreenID: ScreenIDTypes): boolean => {
  const { downtimeWindowsByFeature } = useSelector<RootState, ErrorsState>((state) => state.errors)
  const features = ScreenIDToDowntimeFeatures[currentScreenID]
  return oneOfFeaturesInDowntime(features, downtimeWindowsByFeature)
}

export const featureInDowntime = (
  feature: DowntimeFeatureType,
  downtimeWindows: DowntimeWindowsByFeatureType,
): boolean => {
  const mw = downtimeWindows[feature]
  return !!mw && mw.startTime <= DateTime.now() && DateTime.now() <= mw.endTime
}

export const oneOfFeaturesInDowntime = (
  features: DowntimeFeatureType[],
  downtimeWindows: DowntimeWindowsByFeatureType,
): boolean => {
  return !!features?.some((feature) => featureInDowntime(feature as DowntimeFeatureType, downtimeWindows))
}

/**
 * Hook to calculate based on fontScale
 *
 * @param val - number to calculate by
 * @returns a function to calculate 'value' based on fontScale
 */
export const useFontScale = (): ((val: number) => number) => {
  const { fontScale } = useSelector<RootState, AccessibilityState>((state) => state.accessibility)

  return (value: number): number => {
    const pixelRatio = PixelRatio.getFontScale()
    const fs = isIOS() ? fontScale : pixelRatio
    return fs * value
  }
}

/**
 * Hook to get the theme in a component
 * @returns the VATheme
 */
export const useTheme = styledComponentsUseTheme as () => VATheme

export type OnPressHandler = () => void
export type RouteNavigationFunction<T extends ParamListBase> = (routeName: keyof T, args?: RouteNavParams<T>) => void

/**
 * Navigation hook to use in onPress events.
 *
 * @param routeName - the string value for Navigation Route to open
 * @returns useRouteNavigation function to use as a closure for onPress events
 */
export const useRouteNavigation = <T extends ParamListBase>(): RouteNavigationFunction<T> => {
  const navigation = useNavigation()
  type TT = keyof T
  return <X extends TT>(routeName: X, args?: T[X]) => {
    if (waygateNativeAlert(`WG_${String(routeName)}` as WaygateToggleType)) {
      navigation.dispatch(
        CommonActions.navigate({
          name: `${String(routeName)}`,
          params: args,
        }),
      )
    }
  }
}
type RouteNavParams<T extends ParamListBase> = {
  [K in keyof T]: T[K]
}[keyof T]

/**
 * On iOS, voiceover will focus on the element closest to what the user last interacted with on the
 * previous screen rather than what is on the top left (https://github.com/react-navigation/react-navigation/issues/7056)
 * This hook allows you to manually set the accessibility focus on the element we know will be in the correct place.
 *
 * @returns Array with a ref and the function to set the ref for the accessibility focus
 */
export function useAccessibilityFocus<T>(): [MutableRefObject<T>, () => void] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref: MutableRefObject<any> = useRef<T>(null)
  const dispatch = useAppDispatch()
  const screenReaderEnabled = useIsScreenReaderEnabled()

  const setFocus = useCallback(() => {
    if (ref.current && screenReaderEnabled) {
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
      }, 300)

      return () => clearTimeout(timeOutPageFocus)
    }
  }, [ref, dispatch, screenReaderEnabled])

  return [ref, setFocus]
}

/**
 * Hook to check if the screen reader is enabled
 *
 * withListener - True to add a listener to live update screen reader status, default false
 * @returns boolean if the screen reader is on
 */
export function useIsScreenReaderEnabled(withListener = false): boolean {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false)

  useEffect(() => {
    let isMounted = true
    let screenReaderChangedSubscription: EmitterSubscription

    if (withListener) {
      screenReaderChangedSubscription = AccessibilityInfo.addEventListener(
        'screenReaderChanged',
        (isScreenReaderEnabled) => {
          if (isMounted) {
            setScreenReaderEnabled(isScreenReaderEnabled)
          }
        },
      )
    }
    AccessibilityInfo.isScreenReaderEnabled().then((isScreenReaderEnabled) => {
      if (isMounted) {
        setScreenReaderEnabled(isScreenReaderEnabled)
      }
    })

    return () => {
      isMounted = false
      if (withListener) {
        screenReaderChangedSubscription?.remove()
      }
    }
  }, [screenReaderEnabled, withListener])

  return screenReaderEnabled
}

/**
 * Hook to display a warning that the user is leaving the app when tapping an external link
 *
 * @returns an alert showing user they are leaving the app
 */
export function useExternalLink(): (url: string, eventParams?: EventParams) => void {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (url: string, eventParams?: EventParams) => {
    logAnalyticsEvent(Events.vama_link_click({ url, ...eventParams }))

    const onOKPress = () => {
      logAnalyticsEvent(Events.vama_link_confirm({ url, ...eventParams }))
      return Linking.openURL(url)
    }

    if (url.startsWith(WebProtocolTypesConstants.http)) {
      Alert.alert(t('leavingApp.title'), t('leavingApp.body'), [
        {
          text: t('leavingApp.cancel'),
          style: 'cancel',
        },
        { text: t('leavingApp.ok'), onPress: (): Promise<void> => onOKPress(), style: 'default' },
      ])
    } else {
      Linking.openURL(url)
    }
  }
}

export function useGiveFeedback(): (task: string) => void {
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (task: string) => {
    const onOKPress = () => {
      navigateTo('InAppFeedback', { task })
    }

    const onCancelPress = () => {}

    Alert.alert(t('inAppFeedback.popup.title'), t('inAppFeedback.popup.body'), [
      {
        text: t('inAppFeedback.popup.notNow'),
        style: 'cancel',
        onPress: onCancelPress,
      },
      { text: t('inAppFeedback.popup.accept'), onPress: onOKPress, style: 'default' },
    ])
  }
}

export type useDestructiveActionSheetButtonProps = {
  /** text of button */
  text: string
  /** handler for onClick */
  onPress?: () => void
}

export type useDestructiveActionSheetProps = {
  /** title of alert */
  title: string
  /** message of alert */
  message?: string // message for the alert
  /** ios destructive index */
  destructiveButtonIndex?: number
  /** ios cancel index */
  cancelButtonIndex: number
  /** options to show in alert */
  buttons: Array<useDestructiveActionSheetButtonProps>
}
/**
 * Hook to create appropriate actionSheet for a destructive event
 * TODO: 6269-Combine useDestructiveActionSheet and useShowActionSheet
 * @param title - optional title of the ActionSheet
 * @param message - optional message for the ActionSheet
 * @param destructiveButtonIndex - optional destructive index
 * @param cancelButtonIndex - ios cancel index
 * @param buttons - options to show in the ActionSheet
 * @returns an action sheet
 */
export function useDestructiveActionSheet(): (props: useDestructiveActionSheetProps) => void {
  const { showActionSheetWithOptions } = useActionSheet()
  const currentTheme = getTheme()
  return (props: useDestructiveActionSheetProps) => {
    const { buttons, cancelButtonIndex, destructiveButtonIndex } = props

    // Ensure cancel button is always last for UX consisency
    const newButtons = [...buttons]
    if (cancelButtonIndex < buttons.length - 1) {
      newButtons.push(newButtons.splice(cancelButtonIndex, 1)[0])
    }

    let newDestructiveButtonIndex = destructiveButtonIndex
    if (destructiveButtonIndex && cancelButtonIndex < destructiveButtonIndex) {
      newDestructiveButtonIndex = destructiveButtonIndex - 1
    }

    Keyboard.dismiss()
    // TODO: Remove the + ' ' when #6345 is fixed by expo action sheets expo/react-native-action-sheet#298
    showActionSheetWithOptions(
      {
        title: props.title,
        titleTextStyle: {
          fontWeight: 'bold',
          textAlign: textAlign,
          color: currentTheme.colors.text.primary,
        },
        message: props.message,
        messageTextStyle: {
          fontWeight: 'normal',
          textAlign: textAlign,
          color: currentTheme.colors.text.primary,
        },
        textStyle: { color: currentTheme.colors.text.primary },
        destructiveButtonIndex: newDestructiveButtonIndex,
        destructiveColor: currentTheme.colors.text.error,
        options: newButtons.map((button) => stringToTitleCase(isIOS() ? button.text : button.text + ' ')),
        containerStyle: { backgroundColor: currentTheme.colors.background.contentBox },
        cancelButtonIndex: isIpad() ? undefined : newButtons.length - 1,
      },
      (buttonIndex) => {
        if (buttonIndex || buttonIndex === 0) {
          newButtons[buttonIndex]?.onPress?.()
        }
      },
    )
  }
}

export type UseAlertProps = {
  /** title of alert */
  title: string
  /** message of alert */
  message?: string
  /** options to show in alert */
  buttons: Array<AlertButton>
}
/**
 * Hook to create standard alert for a destructive event
 * @param title - title of the alert
 * @param message - optional message for the alert
 * @param buttons - options to show in the alert
 * @param screenReaderEnabled - apply a11yLabelNeededForScreenReader will have the side effect of visually
 * displaying V-A since the alert used does not have a separate accessibility Label
 * @returns returns an alert for ios and android
 */
export function useAlert(): (props: UseAlertProps) => void {
  return (props: UseAlertProps) => {
    Alert.alert(props.title, props.message, props.buttons)
  }
}

/**
 * Hook to autoscroll to an element
 *
 * @returns ref to the scrollView and the element to scroll to and the function to call the manual scroll
 */
export function useAutoScrollToElement(): [
  MutableRefObject<ScrollView>,
  MutableRefObject<View>,
  (offset?: number) => void,
  React.Dispatch<React.SetStateAction<boolean>>,
] {
  const scrollRef = useRef() as MutableRefObject<ScrollView>
  const [viewRef, setFocus] = useAccessibilityFocus<View>()
  const [shouldFocus, setShouldFocus] = useState(true)
  const screenReaderEnabled = useIsScreenReaderEnabled()

  const scrollToElement = useCallback(
    (offset?: number) => {
      const timeOut = setTimeout(() => {
        requestAnimationFrame(() => {
          if (viewRef.current && scrollRef.current) {
            const currentObject = scrollRef.current
            const scrollPoint = findNodeHandle(currentObject)
            if (scrollPoint) {
              const offsetValue = offset || 0
              viewRef.current.measureLayout(
                scrollPoint,
                (_, y) => {
                  currentObject.scrollTo({ y: y + offsetValue, animated: !screenReaderEnabled })
                },
                () => {
                  currentObject.scrollTo({ y: 0 })
                },
              )
            }
          }
        })
        if (shouldFocus) {
          setFocus()
        }
      }, 400)
      return () => clearTimeout(timeOut)
    },
    [viewRef, setFocus, shouldFocus, screenReaderEnabled],
  )

  return [scrollRef, viewRef, scrollToElement, setShouldFocus]
}

/**
 * Hook to add signature to a message
 *
 * @returns message state and the setMessage function
 */
export function useMessageWithSignature(
  signature: SecureMessagingSignatureDataAttributes | undefined,
  signatureFetched: boolean,
): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (PREPOPULATE_SIGNATURE && signature && signature.includeSignature) {
      setMessage(`\n\n\n\n${signature.signatureName}\n${signature.signatureTitle}`)
    }
  }, [signatureFetched, signature])
  return [message, setMessage]
}

/**
 * Hook to validate message that could have a signature
 *
 * @param message - the message to be validated
 * @returns boolean if the message is valid
 */
export function useValidateMessageWithSignature(): (
  message: string,
  signature: SecureMessagingSignatureDataAttributes | undefined,
) => boolean {
  return (message: string, signature: SecureMessagingSignatureDataAttributes | undefined): boolean => {
    let isMessageBlank = !!message
    if (signature && signature.includeSignature) {
      isMessageBlank = message.trim() !== `${signature?.signatureName}\n${signature?.signatureTitle}`
    }
    return isMessageBlank
  }
}

/**
 * The image and document response type
 */
export type imageDocumentResponseType = DocumentPickerResponse | ImagePickerResponse

/**
 * Hook to add and remove attachments from the attachment list
 *
 * @returns the attachmentlist state and the remove and add attachment functions
 */
export function useAttachments(): [
  Array<imageDocumentResponseType>,
  (attachmentFileToAdd: imageDocumentResponseType) => void,
  (attachmentFileToRemove: imageDocumentResponseType) => void,
] {
  const [attachmentsList, setAttachmentsList] = useState<Array<imageDocumentResponseType>>([])
  const destructiveAlert = useDestructiveActionSheet()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const addAttachment = (attachmentFileToAdd: imageDocumentResponseType) => {
    setAttachmentsList([...attachmentsList, attachmentFileToAdd])
  }

  const onRemove = (attachmentFileToRemove: imageDocumentResponseType) => {
    setAttachmentsList(attachmentsList.filter((item) => item !== attachmentFileToRemove))
  }

  const removeAttachment = (attachmentFileToRemove: imageDocumentResponseType) => {
    destructiveAlert({
      title: t('secureMessaging.attachments.removeAttachment'),
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      buttons: [
        {
          text: t('secureMessaging.attachments.keep'),
        },
        {
          text: t('remove'),
          onPress: () => {
            onRemove(attachmentFileToRemove)
          },
        },
      ],
    })
  }

  return [attachmentsList, addAttachment, removeAttachment]
}

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>()

/**
 * Returns a wrapper to showActionSheetWithOptions that converts iOS options to title case
 * TODO: consolidate this and useDestructiveActionSheet into a single hook
 */
export function useShowActionSheet(): (
  options: ActionSheetOptions,
  callback: (i?: number) => void | Promise<void>,
) => void {
  const { showActionSheetWithOptions } = useActionSheet()
  const currentTheme = getTheme()

  return (options: ActionSheetOptions, callback: (i?: number) => void | Promise<void>) => {
    // Use title case for iOS, sentence case for Android
    const casedOptionText = options.options.map((optionText) => {
      if (isIOS()) {
        return stringToTitleCase(optionText)
      } else {
        // TODO: Remove the + ' ' when #6345 is fixed by expo action sheets expo/react-native-action-sheet#298
        return capitalizeFirstLetter(optionText + ' ')
      }
    })

    const casedOptions: ActionSheetOptions = {
      titleTextStyle: {
        fontWeight: 'bold',
        textAlign: textAlign,
        color: currentTheme.colors.text.primary,
      },
      messageTextStyle: { textAlign: textAlign, color: currentTheme.colors.text.primary },
      textStyle: { color: currentTheme.colors.text.primary },
      destructiveColor: currentTheme.colors.text.error,
      containerStyle: { backgroundColor: currentTheme.colors.background.contentBox },
      ...options,
      options: casedOptionText,
    }

    if (isIpad()) {
      delete casedOptions.cancelButtonIndex
    }

    showActionSheetWithOptions(casedOptions, callback)
  }
}

// function that returns if the device is on portrait mode or not
export function useOrientation(): boolean {
  const getOrientation = () => {
    const dim = Dimensions.get('screen')
    return dim.height >= dim.width
  }

  const [isPortrait, setIsPortrait] = useState<boolean>(getOrientation())

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', () => {
      setIsPortrait(getOrientation())
    })

    return () => {
      sub?.remove()
    }
  }, [])

  return isPortrait
}

/**
 * Hook to catch IOS swipes and Android lower nav back events
 *
 * @param navigation - navigation object passed to a screen
 * @param callback - function to execute when 'beforeRemove' is called
 */
export function useBeforeNavBackListener(
  navigation: StackNavigationProp<ParamListBase, keyof ParamListBase>,
  callback: (
    e: EventArg<
      'beforeRemove',
      true,
      {
        action: Readonly<{
          type: string
          payload?: object | undefined
          source?: string | undefined
          target?: string | undefined
        }>
      }
    >,
  ) => void,
): void {
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      callback(e)
    })

    return unsubscribe
  })
}

/**
 * Hook that is called when app moves from the background to the foreground
 *
 * @param callback - function to execute when app is back in the foreground
 */
export function useOnResumeForeground(callback: () => void): void {
  const appState = useRef(AppState.currentState)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come back to the foreground!
        callback()
      }

      appState.current = nextAppState
    })

    return () => {
      subscription?.remove()
    }
  }, [callback])
}

/**
 * Tracks previous value passed in
 *
 * @param value - value to track for previous
 */
export function usePrevious<T>(value: T): T {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current as T
}
/**
 * Opens the app listing in the device's respective app store.
 *
 * @returns An alert asking the user whether they'd like to leave the app to the app store.
 */
export function useOpenAppStore(): () => void {
  const launchExternalLink = useExternalLink()
  const { APPLE_STORE_LINK, GOOGLE_PLAY_LINK } = getEnv()
  const appStoreLink = isIOS() ? APPLE_STORE_LINK : GOOGLE_PLAY_LINK

  return () => launchExternalLink(appStoreLink, { appStore: 'app_store' })
}
