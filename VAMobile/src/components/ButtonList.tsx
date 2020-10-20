import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import React from 'react'
import _ from 'underscore'
import styled from 'styled-components/native'

import { i18n_NS } from 'constants/namespaces'
import { themeFn } from 'utils/theme'
import Box from './Box'
import WideButton, { WideButtonProps } from './WideButton'

// TODO this goes away when we can put a border on Box
const BorderedView = styled.View`
	border-top-width: 1px;
	border-style: solid;
	border-color: ${themeFn((theme) => theme.colors.border.primary)};
`

/**
 * Signifies each item in the list of items in {@link ButtonListProps}
 */
export type ButtonListItemObj = {
	/** translation IDs of all text to display */
	textIDs: Array<string> | string

	/** translation ID of a buttons accessibility hint */
	a11yHintID: string

	/** on press event */
	onPress?: () => void
} & Partial<WideButtonProps>

/**
 * Props for {@link ButtonList}
 */
export type ButtonListProps = {
	/** list of items of which a button will be rendered per item */
	items: Array<ButtonListItemObj>

	/** the translation namespace of the given text */
	translationNameSpace?: i18n_NS
}

const ButtonList: FC<ButtonListProps> = ({ items, translationNameSpace }) => {
	const { t } = useTranslation(translationNameSpace)
	return (
		<BorderedView>
			<Box backgroundColor={'buttonList'}>
				{items.map((item, index) => {
					const { textIDs, a11yHintID } = item
					const updatedTextIDs = _.isArray(textIDs) ? textIDs : [textIDs]

					updatedTextIDs.forEach((textID, textIDIndex) => {
						updatedTextIDs[textIDIndex] = t(textID)
					})

					return <WideButton key={index} listOfText={updatedTextIDs} a11yHint={t(a11yHintID)} {...item} />
				})}
			</Box>
		</BorderedView>
	)
}

export default ButtonList
