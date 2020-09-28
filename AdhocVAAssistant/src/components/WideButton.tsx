import { Text } from 'react-native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { StyledSourceRegularText, ViewFlexRowSpaceBetween } from 'styles/common'
import { ThemeType } from 'styles/theme'

const StyledText = styled(StyledSourceRegularText)`
	color: #000000;
	font-size: 16px;
`

const StyledView = styled(ViewFlexRowSpaceBetween)`
	border-radius: 5px;
	width: 100%;
	height: 44px;
	padding-vertical: 10px;
	padding-horizontal: 10px;
	background-color: ${(props: ThemeType): string => props.theme.white};
	border-bottom-width: 2px;
	border-color: ${(props: ThemeType): string => props.theme.gray};
	border-style: solid;
`

interface WideButtonProps {
	title: string
	onPress?: () => void
}

export const WideButton: FC<WideButtonProps> = ({ title, onPress }: WideButtonProps) => {
	const _onPress = (): void => {
		if (onPress) {
			onPress()
		}
	}

	return (
		<StyledView onPress={_onPress}>
			<StyledText>{title}</StyledText>
			<Text>{'>'}</Text>
		</StyledView>
	)
}

export default WideButton
