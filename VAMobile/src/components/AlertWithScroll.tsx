import React, { FC, RefObject, useEffect } from 'react'
import { ScrollView, View } from 'react-native'
import { HapticFeedbackTypes } from 'react-native-haptic-feedback'

import { Alert, AlertProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Alert/Alert'

import { triggerHaptic } from 'utils/haptics'
import { useAutoScrollToElement } from 'utils/hooks'

export type AlertWithScrollProps = AlertProps & {
  /** Ref for the parent scrollView so we can scroll to the Alert */
  scrollViewRef: RefObject<ScrollView>
  /** Optional boolean indicating when Alert is focused. Default is true */
  isFocused?: boolean
}

/**
 * Wrapper for the Alert component which scrolls to the Alert
 */
const AlertWithScroll: FC<AlertWithScrollProps> = ({ children, scrollViewRef, isFocused = true, ...props }) => {
  const [scrollRef, viewRef, scrollToAlert] = useAutoScrollToElement()
  const { variant, header, description } = props
  const boxPadding = 20

  useEffect(() => {
    if (variant === 'error' && scrollViewRef?.current && (header || description)) {
      scrollRef.current = scrollViewRef.current
      scrollToAlert(-boxPadding)
    }
  }, [variant, scrollRef, scrollViewRef, scrollToAlert, header, description])

  if (isFocused) {
    if (variant === 'error') {
      triggerHaptic(HapticFeedbackTypes.notificationError)
    } else if (variant === 'warning') {
      triggerHaptic(HapticFeedbackTypes.notificationWarning)
    }
  }

  return (
    <View ref={viewRef}>
      <Alert {...props}>{children}</Alert>
    </View>
  )
}

export default AlertWithScroll
