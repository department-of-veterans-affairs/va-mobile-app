import { AccessibilityInfo, ActionSheetIOS, Alert, AlertButton, Linking, PixelRatio, ScrollView, UIManager, View, findNodeHandle } from 'react-native'
import { ImagePickerResponse } from 'react-native-image-picker'
import { MutableRefObject, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ParamListBase } from '@react-navigation/routers/lib/typescript/src/types'
import { StackNavigationOptions } from '@react-navigation/stack'
import { TFunction } from 'i18next'
import { useTranslation as realUseTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import React from 'react'

import { AccessibilityState, ErrorsState, PatientState, SecureMessagingState, StoreState } from 'store'
import { BackButton } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypes } from '../store/api/types'
import { ThemeContext } from 'styled-components'
import { VATheme } from 'styles/theme'
import { WebProtocolTypesConstants } from 'constants/common'
import { getHeaderStyles } from 'styles/common'
import { i18n_NS } from 'constants/namespaces'
import { isAndroid, isIOS } from './platform'
import { updateAccessibilityFocus } from 'store/actions'
import HeaderTitle from 'components/HeaderTitle'

/**
 * Hook to determine if an error should be shown for a given screen id
 * @param currentScreenID - the id of the screen being check for errors
 * @returns boolean to show the error
 */
export const useError = (currentScreenID: ScreenIDTypes): boolean => {
  const { errorsByScreenID } = useSelector<StoreState, ErrorsState>((state) => {
    return state.errors
  })
  return !!errorsByScreenID[currentScreenID]
}

/**
 * Hook to calculate based on fontScale
 *
 * @param val - number to calculate by
 * @returns a function to calculate 'value' based on fontScale
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
 * @returns the VATheme
 */
export const useTheme = (): VATheme => {
  return useContext<VATheme>(ThemeContext)
}

/** Provides a helper function to get typed checked namespace for VA
 * @param ns - the namespace
 * @returns the translation function
 */
export const useTranslation = (ns?: i18n_NS): TFunction => {
  const { t } = realUseTranslation(ns)
  return t
}

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
      backgroundColor: theme?.colors?.background?.navHeader,
      shadowColor: 'transparent', // removes bottom border
      height: insets.top,
    },
  }
}

export type OnPressHandler = () => void
export type RouteNavigationFunction<T extends ParamListBase> = (routeName: keyof T, args?: RouteNavParams<T>) => OnPressHandler

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
    return (): void => {
      navigation.navigate(routeName as never, args as never)
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
 *
 * @returns Array with a ref and the function to set the ref for the accessibility focus
 */
export function useAccessibilityFocus<T>(): [MutableRefObject<T>, () => void] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref: MutableRefObject<any> = useRef<T>(null)
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
      }, 300)

      return () => clearTimeout(timeOutPageFocus)
    }
  }, [ref, dispatch, screanReaderEnabled])

  return [ref, setFocus]
}

/**
 * Hook to check if the screan reader is enabled
 *
 * @returns boolean if the screen reader is on
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

/**
 * Hook to display a warning that the user is leaving the app when tapping an external link
 *
 * @returns an alert showing user they are leaving the app
 */
export function useExternalLink(): (url: string) => void {
  const t = useTranslation(NAMESPACE.COMMON)

  return (url: string) => {
    if (url.startsWith(WebProtocolTypesConstants.http)) {
      Alert.alert(t('leavingApp.title'), t('leavingApp.body'), [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        { text: t('leavingApp.ok'), onPress: (): Promise<void> => Linking.openURL(url), style: 'default' },
      ])
    } else {
      Linking.openURL(url)
    }
  }
}

/**
 * Returns whether user has cerner facilities or not
 *
 * @returns boolean showing if the user has cerner facilities
 */
export const useHasCernerFacilities = (): boolean => {
  const { cernerFacilities } = useSelector<StoreState, PatientState>((state) => state.patient)
  return cernerFacilities.length > 0
}

export type UseDestructiveAlertButtonProps = {
  /** text of button */
  text: string
  /** handler for onClick */
  onPress?: () => void
}

