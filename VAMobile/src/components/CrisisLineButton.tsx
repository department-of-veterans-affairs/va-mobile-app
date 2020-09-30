import React, { FC } from 'react'
import styled from 'styled-components/native'

import { StyledSourceBoldText, StyledSourceRegularText } from 'styles/common'
import { ThemeType } from 'styles/theme'
import WhiteArrow from 'images/right-arrow_white.svg'

const StyledText = styled(StyledSourceRegularText)`
	color: ${(props: ThemeType): string => props.theme.white};
	font-size: 16px;
	line-height: 18px;
`

const StyledBoldText = styled(StyledSourceBoldText)`
	color: ${(props: ThemeType): string => props.theme.white};
	font-size: 16px;
	line-height: 18px;
`

const StyledTextContainer = styled.View`
	display: flex;
	flex-direction: row;
	margin-right: 10px;
`

const StyledView = styled.View`
	width: 100%;
	height: 44px;
	padding-vertical: 13px;
	background-color: ${(props: ThemeType): string => props.theme.white};
	background-color: #b51c08;
	margin-bottom: 20px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`

export const CrisisLineButton: FC = () => {
	return (
		<StyledView>
			<StyledTextContainer>
				<StyledText>Talk to the</StyledText>
				<StyledBoldText>&nbsp;Veterans Crisis Line</StyledBoldText>
				<StyledText>&nbsp;now</StyledText>
			</StyledTextContainer>
			<WhiteArrow width={11} height={26} />
		</StyledView>
	)
}

export default CrisisLineButton
