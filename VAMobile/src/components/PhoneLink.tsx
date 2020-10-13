import { AccessibilityProps, Linking, TouchableWithoutFeedback } from 'react-native'
import Box from './Box'
import React, { FC } from 'react'

import { testIdProps } from 'utils/accessibility'
import TextView, { TextViewProps } from './TextView'
import VAIcon from './VAIcon'

/**
 *  Signifies the props that need to be passed in to {@link PhoneLink}
 */
export type LinkButtonProps = AccessibilityProps & {
	/** phone number used for link */
	text: string
}

/**
 * Reusable component used for opening native phone app
 */
const PhoneLink: FC<LinkButtonProps> = ({ text, accessibilityHint }: LinkButtonProps) => {
	const _onPress = (): void => {
		// 888-123-1231 -> 8881231231
		const _url = text.replace(/-/g, '')

		//ex. tel:${phoneNumber}
		Linking.openURL(`tel:${_url}`)
	}

	const textViewProps: TextViewProps = {
		color: 'link',
		variant: 'MobileBody',
		ml: 4,
		textDecoration: 'underline',
		textDecorationColor: 'link',
	}

	return (
		<TouchableWithoutFeedback onPress={_onPress} {...testIdProps(text)} accessibilityRole="link" accessible={true} accessibilityHint={`${accessibilityHint}`}>
			<Box flexDirection={'row'} mt={8} mb={8} alignItems={'center'} backgroundColor={'textBox'}>
				<VAIcon name={'Phone'} fill={'#0071BC'} />
				<TextView {...textViewProps}>{text}</TextView>
			</Box>
		</TouchableWithoutFeedback>
	)
}

export default PhoneLink
