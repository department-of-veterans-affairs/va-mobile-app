import { View } from 'react-native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { ViewFlexRowSpaceBetween } from 'styles/common'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
import { themeFn } from 'utils/theme'
import SwitchComponent, { SwitchProps } from './Switch'
import TextView, { FontVariant } from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

const StyledView = styled(ViewFlexRowSpaceBetween)`
	width: 100%;
	min-height: 44px;
	padding-vertical: 10px;
	padding-horizontal: 20px;
	border-bottom-width: ${themeFn((theme) => theme.dimensions.borderWidth)};
	border-color: ${themeFn((theme) => theme.colors.border.primary)};
	border-style: solid;
`

/** Decorator type for the button, defaults to Navigation (right arrow) */
export enum ButtonDecoratorType {
	/** Switch button decorator */
	Switch = 'Switch',
	/** Navigation arrow decorator */
	Navigation = 'Navigation',
}

export type WideButtonDecoratorProps = Partial<VAIconProps> | Partial<SwitchProps>

/**
 * Props for WideButton
 */
export type WideButtonProps = {
	/** List of text for the button */
	listOfText?: Array<string>

	/** optional test id string, if not supplied will generate one from first line of text */
	testId?: string

	/** The ally1 hint text */
	a11yHint: string

	/** onPress callback */
	onPress: () => void

	/** Decorator Type to use */
	decorator?: ButtonDecoratorType

	/** Optional props to be passed to the decorator */
	decoratorProps?: WideButtonDecoratorProps

	/** Optional child elements to use insetead of listOfText if you need to do special styling */
	children?: React.ReactNode
}

const ButtonDecorator: FC<{ decorator?: ButtonDecoratorType; decoratorProps?: WideButtonDecoratorProps; onPress: () => void }> = ({ decorator, decoratorProps, onPress }) => {
	switch (decorator) {
		case ButtonDecoratorType.Switch:
			return <SwitchComponent onPress={onPress} {...decoratorProps} />
		default:
			return <VAIcon name={'ArrowRight'} fill="#999999" width={10} height={15} {...decoratorProps} />
	}
}

/**
 * Reusable component for menu items that take up the full width of the screen that is touchable.
 * @returns WideButton component
 */
const WideButton: FC<WideButtonProps> = (props) => {
	const { listOfText, onPress, a11yHint, decorator, decoratorProps, testId, children } = props

	// when multiline the first line is always bold
	const isMultiline = (listOfText?.length || 0) > 1

	const isSwitchRow = decorator === ButtonDecoratorType.Switch
	const viewTestId = testId ? testId : generateTestID(listOfText ? listOfText.join(' ') : '', '')

	const onOuterPress = (): void => {
		if (isSwitchRow) {
			return // nooop for switch types, need to press on the switch specifically
		}
		onPress()
	}

	const onDecoratorPress = (): void => {
		// if we're a switch type, need to handle the press on the decorator specifically
		if (isSwitchRow) {
			onPress()
		}
	}

	return (
		<StyledView disabled={isSwitchRow} onPress={onOuterPress} {...testIdProps(viewTestId)} accessible={true} accessibilityRole={'menuitem'} {...a11yHintProp(a11yHint)}>
			<View>
				{listOfText?.map((text, index) => {
					const variant: FontVariant | undefined = isMultiline && index === 0 ? 'MobileBodyBold' : undefined
					return (
						<TextView variant={variant} {...testIdProps(text + '-title')} key={index}>
							{text}
						</TextView>
					)
				})}
				{children}
			</View>
			<ButtonDecorator decorator={decorator} onPress={onDecoratorPress} decoratorProps={decoratorProps} />
		</StyledView>
	)
}

export default WideButton
