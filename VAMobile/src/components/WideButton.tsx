import React, { FC } from 'react'
import styled from 'styled-components/native'

import { StyledSourceRegularText, ViewFlexRowSpaceBetween } from 'styles/common'
import { ThemeType } from 'styles/theme'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import VAIcon from './VAIcon'

const StyledText = styled(StyledSourceRegularText)`
	color: ${(props: ThemeType): string => props.theme.textColor};
	font-size: 17px;
	flex: 1;
`

type StyledViewProps = {
	isFirst: boolean
}

const StyledView = styled(ViewFlexRowSpaceBetween)<StyledViewProps & ThemeType>`
	width: 100%;
	min-height: 44px;
	padding-vertical: 10px;
	padding-horizontal: 20px;
	background-color: ${(props: ThemeType): string => props.theme.white};
	border-bottom-width: ${(props: ThemeType): string => props.theme.borderWidth};
	border-color: ${(props: ThemeType): string => props.theme.gray};
	border-style: solid;
	border-top-width: ${(props: ThemeType & StyledViewProps): string => (props.isFirst ? props.theme.borderWidth : '0px')};
`

interface WideButtonProps {
	title: string
	a11yHint: string
	onPress: () => void
	isFirst: boolean
}

/**
 * Reusable component for menu items that take up the full width of the screen that is touchable.
 *
 * @param title - string for header and used to create testID for accessibility
 * @param onPress - function to be called when press occurs
 * @param a11yHint - string for accessibility hint
 * @param isFirst - boolean indicating if the buttons the first in the list
 *
 * @returns WideButton component
 */
const WideButton: FC<WideButtonProps> = ({ title, onPress, a11yHint, isFirst }: WideButtonProps) => {
	const _onPress = (): void => {
		onPress()
	}

	const testId = generateTestID(title, '')

	return (
		<StyledView onPress={_onPress} {...testIdProps(testId)} accessible={true} accessibilityRole={'menuitem'} accessibilityHint={a11yHint} isFirst={isFirst}>
			<StyledText {...testIdProps(testId + '-title')}>{title}</StyledText>
			<VAIcon name={'ArrowRight'} fill="#999999" width={10} height={15} />
		</StyledView>
	)
}

export default WideButton
