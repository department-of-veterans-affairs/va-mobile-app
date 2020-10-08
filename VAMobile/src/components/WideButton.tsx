import { Dimensions } from 'react-native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import GreyArrow from 'images/right-arrow_grey.svg'

import { StyledSourceRegularText, ViewFlexRowSpaceBetween } from 'styles/common'
import { ThemeType } from 'styles/theme'
import { generateTestID, useFontScale } from 'utils/common'
import { testIdProps } from 'utils/accessibility'

const StyledText = styled(StyledSourceRegularText)`
	color: ${(props: ThemeType): string => props.theme.textColor};
	font-size: 17px;
	width: 90%;
`

const StyledView = styled(ViewFlexRowSpaceBetween)`
	width: ${(): string => Dimensions.get('window').width + 'px'};
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

/**
 * Reusable component for menu items that take up the full width of the screen that is touchable.
 *
 * @param title - string for header and used to create testID for accessibility
 * @param onPress - function to be called when press occurs
 * @param a11yHint - string for accessibility hint
 *
 * @returns WideButton component
 */
const WideButton: FC<WideButtonProps> = ({ title, onPress, a11yHint }: WideButtonProps) => {
	const _onPress = (): void => {
		onPress()
	}

	const testId = generateTestID(title, 'wide-button')

	return (
		<StyledView onPress={_onPress} {...testIdProps(testId)} accessible={true} accessibilityRole={'menuitem'} accessibilityHint={a11yHint}>
			<StyledText {...testIdProps(testId + '-title')}>{title}</StyledText>
			<GreyArrow width={useFontScale(10)} height={useFontScale(15)} />
		</StyledView>
	)
}

export default WideButton
