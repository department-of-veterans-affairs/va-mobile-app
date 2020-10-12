import React, { FC } from 'react'
import styled from 'styled-components/native'

import { ViewFlexRowSpaceBetween } from 'styles/common'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import VAIcon from './VAIcon'

const StyledText = styled.Text`
	${themeFn((theme) => theme.typography.MobileBody)}
	flex: 1;
`

type StyledViewProps = {
	isFirst: boolean
}

const StyledView = styled(ViewFlexRowSpaceBetween)<StyledViewProps>`
	width: 100%;
	min-height: 44px;
	padding-vertical: 10px;
	padding-horizontal: 20px;
	background-color: ${themeFn((theme) => theme.colors.text.primaryContrast)};
	border-bottom-width: ${themeFn((theme) => theme.dimensions.borderWidth)};
	border-color: ${themeFn((theme) => theme.colors.border)};
	border-style: solid;
	border-top-width: ${themeFn<StyledViewProps>((theme, props) => (props.isFirst ? theme.dimensions.borderWidth : '0px'))};
`

/**
 * Props for WideButton
 */
export type WideButtonProps = {
	/** The title of the button */
	title: string

	/** The ally1 hint text */
	a11yHint: string

	/** onPress callback */
	onPress: () => void

	/** if true, renders without a top border */
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
