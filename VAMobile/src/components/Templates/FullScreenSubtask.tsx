import { StackActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { StatusBar, TouchableWithoutFeedback, View, ViewStyle } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, BoxProps, ButtonTypesConstants, TextView, TextViewProps, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useAccessibilityFocus, useDestructiveAlert, useTheme } from 'utils/hooks'
import MenuView, { MenuViewActionsType } from 'components/Menu'
import VAIcon, { VAIconProps } from 'components/VAIcon'

/*To use this template to wrap the screen you want in <FullScreenSubtask> </FullScreenSubtask> and supply the needed props for them to display
in the screen navigator update 'screenOptions={{ headerShown: false }}' to hide the previous navigation display for all screens in the navigator.
Use 'options={{headerShown: false}}'(preferred method for subtask) in the individual screen if only an individual screen is supposed to do it.
*/

export type FullScreenSubtaskProps = {
  /** text of the title bar left button(no text it doesn't appear) */
  leftButtonText?: string
  /** text of the title bar title(no text it doesn't appear) */
  title?: string
  /** text of the title bar right button(no text it doesn't appear) */
  rightButtonText?: string
  /** function called when right button is pressed(no function it doesn't appear) */
  onRightButtonPress?: () => void
  /** icon for title bar right button(must have right button text to display) */
  rightVAIconProps?: VAIconProps
  /** shows the menu icon with the specified action types (won't be shown if right button text is set) */
  menuViewActions?: MenuViewActionsType
  /** text of the primary content button(no text it doesn't appear) */
  primaryContentButtonText?: string
  /** function called when primary content button is pressed(no function it doesn't appear) */
  onPrimaryContentButtonPress?: () => void
  /** text of the footer button(no text it doesn't appear) */
  secondaryContentButtonText?: string
  /** function called when secondary content button is pressed(no function it doesn't appear) */
  onSecondaryContentButtonPress?: () => void
  /** how many screens to pop after multiStep Cancel  */
  navigationMultiStepCancelScreen?: number
}

