import { AccessibilityProps, Linking, TouchableWithoutFeedback } from 'react-native'
import Box from './Box'
import React, { FC } from 'react'

import { testIdProps } from 'utils/accessibility'
import TextView, { TextViewProps } from './TextView'
import VAIcon, { VA_ICON_MAP } from './VAIcon'

type LinkTypeOptions = 'text' | 'call' | 'url'

/**
 *  Signifies the props that need to be passed in to {@link ClickForActionLink}
 */
export type LinkButtonProps = AccessibilityProps & {
	/** phone number used for link */
	text: string

	/** string signifying the type of link it is (click to call/text/go to website) */
	linkType: LinkTypeOptions
}

/**
 * Reusable component used for opening native phone app
 */
const ClickForActionLink: FC<LinkButtonProps> = ({ text, linkType, ...props }) => {
	const _onPress = (): void => {
		// 888-123-1231 -> 8881231231
		const number = text.replace(/-/g, '')

		let openUrlText = text
		if (linkType === 'call') {
			openUrlText = `tel:${number}`
		} else if (linkType === 'text') {
			openUrlText = `sms:${number}`
		}

		// ex. numbers: tel:${phoneNumber}, sms:${phoneNumber}
		// ex. url: https://google.com (need https for url)
		Linking.openURL(openUrlText)
	}

	const getIconName = (): keyof typeof VA_ICON_MAP => {
		switch (linkType) {
			case 'call':
				return 'Phone'
			case 'text':
				return 'Text'
			case 'url':
				return 'Chat'
		}
	}

	const textViewProps: TextViewProps = {
		color: 'link',
		variant: 'MobileBody',
		ml: 4,
		textDecoration: 'underline',
		textDecorationColor: 'link',
	}

	return (
		<TouchableWithoutFeedback onPress={_onPress} {...testIdProps(text)} accessibilityRole="link" accessible={true} {...props}>
			<Box flexDirection={'row'} mt={8} mb={8} alignItems={'center'}>
				<VAIcon name={getIconName()} fill={'link'} />
				<TextView {...textViewProps}>{text}</TextView>
			</Box>
		</TouchableWithoutFeedback>
	)
}

export default ClickForActionLink
