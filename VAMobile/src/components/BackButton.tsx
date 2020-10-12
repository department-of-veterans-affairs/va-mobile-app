import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { TFunction } from 'i18next'
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
		<TouchableWithoutFeedback onPress={onPress} {...testIdProps(testID)} accessibilityRole="button" accessible={true}>
			<StyledOuterView>
				<VAIcon mt={1} name={'ArrowLeft'} fill="contrast" />
				<StyledBackText allowFontScaling={false}>{translation('back')}</StyledBackText>
			</StyledOuterView>
		</TouchableWithoutFeedback>
	)
}

export default BackButton