export const FullScreenSubtask: FC<FullScreenSubtaskProps> = ({
  children,
  leftButtonText,
  title,
  rightButtonText,
  onRightButtonPress,
  rightVAIconProps,
  menuViewActions,
  primaryContentButtonText,
  onPrimaryContentButtonPress,
  secondaryContentButtonText,
  onSecondaryContentButtonPress,
  navigationMultiStepCancelScreen,
}) => {
  const theme = useTheme()
  const navigation = useNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const confirmAlert = useDestructiveAlert()
  const [leftFocusRef, setLeftFocus] = useAccessibilityFocus<TouchableWithoutFeedback>()
  const [rightFocusRef, setRightFocus] = useAccessibilityFocus<TouchableWithoutFeedback>()
  useFocusEffect(setLeftFocus)
  useFocusEffect(setRightFocus)

  const titleBannerProps: BoxProps = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'main',
    mt: theme.dimensions.fullScreenNavigationBarOffset,
    minHeight: theme.dimensions.touchableMinHeight,
  }

  const boxProps: BoxProps = {
    alignItems: 'center',
    p: theme.dimensions.buttonPadding,
    minHeight: theme.dimensions.touchableMinHeight,
  }

  const textNoIconViewProps: TextViewProps = {
    color: 'footerButton',
    variant: 'MobileBody',
  }

  const textWithIconViewProps: TextViewProps = {
    color: 'footerButton',
    variant: rightVAIconProps ? 'textWithIconButton' : 'MobileBody',
  }

  const titleTextProps: TextViewProps = {
    variant: 'BitterBoldHeading',
  }

  const message = t('areYouSure')

  const onLeftTitleButtonPress = () => {
    confirmAlert({
      title: '',
      message,
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: [
        {
          text: t('cancel'),
          onPress: () => {},
        },
        {
          text: t('close'),
          onPress: () => {
            if (navigationMultiStepCancelScreen) {
              if (navigationMultiStepCancelScreen === 1) {
                //this works for refillsummary screen close button being dismissed. Had to grab parent to go back one screen
                navigation.getParent()?.goBack()
              } else {
                navigation.dispatch(StackActions.pop(navigationMultiStepCancelScreen))
              }
            } else {
              navigation.goBack()
            }
          },
        },
      ],
    })
    return
  }

  const onRightTitleButtonPress = () => {
    if (onRightButtonPress) {
      onRightButtonPress()
      return
    }
    if (navigationMultiStepCancelScreen) {
      if (navigationMultiStepCancelScreen === 1) {
        //this works for refillsummary screen close button being dismissed. Had to grab parent to go back one screen
        navigation.getParent()?.goBack()
      } else {
        navigation.dispatch(StackActions.pop(navigationMultiStepCancelScreen))
      }
    } else {
      navigation.goBack()
    }
    return
  }

  const fillStyle: ViewStyle = {
    backgroundColor: theme.colors.background.main,
    flex: 1,
  }

  return (
    <View style={fillStyle}>
      <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background.main} />
      <Box {...titleBannerProps}>
        <Box ml={theme.dimensions.buttonPadding} flex={1} alignItems={'flex-start'}>
          {leftButtonText && (
            <TouchableWithoutFeedback ref={leftFocusRef} onPress={onLeftTitleButtonPress} accessibilityRole="button">
              <Box {...boxProps}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <TextView {...textNoIconViewProps}>{leftButtonText}</TextView>
                </Box>
              </Box>
            </TouchableWithoutFeedback>
          )}
        </Box>
        <Box mr={theme.dimensions.buttonPadding} flex={1} alignItems={'flex-end'}>
          {rightButtonText && (
            <TouchableWithoutFeedback ref={rightFocusRef} onPress={onRightTitleButtonPress} accessibilityRole="button">
              <Box {...boxProps}>
                {rightVAIconProps && <VAIcon name={rightVAIconProps.name} width={rightVAIconProps.width} height={rightVAIconProps.height} fill={rightVAIconProps.fill} />}
                <Box display="flex" flexDirection="row" alignItems="center">
                  <TextView {...textWithIconViewProps}>{rightButtonText}</TextView>
                </Box>
              </Box>
            </TouchableWithoutFeedback>
          )}
          {!rightButtonText && menuViewActions && <MenuView actions={menuViewActions} />}
        </Box>
      </Box>
      <VAScrollView>
        {title && (
          <Box my={theme.dimensions.buttonPadding} mx={theme.dimensions.gutter} flex={1}>
            <Box>
              <Box display="flex" flexDirection="row" alignItems="center">
                <TextView {...titleTextProps}>{title}</TextView>
              </Box>
            </Box>
          </Box>
        )}
        {children}
      </VAScrollView>
      {primaryContentButtonText && onPrimaryContentButtonPress && (
        <Box display="flex" flexDirection="row" mt={theme.dimensions.condensedMarginBetween} mb={theme.dimensions.contentMarginBottom} alignItems={'center'}>
          {secondaryContentButtonText && onSecondaryContentButtonPress && (
            <Box ml={theme.dimensions.gutter} flex={1} height={theme.dimensions.fullScreenContentButtonHeight}>
              <VAButton onPress={onSecondaryContentButtonPress} label={secondaryContentButtonText} buttonType={ButtonTypesConstants.buttonSecondary} />
            </Box>
          )}
          <Box
            ml={secondaryContentButtonText && onSecondaryContentButtonPress ? theme.dimensions.buttonPadding : theme.dimensions.gutter}
            mr={theme.dimensions.gutter}
            flex={1}
            height={theme.dimensions.fullScreenContentButtonHeight}>
            <VAButton onPress={onPrimaryContentButtonPress} label={primaryContentButtonText} buttonType={ButtonTypesConstants.buttonPrimary} />
          </Box>
        </Box>
      )}
    </View>
  )
}

export default FullScreenSubtask
