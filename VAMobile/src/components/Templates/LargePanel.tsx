import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { FooterButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useDestructiveAlert } from 'utils/hooks'
import HeaderBanner, { HeaderBannerProps } from './HeaderBanner'
/*To use this template to rap the screen you want in <LargePanel> </LargePanel> and supply the needed props for them to display
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
  /** text of the footer button(no text it doesn't appear) */
  footerButtonText?: string
  /** function called when footer button is pressed(no function it doesn't appear) */
  onFooterButtonPress?: () => void
  /** function called when right button is pressed and a save action is needed */
  onRightButtonPress?: () => void
}

const LargePanel: FC<LargePanelProps> = ({
  children,
  leftButtonText,
  leftButtonA11yLabel,
  title,
  titleA11yLabel,
  rightButtonText,
  rightButtonA11yLabel,
  footerButtonText,
  onRightButtonPress,
  onFooterButtonPress,
}) => {
  const navigation = useNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const confirmAlert = useDestructiveAlert()

  const message = t('areYouSure')

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
    leftButton: leftButtonText ? { text: leftButtonText, a11yLabel: leftButtonA11yLabel, onPress: leftTitleButtonPress } : undefined,
    title: title ? { type: 'Static', title, a11yLabel: titleA11yLabel } : undefined,
    rightButton: rightButtonText ? { text: rightButtonText, a11yLabel: rightButtonA11yLabel, onPress: rightTitleButtonPress } : undefined,
    divider: true,
  }

  return (
    <>
      <HeaderBanner {...headerProps} />
      <VAScrollView>
        {children}
        {footerButtonText && onFooterButtonPress && <FooterButton text={footerButtonText} backGroundColor="buttonPrimary" textColor={'navBar'} onPress={onFooterButtonPress} />}
      </VAScrollView>
    </>
  )
}

export default LargePanel
