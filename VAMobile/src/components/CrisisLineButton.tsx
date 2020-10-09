import React, { FC } from 'react'
import styled from 'styled-components/native'

import { StyledSourceBoldText, StyledSourceRegularText } from 'styles/common'
import { ThemeType } from 'styles/theme'
import { testIdProps } from 'utils/accessibility'
import { useFontScale } from 'utils/common'
import { useTranslation } from 'react-i18next'
import WhiteArrow from 'images/right-arrow_white.svg'

const StyledText = styled(StyledSourceRegularText)`
	color: ${(props: ThemeType): string => props.theme.white};
	font-size: 17px;
`

const StyledBoldText = styled(StyledSourceBoldText)`
	color: ${(props: ThemeType): string => props.theme.white};
	font-size: 17px;
`

const StyledTextContainer = styled.View`
	display: flex;
	flex-direction: row;
	margin-right: 4px;
`

const StyledView = styled.View`
	width: 100%;
	min-height: 44px;
	padding-vertical: 12px;
	padding-horizontal: 10px;
	background-color: #b51c08;
	margin-bottom: 20px;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`

/**
 * CrisisLineButton that shows up on the HomeScreen' and 'Contact VA' option on HomeScreen
 *
 * @returns CrisisLineButton component
 */
const CrisisLineButton: FC = () => {
	const { t } = useTranslation()
	const fs = useFontScale()

	return (
		<StyledView {...testIdProps('crisis-line-button')} accessibilityRole={'button'} accessible={true} accessibilityHint={t('home:component.crisisLine.hint')}>
			<StyledTextContainer>
				<StyledText>
					{t('home:component.crisisLine.talkToThe')}
					<StyledBoldText>&nbsp;{t('home:component.crisisLine.veteranCrisisLine')}</StyledBoldText>
					<StyledText>&nbsp;{t('home:component.crisisLine.now')}</StyledText>
				</StyledText>
			</StyledTextContainer>
			<WhiteArrow width={fs(10)} height={fs(15)} />
		</StyledView>
	)
}

export default CrisisLineButton
