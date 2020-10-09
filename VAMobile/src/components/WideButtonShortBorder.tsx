import React, { FC } from 'react'
import styled from 'styled-components/native'

import GreyArrow from 'images/right-arrow_grey.svg'

import { StyledSourceRegularText } from 'styles/common'
import { ThemeType } from 'styles/theme'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'

const StyledText = styled(StyledSourceRegularText)`
	color: ${(props: ThemeType): string => props.theme.textColor};
	font-size: 17px;
	line-height: 26px;
`

type StyledViewProps = {
	isFirst: boolean
}

const StyledView = styled.TouchableOpacity<StyledViewProps & ThemeType>`
	width: 100%;
	min-height: 44px;
	padding-vertical: 12px;
	background-color: ${(props: ThemeType): string => props.theme.white};
	border-color: ${(props: ThemeType): string => props.theme.gray};
	border-style: solid;
	border-top-width: ${(props: StyledViewProps): string => (props.isFirst ? '1px' : '0px')};
	position: relative;
`

const StyledBorder = styled.View`
	position: absolute;
	border-bottom-width: 1px;
	border-color: ${(props: ThemeType): string => props.theme.gray};
	border-style: solid;
	bottom: 0;
	right: 0;
	left: 20px;
	width: 100%;
	text-align: left;
`

const StyledContentView = styled.View`
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	align-items: center;
	padding-horizontal: 20px;
`

/**
 *  Signifies the props that need to be passed in to {@link WideButtonShortBorder}
 *  title - string signifying the title of the button and the value used for the testID
 *  a11yHint - string signifying the a11y hint given to the button
 *  onPress - function called when the button is clicked
 *  isFirst - boolean indicating if the button is the first in the list of buttons
 */
export type WideButtonShortBorderProps = {
	title: string
	a11yHint: string
	onPress: () => void
	isFirst?: boolean
}

const WideButtonShortBorder: FC<WideButtonShortBorderProps> = ({ title, onPress, a11yHint, isFirst = false }: WideButtonShortBorderProps) => {
	const _onPress = (): void => {
		onPress()
	}

	const testId = generateTestID(title, '')

	return (
		<StyledView onPress={_onPress} {...testIdProps(testId)} accessible={true} accessibilityRole={'menuitem'} accessibilityHint={a11yHint} isFirst={isFirst}>
			<StyledContentView>
				<StyledText>{title}</StyledText>
				<GreyArrow width={11} height={16} />
			</StyledContentView>
			<StyledBorder />
		</StyledView>
	)
}

export default WideButtonShortBorder
