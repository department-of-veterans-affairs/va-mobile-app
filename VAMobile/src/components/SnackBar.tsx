import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native'
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast'
import { useFocusEffect } from '@react-navigation/native'
import React, { FC } from 'react'
import styled from 'styled-components'

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

  const StyledSafeArea = styled(SafeAreaView)`
    flex: 1;
    margin-right: ${dimensions.snackBarMargingLeft}px;
    margin-left: ${dimensions.snackBarMargingRight}px;
    margin-bottom: ${dimensions.snackBarMargingBottom}px;
  `

  const confirmBtnStlye: StyleProp<ViewStyle> = {
    marginLeft: dimensions.snackBarBetweenSpace,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: dimensions.snackBarButtonTopMarging,
    marginRight: dimensions.snackBarConfirmBtnMarginRight,
  }

  const dismissBtnStlye: StyleProp<ViewStyle> = {
    marginLeft: dimensions.snackBarBetweenSpace,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: dimensions.snackBarButtonTopMarging,
  }

  const mainContainerProps: BoxProps = {
    minWidth: '100%',
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
    flexWrap: 'wrap',
    mt: dimensions.snackBarButtonTopMarging,
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
    <StyledSafeArea edges={['left', 'right']}>
      <Box {...mainContainerProps}>
        <View accessible={true} accessibilityRole={'alert'} ref={focusRef}>
          <Box {...messageContainerProps}>
            <Box mr={dimensions.snackBarBetweenSpace}>
              <VAIcon
                name={isError ? 'ExclamationTriangleSolid' : 'CircleCheckMark'}
                fill={colors.white}
                height={dimensions.snackBarIconSize}
                width={dimensions.snackBarIconSize}
              />
            </Box>
            <TextView variant={'HelperText'} color={'primaryContrast'}>
              {message}
            </TextView>
          </Box>
        </View>
        <Box {...btnContainerProps}>
          {!isUndo && (
            <TouchableOpacity onPress={onActionPress} style={confirmBtnStlye} accessible={true} accessibilityRole={'button'}>
              <TextView variant={'SnackBarBtnText'} color={'snackBarBtn'} display={'flex'}>
                {actionBtnText || isError ? 'Retry' : 'Undo'}
              </TextView>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => toast.onHide()} style={dismissBtnStlye} accessible={true} accessibilityRole={'button'}>
            <TextView variant={'SnackBarBtnText'} color={'snackBarBtn'}>
              {'Dismiss'}
            </TextView>
          </TouchableOpacity>
        </Box>
      </Box>
    </StyledSafeArea>
  )
}

export default SnackBar
