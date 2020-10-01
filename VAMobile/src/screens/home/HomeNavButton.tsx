import { View } from 'react-native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import BlueArrow from 'images/right-arrow_blue.svg'

import { StyledBitterBoldText, StyledSourceRegularText, ViewFlexRowSpaceBetween } from 'styles/common'
import { ThemeType } from 'styles/theme'

export const Title = styled(StyledBitterBoldText)`
	color: ${(props: ThemeType): string => props.theme.primaryBlack};
	font-size: 20px;
	font-weight: 700;
	margin-bottom: 10px;
`

export const SubText = styled(StyledSourceRegularText)`
	color: ${(props: ThemeType): string => props.theme.primaryBlack};
	font-size: 16px;
`

export const StyledView = styled(ViewFlexRowSpaceBetween)`
	width: 90%;
	height: 81px;
	border-radius: 6px;
	padding-vertical: 15px;
	padding-horizontal: 10px;
	margin-bottom: 15px;
	background-color: ${(props: ThemeType): string => props.theme.white};
`

interface HomeNavButtonProps {
	title: string
	subText: string
	onPress: () => void
}

export const HomeNavButton: FC<HomeNavButtonProps> = ({ title, subText, onPress }: HomeNavButtonProps) => {
	const _onPress = (): void => {
		onPress()
	}

	return (
		<StyledView onPress={_onPress}>
			<View>
				<Title>{title}</Title>
				<SubText>{subText}</SubText>
			</View>
			<BlueArrow width={11} height={26} />
		</StyledView>
	)
}

export default HomeNavButton
