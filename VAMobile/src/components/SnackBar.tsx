import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
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
  const { onActionPressed, isError, actionBtnText, isUndo } = data || {}
  const { dimensions } = useTheme()
  const [focusRef, setFocus] = useAccessibilityFocus<View>()

  useFocusEffect(setFocus)

  const styles = StyleSheet.create({
    safeView: {
      flex: 1,
      marginBottom: dimensions.snackBarMarginBottom,
      marginLeft: dimensions.snackBarMarginLeft,
      marginRight: dimensions.snackBarMarginRight,
    },
  })

  const confirmBtnStlye: StyleProp<ViewStyle> = {
    marginLeft: dimensions.snackBarBetweenSpace,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: dimensions.snackBarButtonTopMargin,
    marginRight: dimensions.snackBarConfirmBtnMarginRight,
  }

  const dismissBtnStlye: StyleProp<ViewStyle> = {
    marginLeft: dimensions.snackBarBetweenSpace,
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: dimensions.snackBarButtonTopMargin,
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
    flexWrap: 'wrap',
    mt: dimensions.snackBarButtonTopMargin,
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

  return (
    <SafeAreaView edges={['left', 'right']} style={styles.safeView}>
      <Box {...mainContainerProps}>
        <View accessible={true} accessibilityRole={'alert'} ref={focusRef}>
          <Box {...messageContainerProps}>
            <Box mr={dimensions.snackBarBetweenSpace} alignSelf="flex-start" mt={dimensions.snackBarIconTopMargin}>
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
    </SafeAreaView>
  )
}

export default SnackBar
