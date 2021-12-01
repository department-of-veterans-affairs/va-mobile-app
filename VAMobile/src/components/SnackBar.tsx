import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native'
import React, { FC } from 'react'

import { Box } from 'components'
import { BoxProps } from './Box'
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast'
import { useTheme } from 'utils/hooks'
import TextView from './TextView'
import VAIcon from './VAIcon'
import colors from '../styles/themes/VAColors'

const SnackBar: FC<ToastProps> = (toast) => {
  const { message, data } = toast
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
    px: dimensions.snackBarHorizontalPadding,
    backgroundColor: 'snackbar',
    my: dimensions.snackBarVerticalMarging,
    borderRadius: dimensions.snackBarBorderRadius,
    flexDirection: 'row',
    flexWrap: 'wrap',
    display: 'flex',
    py: dimensions.snackBarVerticalPadding,
    style: {
      shadowColor: colors.black,
      shadowOffset: { width: dimensions.snackBarShadowX, height: dimensions.snackBarShadowY },
      shadowOpacity: dimensions.snackBarShadowOpacity,
    },
  }

  const messageContainerProps: BoxProps = {
    height: dimensions.snackBarButtonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
  }

  const btnContainerProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexGrow: 1,
  }

  return (
    <Box {...mainContainerProps}>
      <Box {...messageContainerProps}>
        <Box mr={dimensions.snackBarBetweenSpace}>
          <VAIcon name={'CircleCheckMark'} fill={colors.white} height={18} width={18} />
        </Box>
        <TextView color={'primaryContrast'}>{message}</TextView>
      </Box>
      <Box {...btnContainerProps}>
        <TouchableOpacity onPress={() => (toast.onPress ? toast.onPress('1') : undefined)} style={btnStlye}>
          <TextView variant={'MobileBodyBold'} color={'snackBarBtn'} display={'flex'}>
            {data?.actionBtnText || 'Undo'}
          </TextView>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toast.onHide()} style={btnStlye}>
          <TextView variant={'MobileBodyBold'} color={'snackBarBtn'}>
            {data?.actionBtnText || 'Dismiss'}
          </TextView>
        </TouchableOpacity>
      </Box>
    </Box>
  )
}

export default SnackBar
