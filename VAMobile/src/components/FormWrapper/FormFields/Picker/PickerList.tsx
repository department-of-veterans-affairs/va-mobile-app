import React, { FC } from 'react'

import { ButtonDecoratorType, List, ListItemObj, VAIconProps } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { TextLine } from 'components/types'
import { TextLineWithIconProps } from 'components/TextLineWithIcon'
import { TextLines } from 'components/TextLines'
import { useTranslation } from 'utils/hooks'

/**
 * Signifies each item in the list of items in {@link PickerListProps}
 */
export type PickerListItemObj = {
  /** lines of text to display */
  text: string
  /** whether this item is the selected value **/
  isSelected: boolean
  /** icon to show */
  icon?: VAIconProps
} & Partial<ListItemObj>

/**
 * Props for {@link PickerList}
 */
export type PickerListProps = {
  /** list of items of which a button will be rendered per item */
  items: Array<PickerListItemObj>
  /** optional title to use for the list */
  title?: string
  /**optional a11y hint for the title */
  titleA11yLabel?: string
}

/**
 * Display a list of buttons with text and optional actions
 */
const PickerList: FC<PickerListProps> = ({ items, title, titleA11yLabel }) => {
  const t = useTranslation(NAMESPACE.COMMON)

  const listItemObjs: Array<ListItemObj> = items.map((item: PickerListItemObj, index) => {
    // Move all of the properties except text lines to the standard list item object
    const { text, icon, testId, isSelected, ...listItemObj } = item

    const textLine = icon ? [{ text, iconProps: icon, color: icon.fill } as TextLineWithIconProps] : [{ text } as TextLine]
    const content = <TextLines listOfText={textLine} />

    const backgroundColor = isSelected ? 'pickerSelectedItem' : 'list'
    const decorator = isSelected ? ButtonDecoratorType.SelectedItem : ButtonDecoratorType.None

    const defaultTestId = text ? text : t('picker.noSelection')
    const testIdToUse = testId ? testId : defaultTestId

    const a11yValue = t('listPosition', { position: index + 1, total: items.length })
    const a11yState = {
      selected: isSelected,
    }

    return { ...listItemObj, content, backgroundColor, decorator, testId: testIdToUse, a11yValue, a11yRole: 'menuitem', a11yState }
  })

  return <List items={listItemObjs} title={title} titleA11yLabel={titleA11yLabel} />
}

export default PickerList
