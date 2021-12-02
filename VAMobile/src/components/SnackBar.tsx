import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast'
import React, { FC } from 'react'

import { Box } from 'components'
import { BoxProps } from './Box'
import { useTheme } from 'utils/hooks'
import TextView from './TextView'
import VAIcon from './VAIcon'
import colors from '../styles/themes/VAColors'

/**
 * Common snackbar component. This component is warraped by the react-native-toast-notification library.
 */
const SnackBar: FC<ToastProps> = (toast) => {
  const { message, data } = toast
  const { onConfirmAction, isError, actionBtnText, isUndo } = data || {}
  const { dimensions } = useTheme()

  const btnStlye: StyleProp<ViewStyle> = {
    marginLeft: dimensions.snackBarBetweenSpace,
    height: dimensions.snackBarButtonHeight,
    justifyContent: 'center',
    alignContent: 'center',
    width: dimensions.snackBarBtuttonWidth,
  }

  const mainContainerProps: BoxProps = {
    width: '90%',
    p: dimensions.snackBarPadding,
    backgroundColor: 'snackbar',
    my: dimensions.snackBarVerticalMarging,
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
      <Box {...messageContainerProps}>
        <Box mr={dimensions.snackBarBetweenSpace}>
          <VAIcon name={isError ? 'ExclamationTriangleSolid' : 'CircleCheckMark'} fill={colors.white} height={dimensions.snackBarIconSize} width={dimensions.snackBarIconSize} />
        </Box>
        <TextView variant={'HelperText'} color={'primaryContrast'}>
          {message}
        </TextView>
      </Box>
      <Box {...btnContainerProps}>
        {!isUndo && (
          <TouchableOpacity onPress={onActionPress} style={btnStlye}>
            <TextView variant={'SnackBarBtnText'} color={'snackBarBtn'} display={'flex'}>
              {actionBtnText || isError ? 'Retry' : 'Undo'}
            </TextView>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => toast.onHide()} style={btnStlye}>
          <TextView variant={'SnackBarBtnText'} color={'snackBarBtn'}>
            {'Dismiss'}
          </TextView>
        </TouchableOpacity>
      </Box>
    </Box>
  )
}

export default SnackBar
