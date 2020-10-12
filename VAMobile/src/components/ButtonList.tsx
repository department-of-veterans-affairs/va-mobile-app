import { FC } from 'react'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import React from 'react'

import _ from 'underscore'

import { i18n_NS } from 'constants/namespaces'
import WideButton from './WideButton'

/**
 * Signifies the style flags for the button list
 */
export enum ButtonListStyle {
	BoldHeader,
}

/**
 * Signifies each item in the list of items in {@link ButtonListProps}
 */
export type ButtonListItemObj = {
	/** translation IDs of all text to display */
	textIDs: Array<string> | string

	/** translation ID of a buttons accessibility hint */
	a11yHintID: string

	/** the function called on press of the button */
	onPress: () => void
}

/**
 * Props for {@link ButtonList}
 */
export type ButtonListProps = {
	/** list of items of which a button will be rendered per item */
	items: Array<ButtonListItemObj>

	/** the translation namespace of the given text */
	translationNameSpace: i18n_NS

	/** if BoldHeader, should make the first text bold */
	buttonStyle?: ButtonListStyle
}

const ButtonList: FC<ButtonListProps> = ({ items, translationNameSpace, buttonStyle }) => {
	const { t } = useTranslation(translationNameSpace)

	return (
		<ScrollView>
			{items.map((item, index) => {
				const { textIDs, a11yHintID, onPress } = item

				let translatedText
				if (_.isArray(textIDs)) {
					textIDs.forEach((textID, textIDIndex) => {
						textIDs[textIDIndex] = t(textID)
					})

					translatedText = textIDs
				} else {
					translatedText = t(textIDs)
				}

				return <WideButton key={index} listOfText={translatedText} a11yHint={t(a11yHintID)} onPress={onPress} isFirst={index === 0} buttonStyle={buttonStyle} />
			})}
		</ScrollView>
	)
}

export default ButtonList
