import { Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, BoxProps, ButtonTypesConstants, TextView, TextViewProps, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useDestructiveAlert, useTheme } from 'utils/hooks'
import VAIcon, { VAIconProps } from 'components/VAIcon'

/*To use this template to rap the screen you want in <FullScreenSubtask> </FullScreenSubtask> and supply the needed props for them to display
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
  /** icon for title bar right button(must have right button text to display) */
  rightVAIconProps?: VAIconProps
  /** text of the primary content button(no text it doesn't appear) */
  primaryContentButtonText?: string
  /** function called when primary content button is pressed(no function it doesn't appear) */
  onPrimaryContentButtonPress?: () => void
  /** text of the footer button(no text it doesn't appear) */
  secondaryContentButtonText?: string
  /** function called when primary content button is pressed(no function it doesn't appear) */
  onSecondaryContentButtonPress?: () => void
}

const FullScreenSubtask: FC<FullScreenSubtaskProps> = ({
  children,
  leftButtonText,
  title,
  rightButtonText,
  rightVAIconProps,
  primaryContentButtonText,
  onPrimaryContentButtonPress,
  secondaryContentButtonText,
  onSecondaryContentButtonPress,
}) => {
  const theme = useTheme()
  const navigation = useNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const confirmAlert = useDestructiveAlert()

  const titleBannerProps: BoxProps = {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: theme.dimensions.touchableMinHeight,
    backgroundColor: 'main',
    mt: theme.dimensions.fullScreenNavigationBarOffset,
  }

  const boxProps: BoxProps = {
    alignItems: 'center',
    p: theme.dimensions.buttonPadding,
    height: theme.dimensions.touchableMinHeight,
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
            navigation.goBack()
          },
        },
      ],
    })
    return
  }

  const onRightTitleButtonPress = () => {
    navigation.goBack()
    return
  }

  return (
    <>
      <Box {...titleBannerProps}>
        <Box ml={theme.dimensions.buttonPadding} flex={1}>
          {leftButtonText && (
            <Pressable onPress={onLeftTitleButtonPress} accessibilityRole="button" accessible={true}>
              <Box {...boxProps}>
                <Box display="flex" flexDirection="row" alignItems="center">
                  <TextView {...textNoIconViewProps}>{leftButtonText}</TextView>
                </Box>
              </Box>
            </Pressable>
          )}
        </Box>
        <Box flex={2} />
        <Box mr={theme.dimensions.buttonPadding} flex={1}>
          {rightButtonText && (
            <Pressable onPress={onRightTitleButtonPress} accessibilityRole="button" accessible={true}>
              <Box {...boxProps}>
                {rightVAIconProps && <VAIcon name={rightVAIconProps.name} width={rightVAIconProps.width} height={rightVAIconProps.height} fill={rightVAIconProps.fill} />}
                <Box display="flex" flexDirection="row" alignItems="center">
                  <TextView {...textWithIconViewProps}>{rightButtonText}</TextView>
                </Box>
              </Box>
            </Pressable>
          )}
        </Box>
      </Box>
      <VAScrollView>
        {title && (
          <Box mt={theme.dimensions.buttonPadding} mx={theme.dimensions.gutter} flex={1}>
            <Box>
              <Box display="flex" flexDirection="row" alignItems="center">
                <TextView {...titleTextProps}>{title}</TextView>
              </Box>
            </Box>
          </Box>
        )}
        {children}
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
      </VAScrollView>
    </>
  )
}

export default FullScreenSubtask
