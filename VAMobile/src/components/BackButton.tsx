import { TouchableWithoutFeedback } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { isIOS } from 'utils/platform'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import VAIcon from './VAIcon'

const StyledOuterView = styled.View`
  display: flex;
  flex-direction: row;
  margin-left: 16px;
  height: ${isIOS() ? '64px' : '20px'};
`

const StyledBackText = styled.Text`
  ${themeFn((theme) => theme.typography.MobileBody)};
  letter-spacing: -0.4px;
  color: ${themeFn((theme) => theme.colors.text.primaryContrast)};
  margin-left: 8px;
`

/**
 *  Signifies the props that need to be passed in to {@link BackButton}
 */
export type BackButtonProps = {
  /** the onPress function for the back button */
  onPress: (() => void) | undefined
  /** a boolean indicating if the user has a screen to go back to; if false, the back button will be hidden */
  canGoBack: boolean | undefined
  /** a string value used to set the back buttons testID/accessibility label; defaults to 'back' */
  testID?: string
  /** translation key to use for the display text */
  i18nId: string
  /** whether to show the carat left of the text */
  showCarat?: boolean | true
}

/**
 * Button used by the stack navigation to go back to the previous screen
 */
export const BackButton: FC<BackButtonProps> = ({ onPress, canGoBack, testID = 'back', i18nId, showCarat }) => {
  const { t } = useTranslation()

  if (!canGoBack) {
    return null
  }

  const chevron = showCarat ? <VAIcon mt={1} name={'ArrowLeft'} fill="contrast" /> : <></>

  return (
    <TouchableWithoutFeedback onPress={onPress} {...testIdProps(testID)} accessibilityRole="button" accessible={true}>
      <StyledOuterView>
        {chevron}
        <StyledBackText allowFontScaling={false}>{t(i18nId)}</StyledBackText>
      </StyledOuterView>
    </TouchableWithoutFeedback>
  )
}

export default BackButton
