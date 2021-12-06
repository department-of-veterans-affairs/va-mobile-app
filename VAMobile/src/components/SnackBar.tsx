import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native'
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'

import { Box } from 'components'
import { BoxProps } from './Box'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'
import TextView from './TextView'
import VAIcon from './VAIcon'
import colors from '../styles/themes/VAColors'

/**
 * Common snackbar component. This component is wrapped by the react-native-toast-notification library.
 */
const SnackBar: FC<ToastProps> = (toast) => {
  const { message, data } = toast
  const { onConfirmAction, isError, actionBtnText, isUndo } = data || {}
  const { dimensions } = useTheme()
  const [focusRef, setFocus] = useAccessibilityFocus<View>()

  useFocusEffect(setFocus)

  const btnStlye: StyleProp<ViewStyle> = {
    marginLeft: dimensions.snackBarBetweenSpace,
    height: dimensions.snackBarButtonHeight,
    justifyContent: 'center',
    alignContent: 'center',
    width: dimensions.snackBarBtuttonWidth,
  }

  const mainContainerProps: BoxProps = {
    width: dimensions.snackBarWidth,
    p: dimensions.snackBarPadding,
    backgroundColor: 'snackbar',
    borderRadius: dimensions.snackBarBorderRadius,
    flexDirection: 'row',
    flexWrap: 'wrap',
    display: 'flex',
    style: {
      shadowColor: colors.black,
      shadowOffset: { width: dimensions.snackBarShadowX, height: dimensions.snackBarShadowY },
      shadowOpacity: dimensions.snackBarShadowOpacity,
    },
  }

  const messageContainerProps: BoxProps = {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    mr: dimensions.snackBarBetweenSpace,
  }

  const btnContainerProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexGrow: 1,
  }

  const onActionPress = () => {
    if (onConfirmAction && typeof onConfirmAction === 'function') {
      onConfirmAction()
    }
    toast.onHide()
  }

  return (
    <Box {...mainContainerProps}>
      <View accessible={true} accessibilityRole={'alert'} ref={focusRef}>
        <Box {...messageContainerProps}>
          <Box mr={dimensions.snackBarBetweenSpace}>
            <VAIcon name={isError ? 'ExclamationTriangleSolid' : 'CircleCheckMark'} fill={colors.white} height={dimensions.snackBarIconSize} width={dimensions.snackBarIconSize} />
          </Box>
          <TextView variant={'HelperText'} color={'primaryContrast'}>
            {message}
          </TextView>
        </Box>
      </View>
      <Box {...btnContainerProps}>
        {!isUndo && (
          <TouchableOpacity onPress={onActionPress} style={btnStlye} accessible={true} accessibilityRole={'button'}>
            <TextView variant={'SnackBarBtnText'} color={'snackBarBtn'} display={'flex'}>
              {actionBtnText || isError ? 'Retry' : 'Undo'}
            </TextView>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => toast.onHide()} style={btnStlye} accessible={true} accessibilityRole={'button'}>
          <TextView variant={'SnackBarBtnText'} color={'snackBarBtn'}>
            {'Dismiss'}
          </TextView>
        </TouchableOpacity>
      </Box>
    </Box>
  )
}

export default SnackBar
