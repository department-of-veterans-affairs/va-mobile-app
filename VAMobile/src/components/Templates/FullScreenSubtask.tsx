import { StackActions, useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import React, { FC, Ref } from 'react'

import { Box, ButtonTypesConstants, CrisisLineCta, TextView, TextViewProps, VAButton, VAScrollView } from 'components'
import { MenuViewActionsType } from 'components/Menu'
import { NAMESPACE } from 'constants/namespaces'
import { ScrollView, View, ViewStyle } from 'react-native'
import { VAIconProps } from 'components/VAIcon'
import { useDestructiveActionSheet, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import HeaderBanner, { HeaderBannerProps } from './HeaderBanner'

/*To use this template to wrap the screen you want in <FullScreenSubtask> </FullScreenSubtask> and supply the needed props for them to display
in the screen navigator update 'screenOptions={{ headerShown: false }}' to hide the previous navigation display for all screens in the navigator.
Use 'options={FULLSCREEN_SUBTASK_OPTIONS}'(preferred method for subtask) in the individual screen if only an individual screen is supposed to do it.
*/

export type FullScreenSubtaskProps = {
  /** text of the title bar left button(no text it doesn't appear) */
  leftButtonText?: string
  /** function called when left button is pressed (defaults to back navigation if omitted) */
  onLeftButtonPress?: () => void
  /** a11y label for left button text */
  leftButtonA11yLabel?: string
  /** Optional TestID for left button */
  leftButtonTestID?: string
  /** text of the title bar title(no text it doesn't appear) */
  title?: string
  /** a11y label for title text */
  titleA11yLabel?: string
  /** text of the title bar right button(no text it doesn't appear) */
  rightButtonText?: string
  /** function called when right button is pressed (defaults to back navigation if omitted) */
  onRightButtonPress?: () => void
  /** optional boolean that determines whether to disable the right header button */
  rightButtonDisabled?: boolean
  /** a11y label for right button text */
  rightButtonA11yLabel?: string
  /** Optional TestID for right button */
  rightButtonTestID?: string
  /** icon for title bar right button(must have right button text to display) */
  rightVAIconProps?: VAIconProps
  /** ref for the VAScrollView component that contains the content */
  scrollViewRef?: Ref<ScrollView>
  /** shows the menu icon with the specified action types (won't be shown if right button text is set) */
  menuViewActions?: MenuViewActionsType
  /** text of the primary content button(no text it doesn't appear) */
  primaryContentButtonText?: string
  /** function called when primary content button is pressed(no function it doesn't appear) */
  onPrimaryContentButtonPress?: () => void
  /** Optional TestID for primary button */
  primaryButtonTestID?: string
  /** text of the footer button(no text it doesn't appear) */
  secondaryContentButtonText?: string
  /** function called when secondary content button is pressed(no function it doesn't appear) */
  onSecondaryContentButtonPress?: () => void
  /** how many screens to pop after multiStep Cancel  */
  navigationMultiStepCancelScreen?: number
  /** whether to show the crisis line CTA (defaults to false) */
  showCrisisLineCta?: boolean
  /** Optional testID */
  testID?: string
}

export const FullScreenSubtask: FC<FullScreenSubtaskProps> = ({
  children,
  leftButtonText,
  onLeftButtonPress,
  leftButtonA11yLabel,
  leftButtonTestID,
  title,
  titleA11yLabel,
  rightButtonText,
  onRightButtonPress,
  rightButtonA11yLabel,
  rightButtonTestID,
  rightVAIconProps,
  scrollViewRef,
  menuViewActions,
  primaryContentButtonText,
  onPrimaryContentButtonPress,
  primaryButtonTestID,
  secondaryContentButtonText,
  onSecondaryContentButtonPress,
  navigationMultiStepCancelScreen,
  showCrisisLineCta = false,
  testID,
}) => {
  const theme = useTheme()
  const navigation = useNavigation()
  const navigateTo = useRouteNavigation()
  const insets = useSafeAreaInsets()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const confirmAlert = useDestructiveActionSheet()

  const titleTextProps: TextViewProps = {
    variant: 'BitterBoldHeading',
    accessibilityLabel: titleA11yLabel,
    accessibilityRole: 'header',
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
    leftButton: leftButtonText ? { text: leftButtonText, a11yLabel: leftButtonA11yLabel, testID: leftButtonTestID, onPress: onLeftTitleButtonPress } : undefined,
    rightButton: rightButtonText
      ? { text: rightButtonText, a11yLabel: rightButtonA11yLabel, testID: rightButtonTestID, onPress: onRightTitleButtonPress, icon: rightVAIconProps }
      : undefined,
    menuViewActions,
  }
  const fillStyle: ViewStyle = {
    paddingTop: insets.top,
    backgroundColor: theme.colors.background.main,
    flex: 1,
  }
  const titleMarginTop = showCrisisLineCta ? 0 : theme.dimensions.buttonPadding

  return (
    <View {...fillStyle}>
      <HeaderBanner {...headerProps} />
      <VAScrollView scrollViewRef={scrollViewRef} testID={testID}>
        {showCrisisLineCta && <CrisisLineCta onPress={navigateTo('VeteransCrisisLine')} />}
        {title && (
          <Box mt={titleMarginTop} mb={theme.dimensions.buttonPadding} mx={theme.dimensions.gutter}>
            <TextView {...titleTextProps}>{title}</TextView>
          </Box>
        )}
        {children}
      </VAScrollView>
      {primaryContentButtonText && onPrimaryContentButtonPress && (
        <Box display="flex" flexDirection="row" mt={theme.dimensions.condensedMarginBetween} mb={theme.dimensions.contentMarginBottom} alignItems={'center'}>
          {secondaryContentButtonText && onSecondaryContentButtonPress && (
            <Box ml={theme.dimensions.gutter} flex={1}>
              <VAButton onPress={onSecondaryContentButtonPress} label={secondaryContentButtonText} buttonType={ButtonTypesConstants.buttonSecondary} />
            </Box>
          )}
          <Box ml={secondaryContentButtonText && onSecondaryContentButtonPress ? theme.dimensions.buttonPadding : theme.dimensions.gutter} mr={theme.dimensions.gutter} flex={1}>
            <VAButton onPress={onPrimaryContentButtonPress} label={primaryContentButtonText} buttonType={ButtonTypesConstants.buttonPrimary} testID={primaryButtonTestID} />
          </Box>
        </Box>
      )}
    </View>
  )
}

export default FullScreenSubtask
