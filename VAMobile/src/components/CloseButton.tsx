import { TouchableWithoutFeedback } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'
import Box from './Box'
import TextView from './TextView'

/**
 *  Signifies the props that need to be passed in to {@link CloseButton}
 */
export type CloseButtonProps = {
  /** the onPress function for the close button */
  onPress: (() => void) | undefined
  /** optional param to add accessibility hint to close button */
  a11yHint?: string
  /** boolean to specify if we want accesibility to focus on the close button */
  focusOnButton?: boolean
}

/**
 * Button used by the stack request appointment modal
 */
export const CloseButton: FC<CloseButtonProps> = ({ onPress, a11yHint, focusOnButton }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const [focusRef, setFocus] = useAccessibilityFocus<TouchableWithoutFeedback>()

  useFocusEffect(focusOnButton ? setFocus : () => {})

  const a11yHintPropParam = a11yHint ? a11yHint : ''

  return (
    <TouchableWithoutFeedback ref={focusRef} onPress={onPress} {...testIdProps(t('close'))} {...a11yHintProp(a11yHintPropParam)} accessibilityRole="button" accessible={true}>
      <Box display="flex" flexDirection="row" ml={16} height={theme.dimensions.headerHeight} width={80} alignItems={'center'}>
        <TextView variant="MobileBodyBold" ml={theme.dimensions.textIconMargin} allowFontScaling={false} accessible={false}>
          {/* Hard coded X for now we do not know if it is going to be a icon or not */}
          {`${'X'} ${t('close')}`}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default CloseButton
