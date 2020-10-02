import React, { FC } from 'react'
import styled from 'styled-components/native'

import { StyledSourceBoldText, StyledSourceRegularText } from 'styles/common'
import { ThemeType } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'
import WhiteArrow from 'images/right-arrow_white.svg'

const StyledText = styled(StyledSourceRegularText)`
	color: ${(props: ThemeType): string => props.theme.white};
	font-size: 16px;
`

const StyledBoldText = styled(StyledSourceBoldText)`
	color: ${(props: ThemeType): string => props.theme.white};
	font-size: 16px;
`

const StyledTextContainer = styled.View`
	display: flex;
	flex-direction: row;
	margin-right: 7px;
`

const StyledView = styled.View`
	width: 100%;
	min-height: 44px;
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
		<StyledView {...testIdProps('crisis-line-button')} accessibilityRole={'button'} accessible={true} accessibilityHint={'Go to Veterans Crisis Line'}>
			<StyledTextContainer>
				<StyledText>
					Talk to the
					<StyledBoldText>&nbsp;Veterans Crisis Line</StyledBoldText>
					<StyledText>&nbsp;now</StyledText>
				</StyledText>
			</StyledTextContainer>
			<WhiteArrow width={11} height={16} />
		</StyledView>
	)
}

export default CrisisLineButton
