import { Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, BoxProps, FooterButton, TextView, TextViewProps, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useDestructiveAlert, useTheme } from 'utils/hooks'
/*To use this template to rap the screen you want in <LargePanel> </LargePanel> and supply the needed props for them to display
in the screen navigator update 'screenOptions={{ headerShown: false }}' to hide the previous navigation display for all screens in the navigator.
Use 'options={{headerShown: false}}' in the individual screen if only an individual screen is supposed to do it.
*/

export type LargePanelProps = {
  /** text of the title bar left button(no text it doesn't appear) */
  leftButtonText?: string
  /** text of the title bar title(no text it doesn't appear) */
  title?: string
  /** text of the title bar right button(no text it doesn't appear) */
  rightButtonText?: string
  /** text of the footer button(no text it doesn't appear) */
  footerButtonText?: string
  /** function called when footer button is pressed(no function it doesn't appear) */
  onFooterButtonPress?: () => void
  /** function called when right button is pressed and a save action is needed */
  onRightButtonPress?: () => void
}

export const LargePanel: FC<LargePanelProps> = ({ children, leftButtonText, title, rightButtonText, footerButtonText, onRightButtonPress, onFooterButtonPress }) => {
  const theme = useTheme()
  const navigation = useNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const confirmAlert = useDestructiveAlert()

  const titleBannerProps: BoxProps = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: 64,
    backgroundColor: 'main',
    borderBottomWidth: 1,
    borderBottomColor: 'menuDivider',
  }

  const boxProps: BoxProps = {
    alignItems: 'center',
    p: theme.dimensions.buttonPadding,
    minHeight: 64,
  }

  const textViewProps: TextViewProps = {
    color: 'footerButton',
  }

  const titleTextProps: TextViewProps = {
    variant: 'MobileBodyBold',
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
            navigation.goBack()
          },
        },
      ],
    })
    return
  }

  const onRightTitleButtonPress = () => {
    if (onRightButtonPress) {
      onRightButtonPress
    }
    navigation.goBack()
    return
  }

  return (
    <SafeAreaView edges={['top']}>
      <Box {...titleBannerProps}>
        <Box ml={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding} flex={1}>
          {leftButtonText && (
            <Pressable onPress={onLeftTitleButtonPress} accessibilityRole="button" accessible={true}>
              <Box {...boxProps}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <TextView {...textViewProps}>{leftButtonText}</TextView>
                </Box>
              </Box>
            </Pressable>
          )}
        </Box>
        <Box mt={theme.dimensions.buttonPadding} flex={3}>
          {title && (
            <Box {...boxProps}>
              <Box display="flex" flexDirection="row" alignItems="center">
                <TextView {...titleTextProps}>{title}</TextView>
              </Box>
            </Box>
          )}
        </Box>
        <Box mr={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding} flex={1}>
          {rightButtonText && (
            <Pressable onPress={onRightTitleButtonPress} accessibilityRole="button" accessible={true}>
              <Box {...boxProps}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <TextView {...textViewProps}>{rightButtonText}</TextView>
                </Box>
              </Box>
            </Pressable>
          )}
        </Box>
      </Box>
      <VAScrollView>
        {children}
        {footerButtonText && onFooterButtonPress && <FooterButton text={footerButtonText} backGroundColor="buttonPrimary" textColor={'navBar'} onPress={onFooterButtonPress} />}
      </VAScrollView>
    </SafeAreaView>
  )
}

export default LargePanel
