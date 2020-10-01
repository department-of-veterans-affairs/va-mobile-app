import React, { FC } from 'react'
import styled from 'styled-components/native'

import { StyledSourceRegularText, ViewFlexRowSpaceBetween } from 'styles/common'
import { ThemeType } from 'styles/theme'

export const StyledText = styled(StyledSourceRegularText)`
	color: ${(props: ThemeType): string => props.theme.textColor};
	font-size: 16px;
`

const ArrowImage = styled.Image`
	width: 9px;
	height: 100%;
`

export const StyledView = styled(ViewFlexRowSpaceBetween)`
	width: 100%;
	height: 44px;
	padding-vertical: 10px;
	padding-horizontal: 10px;
	background-color: ${(props: ThemeType): string => props.theme.white};
	border-bottom-width: 1px;
	border-color: ${(props: ThemeType): string => props.theme.gray};
	border-style: solid;
`

interface WideButtonProps {
	title: string
	onPress: () => void
}

export const WideButton: FC<WideButtonProps> = ({ title, onPress }: WideButtonProps) => {
	const _onPress = (): void => {
		onPress()
	}

	return (
		<StyledView onPress={_onPress}>
			<StyledText>{title}</StyledText>
			<ArrowImage source={require('/images/right-arrow_grey.png')} />
		</StyledView>
	)
}

export default WideButton
