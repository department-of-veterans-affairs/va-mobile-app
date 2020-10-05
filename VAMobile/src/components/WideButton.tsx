import React, { FC } from 'react'
import styled from 'styled-components/native'

import GreyArrow from 'images/right-arrow_grey.svg'

import { StyledSourceRegularText, ViewFlexRowSpaceBetween } from 'styles/common'
import { ThemeType } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'

export const StyledText = styled(StyledSourceRegularText)`
	color: ${(props: ThemeType): string => props.theme.textColor};
	font-size: 16px;
	width: 100%;
`

export const StyledView = styled(ViewFlexRowSpaceBetween)`
	width: 100%;
	min-height: 44px;
	padding-vertical: 10px;
	padding-horizontal: 20px;
	background-color: ${(props: ThemeType): string => props.theme.white};
	border-bottom-width: 1px;
	border-color: ${(props: ThemeType): string => props.theme.gray};
	border-style: solid;
`

interface WideButtonProps {
	title: string
	a11yHint: string
	onPress: () => void
}

export const WideButton: FC<WideButtonProps> = ({ title, onPress, a11yHint }: WideButtonProps) => {
	const _onPress = (): void => {
		onPress()
	}

	// ex. 'My-title' -> 'my-title-wide-button'
	const testId = title.toLowerCase().replace(/\s/g, '-') + '-wide-button'

	return (
		<StyledView onPress={_onPress} {...testIdProps(testId)} accessible={true} accessibilityRole={'menuitem'} accessibilityHint={a11yHint}>
			<StyledText>{title}</StyledText>
			<GreyArrow width={11} height={16} />
		</StyledView>
	)
}

export default WideButton
