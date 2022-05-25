import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native'
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'

import { Box } from 'components'
import { BoxProps } from './Box'
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
    flexWrap: 'wrap',
    mt: 5,
    mb: 5,
    alignItems: 'center',
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

  return (
    <SafeAreaView edges={['left', 'right']} style={{ ...safeViewStyle }}>
      <Box {...mainContainerProps}>
        <View accessible={true} accessibilityRole={'alert'} ref={focusRef}>
          <Box {...messageContainerProps}>
            <Box {...iconWrapperBoxProps}>
              <VAIcon {...snackBarIconProps} />
            </Box>
            <TextView variant={'HelperText'} color={'snackBarTxt'}>
              {message}
            </TextView>
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
          <TouchableOpacity onPress={() => toast.onHide()} style={dismissBtnStlye} accessible={true} accessibilityRole={'button'}>
            <TextView variant={'SnackBarBtnText'}>{'Dismiss'}</TextView>
          </TouchableOpacity>
        </Box>
      </Box>
    </SafeAreaView>
  )
}

export default SnackBar
