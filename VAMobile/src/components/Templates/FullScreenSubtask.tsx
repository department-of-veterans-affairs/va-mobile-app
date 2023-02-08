import { StackActions, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, TextView, TextViewProps, VAButton, VAScrollView } from 'components'
import { MenuViewActionsType } from 'components/Menu'
import { NAMESPACE } from 'constants/namespaces'
import { VAIconProps } from 'components/VAIcon'
import { useDestructiveAlert, useTheme } from 'utils/hooks'
import HeaderBanner, { HeaderBannerProps } from './HeaderBanner'

/*To use this template to wrap the screen you want in <FullScreenSubtask> </FullScreenSubtask> and supply the needed props for them to display
in the screen navigator update 'screenOptions={{ headerShown: false }}' to hide the previous navigation display for all screens in the navigator.
Use 'options={{headerShown: false}}'(preferred method for subtask) in the individual screen if only an individual screen is supposed to do it.
*/

export type FullScreenSubtaskProps = {
  /** text of the title bar left button(no text it doesn't appear) */
  leftButtonText?: string
  /** function called when left button is pressed (defaults to back navigation if omitted) */
  onLeftButtonPress?: () => void
  /** a11y label for left button text */
  leftButtonA11yLabel?: string
  /** text of the title bar title(no text it doesn't appear) */
  title?: string
  /** a11y label for title text */
  titleA11yLabel?: string
  /** text of the title bar right button(no text it doesn't appear) */
  rightButtonText?: string
  /** function called when right button is pressed (defaults to back navigation if omitted) */
  onRightButtonPress?: () => void
  /** optional boolean that determines whether to diasable the right header button */
  rightButtonDisabled?: boolean
  /** a11y label for right button text */
  rightButtonA11yLabel?: string
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
  onLeftButtonPress,
  leftButtonA11yLabel,
  title,
  titleA11yLabel,
  rightButtonText,
  onRightButtonPress,
  rightButtonA11yLabel,
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

  const titleTextProps: TextViewProps = {
    variant: 'BitterBoldHeading',
    accessibilityLabel: titleA11yLabel,
  }

  const message = t('areYouSure')

  const onLeftTitleButtonPress = () => {
    if (onLeftButtonPress) {
      onLeftButtonPress()
      return
    } else {
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

  const headerProps: HeaderBannerProps = {
    leftButton: leftButtonText ? { text: leftButtonText, a11yLabel: leftButtonA11yLabel, onPress: onLeftTitleButtonPress } : undefined,
    rightButton: rightButtonText ? { text: rightButtonText, a11yLabel: rightButtonA11yLabel, onPress: onRightTitleButtonPress, icon: rightVAIconProps } : undefined,
    menuViewActions,
  }

  return (
    <>
      <HeaderBanner {...headerProps} />
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
    </>
  )
}

export default FullScreenSubtask
