import { Pressable } from 'react-native'
import React, { FC } from 'react'

import { useTheme } from 'utils/hooks'
import Box, { BoxProps } from '../Box'
import VAIcon, { VAIconProps, VA_ICON_MAP } from '../VAIcon'

export type SelectionListItemObj = {
  /** Display content for the list item */
  content: React.ReactNode
}

export type SelectionListItemProps = {
  /** Function to override the selected value of the item */
  setSelectedFn: () => void
  /** Whether the item is selected */
  isSelected: boolean
} & Partial<SelectionListItemObj>

const SelectionListItem: FC<SelectionListItemProps> = ({ content, setSelectedFn, isSelected }) => {
  const theme = useTheme()

  const boxProps: BoxProps = {
    borderBottomWidth: theme.dimensions.borderWidth,
    borderColor: 'primary',
    borderStyle: 'solid',
    px: theme.dimensions.gutter,
    py: 16,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'list',
  }

  const getIcon = () => {
    let name: keyof typeof VA_ICON_MAP
    let fill = 'checkboxDisabled'

    if (isSelected) {
      name = 'FilledCheckBox'
    } else {
      name = 'EmptyCheckBox'
      fill = 'checkboxDisabledContrast'
    }

    const iconProps: VAIconProps = {
      name,
      width: 20,
      height: 20,
      stroke: 'checkboxDisabled',
      fill,
      ml: 20,
      pt: 5,
    }

    return <VAIcon {...iconProps} />
  }

  return (
    <Box {...boxProps}>
      <Box flex={1}>{content}</Box>
      <Box>
        <Pressable onPress={setSelectedFn} accessibilityState={{ checked: isSelected }} accessibilityRole={'checkbox'}>
          {getIcon()}
        </Pressable>
      </Box>
    </Box>
  )
}

export default SelectionListItem
