import { FC } from 'react'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import React from 'react'

import WideButton from './WideButton'

/**
 * Signifies each item in the list of items in {@link ButtonListProps}
 * textID: translation ID of the text to display
 * a11yHintID: translation ID of a buttons accessibility hint
 * onPress: the function called on press of the button
 */
export type ButtonListItemObj = {
	textID: string
	a11yHintID: string
	onPress: () => void
}

/**
 * Signifies the props that need to be passed in to {@link ButtonList}
 * items - list of items of which a button will be rendered per item
 * translationNameSpace - the translation namespace of the given text
 */
export type ButtonListProps = {
	items: Array<ButtonListItemObj>
	translationNameSpace: string
}

const ButtonList: FC<ButtonListProps> = ({ items, translationNameSpace }) => {
	const { t } = useTranslation(translationNameSpace)

	return (
		<ScrollView>
			{items.map((item, index) => {
				const { textID, a11yHintID, onPress } = item

				return <WideButton key={index} title={t(textID)} a11yHint={t(a11yHintID)} onPress={onPress} isFirst={index === 0} />
			})}
		</ScrollView>
	)
}

export default ButtonList
