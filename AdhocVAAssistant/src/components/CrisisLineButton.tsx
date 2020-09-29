import React, { FC } from 'react'
import styled from 'styled-components/native'

import { StyledSourceBoldText, StyledSourceRegularText, ViewFlexRowSpaceBetween } from 'styles/common'
import { ThemeType } from 'styles/theme'

const StyledText = styled(StyledSourceRegularText)`
	color: #ffffff;
	font-size: 16px;
	line-height: 18px;
`

const StyledBoldText = styled(StyledSourceBoldText)`
	color: #ffffff;
	font-size: 16px;
	line-height: 18px;
`

const StyledTextContainer = styled.View`
	display: flex;
	flex-direction: row;
`

const StyledView = styled(ViewFlexRowSpaceBetween)`
	width: 100%;
	height: 44px;
	padding-vertical: 10px;
	padding-horizontal: 10px;
	background-color: ${(props: ThemeType): string => props.theme.white};
	border-bottom-width: 2px;
	border-color: ${(props: ThemeType): string => props.theme.gray};
	border-style: solid;
	background-color: #b51c08;
	margin-bottom: 20px;
`

export const CrisisLineButton: FC = () => {
	return (
		<StyledView>
			<StyledTextContainer>
				<StyledText>Talk to the</StyledText>
				<StyledBoldText>&nbsp;Veterans Crisis Line</StyledBoldText>
				<StyledText>&nbsp;now</StyledText>
			</StyledTextContainer>

			<StyledText>{'>'}</StyledText>
		</StyledView>
	)
}

export default CrisisLineButton
