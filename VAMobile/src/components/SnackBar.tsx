import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native'
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'

import { Box, TextViewProps } from 'components'
import { BoxProps } from './Box'
import { triggerHaptic } from 'utils/haptics'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'
import colors from '../styles/themes/VAColors'

export type SnackbarMessages = {
  successMsg: string
  errorMsg: string
  undoMsg?: string
  undoErrorMsg?: string
}

/**
 * Common snackbar component. This component is wrapped by the react-native-toast-notification library.
 */
const SnackBar: FC<ToastProps> = (toast) => {
  const { message, data } = toast
  const { onActionPressed, isError, actionBtnText, isUndo } = data || {}
  const { colors: themeColor } = useTheme()
  const [focusRef, setFocus] = useAccessibilityFocus<View>()

  useFocusEffect(setFocus)

  const safeViewStyle: StyleProp<ViewStyle> = {
    flex: 1,
    marginBottom: 0,
    marginLeft: 10,
    marginRight: 10,
  }

  const confirmBtnStlye: StyleProp<ViewStyle> = {
    marginLeft: 8,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 5,
    marginRight: 15,
    marginBottom: 5,
  }

  const dismissBtnStlye: StyleProp<ViewStyle> = {
    marginLeft: 8,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  }

  const mainContainerProps: BoxProps = {
    minWidth: '100%',
    p: 15,
    backgroundColor: 'snackbar',
    borderRadius: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    display: 'flex',
    style: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
    },
  }

  const messageContainerProps: BoxProps = {
    flexDirection: 'row',
    mt: 5,
    mb: 5,
    alignItems: 'center',
  }

  const messageProp: TextViewProps = {
    variant: 'HelperText',
    color: 'snackBarTxt',
  }

  // adjust style depending on if there are 1 or 2 buttons
  // 1 inline
  // 2 its own row align to the right
  if (!isUndo) {
    // 2
    messageContainerProps.minWidth = '100%'
    messageProp.flex = 1
  } else {
    // 1
    messageContainerProps.flexWrap = 'wrap'
  }

  const btnContainerProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexGrow: 1,
  }

  const onActionPress = () => {
    if (onActionPressed && typeof onActionPressed === 'function') {
      onActionPressed()
    }
    toast.onHide()
  }

  const onDismissPress = () => {
    toast.onHide()
  }

  const snackBarIconProps: VAIconProps = {
    name: isError ? 'ExclamationTriangleSolid' : 'CircleCheckMark',
    fill: themeColor.icon.snackBarIcon,
    height: 18,
    width: 18,
  }

  const iconWrapperBoxProps: BoxProps = {
    mr: 8,
    alignSelf: 'flex-start',
    mt: 2,
  }

  const vibrate = (): void => {
    if (!isUndo) {
      triggerHaptic('notificationError')
    } else {
      triggerHaptic('notificationSuccess')
    }
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={{ ...safeViewStyle }}>
      <Box {...mainContainerProps}>
        <View accessible={true} accessibilityRole={'alert'} ref={focusRef}>
          <Box {...messageContainerProps}>
            <Box {...iconWrapperBoxProps}>
              <VAIcon {...snackBarIconProps} />
            </Box>
            <TextView {...messageProp}>{message}</TextView>
          </Box>
        </View>
        <Box {...btnContainerProps}>
          {!isUndo && (
            <TouchableOpacity onPress={onActionPress} style={confirmBtnStlye} accessible={true} accessibilityRole={'button'}>
              <TextView variant={'SnackBarBtnText'} display={'flex'}>
                {actionBtnText || isError ? 'Retry' : 'Undo'}
              </TextView>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onDismissPress} style={dismissBtnStlye} accessible={true} accessibilityRole={'button'}>
            <TextView variant={'SnackBarBtnText'}>{'Dismiss'}</TextView>
          </TouchableOpacity>
        </Box>
      </Box>
      {vibrate()}
    </SafeAreaView>
  )
}

export default SnackBar
