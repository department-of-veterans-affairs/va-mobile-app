import { View } from 'react-native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import BlueArrow from 'images/right-arrow_blue.svg'

import { StyledBitterBoldText, StyledSourceRegularText, ViewFlexRowSpaceBetween } from 'styles/common'
import { ThemeType } from 'styles/theme'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'

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
	width: 91%;
	min-height: 81px;
	border-radius: 6px;
	padding-top: 12px;
	padding-bottom: 15px;
	padding-left: 10px;
	padding-right: 14px;
	margin-bottom: 15px;
	background-color: ${(props: ThemeType): string => props.theme.white};
`

interface HomeNavButtonProps {
	title: string
	subText: string
	a11yHint: string
	onPress: () => void
}

export const HomeNavButton: FC<HomeNavButtonProps> = ({ title, subText, a11yHint, onPress }: HomeNavButtonProps) => {
	const _onPress = (): void => {
		onPress()
	}

	const testId = generateTestID(title, 'home-nav-button')

	return (
		<StyledView onPress={_onPress} {...testIdProps(testId)} accessible={true} accessibilityRole={'menuitem'} accessibilityHint={a11yHint}>
			<View>
				<Title>{title}</Title>
				<SubText>{subText}</SubText>
			</View>
			<BlueArrow width={11} height={16} />
		</StyledView>
	)
}

export default HomeNavButton
