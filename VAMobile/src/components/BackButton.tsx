import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { isIOS } from 'utils/platform'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'react-i18next'
import VAIcon from './VAIcon'
import theme from 'styles/theme'

const StyledOuterView = styled.View`
	display: flex;
	flex-direction: row;
	margin-left: 16px;
	height: ${isIOS() ? '64px' : '20px'};
`

const StyledChevronLeft = styled(VAIcon)`
	margin-top: 1px;
`

const StyledBackText = styled.Text`
	font-size: 17px;
	line-height: 20px;
	letter-spacing: -0.4px;
	color: ${theme.white};
	margin-left: 8px;
`

/**
 *  Signifies the props that need to be passed in to {@link BackButton}
 *  onPress - the onPress function for the back button
 *  canGoBack - a boolean indicating if the user has a screen to go back to; if false, the back button will be hidden
 *  displayText - translation key to use for the display text
 *  testID - a string value used to set the back buttons testID/accessibility label; defaults to 'back'
 */
export type BackButtonProps = {
	onPress: (() => void) | undefined
	canGoBack: boolean | undefined
	testID?: string
	displayText: string
}

export const BackButton: FC<BackButtonProps> = ({ onPress, canGoBack, testID = 'back', displayText }) => {
	const { t } = useTranslation()

	if (!canGoBack) {
		return null
	}

	return (
		<TouchableWithoutFeedback onPress={onPress} {...testIdProps(testID)} accessibilityRole="button" accessible={true}>
			<StyledOuterView>
				<StyledChevronLeft name={'ArrowLeft'} fill="#FFF" />
				<StyledBackText allowFontScaling={false}>{t(displayText)}</StyledBackText>
			</StyledOuterView>
		</TouchableWithoutFeedback>
	)
}

export default BackButton
