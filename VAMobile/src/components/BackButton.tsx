import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { TFunction } from 'i18next'
import { isIOS } from 'utils/platform'
import { testIdProps } from 'utils/accessibility'
import Chevron_Left from 'images/chevron-left-solid.svg'
import theme from 'styles/theme'

const StyledOuterView = styled.View`
	display: flex;
	flex-direction: row;
	margin-left: 16px;
	height: ${isIOS() ? '64px' : '20px'};
`

const StyledChevronLeft = styled(Chevron_Left)`
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
 *  translation - useTranslations t function to translate the text
 *  testID - a string value used to set the back buttons testID/accessibility label; defaults to 'back'
 */
export type BackButtonProps = {
	onPress: (() => void) | undefined
	canGoBack: boolean | undefined
	translation: TFunction
	testID?: string
}

export const BackButton: FC<BackButtonProps> = ({ onPress, canGoBack, translation, testID = 'back' }) => {
	if (!canGoBack) {
		return null
	}

	return (
		<TouchableWithoutFeedback onPress={onPress} {...testIdProps(testID)} accessibilityRole="button" accessibilityHint="Goes back to the previous screen" accessible={true}>
			<StyledOuterView>
				<StyledChevronLeft />
				<StyledBackText allowFontScaling={false}>{translation('back')}</StyledBackText>
			</StyledOuterView>
		</TouchableWithoutFeedback>
	)
}

export default BackButton
