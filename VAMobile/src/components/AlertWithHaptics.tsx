import React, { FC, RefObject, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { HapticFeedbackTypes } from 'react-native-haptic-feedback'

import { Alert, AlertProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Alert/Alert'

import { triggerHaptic } from 'utils/haptics'
import { useAutoScrollToElement } from 'utils/hooks'

export type AlertWithHapticsProps = AlertProps & {
  /** Optional boolean for determining when to focus on error alert boxes (e.g. onSaveClicked). Default is true */
  focusOnError?: boolean
  /** Optional ref for the parent scrollView so we can scroll to the Alert */
  scrollViewRef?: RefObject<ScrollView>
}

/**
 * Wrapper for the Alert component which triggers haptics and optionally scrolls
 */
const AlertWithHaptics: FC<AlertWithHapticsProps> = ({
  children,
  scrollViewRef,
  focusOnError = true,
  ...alertProps
}) => {
  const [scrollRef, viewRef, scrollToAlert] = useAutoScrollToElement()
  const [shouldFocus, setShouldFocus] = useState(true)
  const { variant, header, description } = alertProps

  useEffect(() => {
    if (variant === 'error' && scrollViewRef?.current && (header || description)) {
      scrollRef.current = scrollViewRef.current
      scrollToAlert()
    }
    setShouldFocus(focusOnError)
  }, [variant, focusOnError, scrollRef, scrollToAlert, scrollViewRef, header, description])

  const vibrate = () => {
    if (variant === 'error') {
      triggerHaptic(HapticFeedbackTypes.notificationError)
    } else if (variant === 'warning') {
      triggerHaptic(HapticFeedbackTypes.notificationWarning)
    }
  }

  return (
    <View ref={viewRef}>
      <Alert {...alertProps}>{children}</Alert>
      {shouldFocus && vibrate()}
    </View>
  )
}

export default AlertWithHaptics
