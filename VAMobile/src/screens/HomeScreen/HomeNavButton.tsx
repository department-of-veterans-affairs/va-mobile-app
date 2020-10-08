import React, { FC } from 'react'
import styled from 'styled-components/native'

import BlueArrow from 'images/right-arrow_blue.svg'

import { StyledBitterBoldText, StyledSourceRegularText, ViewFlexRowSpaceBetween } from 'styles/common'
import { ThemeType } from 'styles/theme'
import { generateTestID, useFontScale } from 'utils/common'
import { testIdProps } from 'utils/accessibility'

const Title = styled(StyledBitterBoldText)`
	color: ${(props: ThemeType): string => props.theme.primaryBlack};
	font-size: 20px;
	margin-bottom: 10px;
`

const SubText = styled(StyledSourceRegularText)`
	color: ${(props: ThemeType): string => props.theme.primaryBlack};
`

const StyledView = styled(ViewFlexRowSpaceBetween)`
	width: 100%;
	min-height: 81px;
	border-radius: 6px;
	padding-top: 12px;
	padding-bottom: 15px;
	padding-left: 10px;
	padding-right: 14px;
	margin-bottom: 15px;
	background-color: ${(props: ThemeType): string => props.theme.white};
`

const ContentView = styled.View`
	width: 90%;
`

interface HomeNavButtonProps {
	title: string
	subText: string
	a11yHint: string
	onPress: () => void
}

/**
 * Reusable menu item for the HomeScreen
 *
 * @param title - string for header and used to create testID for accessibility
 * @param subText - string secondary text that seats on the second row
 * @param onPress - function to be called when press occurs
 * @param a11yHint - string for accessibility hint
 *
 * @returns HomeNavButton component
 */
const HomeNavButton: FC<HomeNavButtonProps> = ({ title, subText, a11yHint, onPress }: HomeNavButtonProps) => {
	const _onPress = (): void => {
		onPress()
	}

	const testId = generateTestID(title, 'home-nav-button')

	return (
		<StyledView onPress={_onPress} {...testIdProps(testId)} accessible={true} accessibilityRole={'menuitem'} accessibilityHint={a11yHint}>
			<ContentView>
				<Title {...testIdProps(testId + '-title')}>{title}</Title>
				<SubText {...testIdProps(testId + '-subtext')}>{subText}</SubText>
			</ContentView>
			<BlueArrow width={useFontScale(10)} height={useFontScale(15)} />
		</StyledView>
	)
}

export default HomeNavButton
