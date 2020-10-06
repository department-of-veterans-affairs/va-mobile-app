import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { IS_IOS, testIdProps } from 'utils/accessibility'
import { TFunction } from 'i18next'
import Chevron_Left from 'images/chevron-left-solid.svg'
import theme from 'styles/theme'

export const StyledOuterView = styled.View`
	display: flex;
	flex-direction: row;
	margin-left: 16px;
	height: ${IS_IOS ? '64px' : '20px'};
`

export const StyledChevronLeft = styled(Chevron_Left)`
	margin-top: 1px;
`

export const StyledBackText = styled.Text`
	font-size: 17px;
	line-height: 20px;
	letter-spacing: -0.4px;
	color: ${theme.white};
	margin-left: 8px;
`

type BackButtonProps = {
	onPress: (() => void) | undefined
	canGoBack: boolean | undefined
	translation: TFunction
}

export const BackButton: FC<BackButtonProps> = ({ onPress, canGoBack, translation }) => {
	if (!canGoBack) {
		return null
	}

	return (
		<TouchableWithoutFeedback onPress={onPress} {...testIdProps('back')} accessibilityRole="button" accessible={true}>
			<StyledOuterView>
				<StyledChevronLeft />
				<StyledBackText allowFontScaling={false}>{translation('header.back')}</StyledBackText>
			</StyledOuterView>
		</TouchableWithoutFeedback>
	)
}

export default BackButton
