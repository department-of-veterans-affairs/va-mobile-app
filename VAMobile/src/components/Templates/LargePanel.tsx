import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, View, ViewStyle } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { VAScrollView, WaygateWrapper } from 'components'
import HeaderBanner, { HeaderBannerProps } from 'components/Templates/HeaderBanner'
import { NAMESPACE } from 'constants/namespaces'
import { useDestructiveActionSheet, useTheme } from 'utils/hooks'

/* To use this template to wrap the screen you want in <LargePanel> </LargePanel> and supply the needed props for them to display
in the screen navigator update 'screenOptions={{ headerShown: false }}' to hide the previous navigation display for all screens in the navigator.
Use 'options={{headerShown: false}}' in the individual screen if only an individual screen is supposed to do it.
*/

export type LargePanelProps = {
  /** text of the title bar left button(no text it doesn't appear) */
  leftButtonText?: string
  /** a11y label for left button text */
  leftButtonA11yLabel?: string
  /** text of the title bar title(no text it doesn't appear) */
  title?: string
  /** a11y label for title text */
  titleA11yLabel?: string
  /** text of the title bar right button(no text it doesn't appear) */
  rightButtonText?: string
  /** a11y label for right button text */
  rightButtonA11yLabel?: string
  /** Optional TestID */
  rightButtonTestID?: string
  /** text of the footer button(no text it doesn't appear) */
  footerButtonText?: string
  /** function called when footer button is pressed(no function it doesn't appear) */
  onFooterButtonPress?: () => void
  /** function called when right button is pressed and a save action is needed */
  onRightButtonPress?: () => void
  /** Optional TestID for scrollView */
  testID?: string
  /** bypass divider marginbottom */
  dividerMarginBypass?: boolean
  /** scrollview insets removal - used for when wanting to extend background color when in landscape mode across the screen, default is false */
  removeInsets?: boolean
  /** hides modal */
  hideModal?: boolean
}

export const LargePanel: FC<LargePanelProps> = ({
  children,
  leftButtonText,
  leftButtonA11yLabel,
  title,
  titleA11yLabel,
  rightButtonText,
  rightButtonA11yLabel,
  rightButtonTestID,
  footerButtonText,
  onRightButtonPress,
  onFooterButtonPress,
  testID,
  dividerMarginBypass,
  removeInsets,
  hideModal,
}) => {
  const [showScrollView, setShowScrollView] = useState(false)
  const navigation = useNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const confirmAlert = useDestructiveActionSheet()
  const theme = useTheme()
  const message = t('areYouSure')

  // Workaround to fix issue with ScrollView nested inside a Modal - affects Android
  // https://github.com/facebook/react-native/issues/48822
  useEffect(() => {
    if (!hideModal) {
      const timeout = setTimeout(() => setShowScrollView(true), 50)
      return () => clearTimeout(timeout)
    } else {
      setShowScrollView(false)
    }
  }, [hideModal])

  const leftTitleButtonPress = () => {
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

  const rightTitleButtonPress = () => {
    if (onRightButtonPress) {
      onRightButtonPress
    }
    navigation.goBack()
    return
  }

  const headerProps: HeaderBannerProps = {
    leftButton: leftButtonText
      ? { text: leftButtonText, a11yLabel: leftButtonA11yLabel, onPress: leftTitleButtonPress }
      : undefined,
    title: title ? { type: 'Static', title, a11yLabel: titleA11yLabel } : undefined,
    rightButton: rightButtonText
      ? {
          text: rightButtonText,
          a11yLabel: rightButtonA11yLabel,
          accessibilityRole: 'link',
          onPress: rightTitleButtonPress,
          testID: rightButtonTestID,
        }
      : undefined,
    divider: true,
    dividerMarginBypass: dividerMarginBypass,
  }

  const fillStyle: ViewStyle = {
    backgroundColor: theme.colors.background.main,
    height: '85%',
    top: '15%',
  }

  const containerStyle: ViewStyle = {
    flexGrow: 1,
    backgroundColor: theme.colors.background.veteranStatus,
    justifyContent: 'center',
  }

  return (
    // Modal to ensure keyboard navigation is confined to focusable elements within panel
    <Modal visible={!hideModal} animationType="slide" transparent={true}>
      <View {...fillStyle}>
        <HeaderBanner {...headerProps} />
        {showScrollView && (
          <VAScrollView
            testID={testID}
            removeInsets={removeInsets}
            contentContainerStyle={removeInsets ? containerStyle : undefined}>
            <WaygateWrapper>
              {children}
              {footerButtonText && onFooterButtonPress && (
                <Button label={footerButtonText} onPress={onFooterButtonPress} />
              )}
            </WaygateWrapper>
          </VAScrollView>
        )}
      </View>
    </Modal>
  )
}

export default LargePanel