export type UseDestructiveAlertProps = {
  /** title of alert */
  title: string
  /** message of alert */
  message?: string // message for the alert
  /** ios destructive index */
  destructiveButtonIndex: number
  /** ios cancel index */
  cancelButtonIndex: number
  /** options to show in alert */
  buttons: Array<UseDestructiveAlertButtonProps>
}
/**
 * Hook to create appropriate alert for a destructive event (Actionsheet for iOS, standard alert for Android)
 * @param title - title of the alert
 * @param message - optional message for the alert
 * @param destructiveButtonIndex - ios destructive index
 * @param cancelButtonIndex - ios cancel index
 * @param buttons - options to show in the alert
 * @returns an action sheet for ios and an alert for android
 */
export function useDestructiveAlert(): (props: UseDestructiveAlertProps) => void {
  return (props: UseDestructiveAlertProps) => {
    if (isIOS()) {
      const { buttons, ...remainingProps } = props
      ActionSheetIOS.showActionSheetWithOptions(
        {
          ...remainingProps,
          options: buttons.map((button) => button.text),
        },
        (buttonIndex) => {
          const onPress = buttons[buttonIndex]?.onPress
          if (onPress) {
            onPress()
          }
        },
      )
    } else {
      Alert.alert(props.title, props.message, props.buttons as AlertButton[])
    }
  }
}

/**
 * Hook to autoscroll to an element
 * @returns ref to the scrollView and the elemnt to scroll to and the function to call the manual scroll
 */
export function useAutoScrollToElement(): [React.RefObject<ScrollView>, MutableRefObject<View>, () => void, React.Dispatch<React.SetStateAction<boolean>>] {
  const scrollRef = useRef<ScrollView>(null)
  const [messageRef, setFocus] = useAccessibilityFocus<View>()
  const [shouldFocus, setShouldFocus] = useState(true)
  const scrollToElement = useCallback(() => {
    const timeOut = setTimeout(() => {
      requestAnimationFrame(() => {
        if (messageRef.current && scrollRef.current) {
          const currentObject = scrollRef.current
          const scrollPoint = findNodeHandle(currentObject)
          if (scrollPoint) {
            messageRef.current.measureLayout(
              scrollPoint,
              (_, y, __, height) => {
                currentObject.scrollTo({ y: y * height, animated: false })
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
    }, 200)
    return () => clearTimeout(timeOut)
  }, [messageRef, setFocus, shouldFocus])

  return [scrollRef, messageRef, scrollToElement, setShouldFocus]
}

/**
 * Hook to add signature to a message
 *
 * @returns message state and the setMessage function
 */
export function useMessageWithSignature(): [string, React.Dispatch<React.SetStateAction<string>>] {
  const { signature, loadingSignature } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (signature && signature.includeSignature) {
      setMessage(`\n\n\n\n${signature.signatureName}\n${signature.signatureTitle}`)
    }
  }, [loadingSignature, signature])
  return [message, setMessage]
}

/**
 * Hook to validate message that could have a signature
 *
 * @param message - the message to be validated
 * @returns boolean if the message is valid
 */
export function useValidateMessageWithSignature(): (message: string) => boolean {
  const { signature } = useSelector<StoreState, SecureMessagingState>((state) => state.secureMessaging)

  return (message: string): boolean => {
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
type imageDocumentResponseType = DocumentPickerResponse | ImagePickerResponse

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
  const destructiveAlert = useDestructiveAlert()
  const t = useTranslation(NAMESPACE.HEALTH)

  const addAttachment = (attachmentFileToAdd: imageDocumentResponseType) => {
    setAttachmentsList([...attachmentsList, attachmentFileToAdd])
  }

  const onRemove = (attachmentFileToRemove: imageDocumentResponseType) => {
    setAttachmentsList(attachmentsList.filter((item) => item !== attachmentFileToRemove))
  }

  const removeAttachment = (attachmentFileToRemove: imageDocumentResponseType) => {
    destructiveAlert({
      title: t('secureMessaging.attachments.removeAttachmentAreYouSure'),
      destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
      buttons: [
        {
          text: t('common:cancel'),
        },
        {
          text: t('common:remove'),
          onPress: () => {
            onRemove(attachmentFileToRemove)
          },
        },
      ],
    })
  }

  return [attachmentsList, addAttachment, removeAttachment]
}
