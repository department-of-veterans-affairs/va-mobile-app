import { Pressable } from 'react-native'
import { mapObject, values } from 'underscore'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'
import Box, { BoxProps } from '../Box'
import SelectionListItem, { SelectionListItemObj } from './SelectionListItem'
import TextView from '../TextView'
import VAIcon, { VAIconProps, VA_ICON_MAP } from '../VAIcon'

export type SelectionListProps = {
  /** list of items to show */
  items: Array<SelectionListItemObj>
}

const SelectionList: FC<SelectionListProps> = ({ items }) => {
  const [numSelected, setNumSelected] = useState(0)
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const [selectionVals, setSelectionVals] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const selections = values(selectionVals)

    setNumSelected(selections.filter(Boolean).length)
  }, [selectionVals])

  const updateSelectionValForIdx = (id: string) => {
    const newSelectionVals = { ...selectionVals }
    newSelectionVals[id] = !newSelectionVals[id]
    setSelectionVals(newSelectionVals)
  }

  const listItems = items.map((listObj, index) => {
    const id = index.toString()

    const setSelectedFn = () => {
      updateSelectionValForIdx(id)
    }

    // Add an initial value so the key can be picked up by select all
    if (selectionVals[id] === undefined) {
      selectionVals[id] = false
    }

    // Whether the item is selected is tied to its entry in selectionVals
    const itemProps = {
      content: listObj.content,
      index,
      isSelected: selectionVals[id],
      setSelectedFn,
    }

    return <SelectionListItem {...itemProps} key={index} />
  })

  const onSelectAll = () => {
    let newSelectionVals

    if (numSelected < items.length) {
      newSelectionVals = mapObject(selectionVals, () => {
        return true
      })
    } else {
      newSelectionVals = mapObject(selectionVals, () => {
        return false
      })
    }

    setSelectionVals({ ...newSelectionVals })
  }

  const getSelectAllIcon = () => {
    let name: keyof typeof VA_ICON_MAP
    let fill = 'checkboxEnabledPrimary'
    let stroke = 'checkboxEnabledPrimary'

    if (numSelected === items.length) {
      name = 'FilledCheckBox'
    } else if (numSelected > 0) {
      name = 'IntermediateCheckBox'
    } else {
      name = 'EmptyCheckBox'
      fill = 'checkboxDisabledContrast'
      stroke = 'checkboxDisabled'
    }

    const iconProps: VAIconProps = {
      name,
      width: 20,
      height: 20,
      stroke,
      fill,
      ml: 20,
    }

    return <VAIcon {...iconProps} />
  }

  const headerWrapperProps: BoxProps = {
    borderTopWidth: theme.dimensions.borderWidth,
    borderBottomWidth: theme.dimensions.borderWidth,
    borderColor: 'primary',
    borderStyle: 'solid',
    px: theme.dimensions.gutter,
    py: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'list',
  }

  return (
    <Box>
      <Box {...headerWrapperProps}>
        <TextView>{t('selected', { selected: numSelected, total: items.length })}</TextView>
        <Pressable onPress={onSelectAll} accessibilityState={{ checked: numSelected > 0 }} accessibilityRole={'checkbox'}>
          <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <TextView>{t('select.all')}</TextView>
            {getSelectAllIcon()}
          </Box>
        </Pressable>
      </Box>
      <Box>{listItems}</Box>
    </Box>
  )
}

export default SelectionList
