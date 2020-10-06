import { TouchableWithoutFeedback } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { testIdProps } from 'utils/accessibility'
import Chevron_Left from 'images/chevron-left-solid.svg'
import theme from 'styles/theme'

const StyledOuterView = styled.View`
	display: flex;
	flex-direction: row;
	margin-left: 16px;
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

type BackButtonProps = {
	onPress: (() => void) | undefined
	canGoBack: boolean | undefined
}

export const BackButton: FC<BackButtonProps> = ({ onPress, canGoBack }) => {
	if (!canGoBack) {
		return null
	}

	const { t } = useTranslation()

	return (
		<TouchableWithoutFeedback onPress={onPress} {...testIdProps('back')} accessibilityRole="button" accessible={true}>
			<StyledOuterView>
				<StyledChevronLeft />
				<StyledBackText>{t('header.back')}</StyledBackText>
			</StyledOuterView>
		</TouchableWithoutFeedback>
	)
}

export default BackButton
