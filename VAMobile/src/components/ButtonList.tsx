import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import React from 'react'

import _ from 'underscore'

import { i18n_NS } from 'constants/namespaces'
import Box from './Box'
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
		<Box>
			{items.map((item, index) => {
				const { textIDs, a11yHintID, onPress } = item
				const updatedTextIDs = _.isArray(textIDs) ? textIDs : [textIDs]

				updatedTextIDs.forEach((textID, textIDIndex) => {
					updatedTextIDs[textIDIndex] = t(textID)
				})

				return <WideButton key={index} listOfText={updatedTextIDs} a11yHint={t(a11yHintID)} onPress={onPress} isFirst={index === 0} buttonStyle={buttonStyle} />
			})}
		</Box>
	)
}

export default ButtonList
