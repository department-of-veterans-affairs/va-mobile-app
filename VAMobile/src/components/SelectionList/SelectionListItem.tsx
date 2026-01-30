import React, { FC } from 'react'
import { Pressable } from 'react-native'

import { Icon, IconProps } from '@department-of-veterans-affairs/mobile-component-library'

import Box, { BoxProps } from 'components/Box'
import { useTheme } from 'utils/hooks'

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
    py: theme.dimensions.condensedMarginBetween,
    backgroundColor: isSelected ? 'listActive' : 'list',
  }

  const getIcon = () => {
    let fill = theme.colors.icon.checkboxEnabledPrimary

    if (!isSelected) {
      fill = theme.colors.icon.checkboxDisabled
    }

    const iconProps: IconProps = {
      name: isSelected ? 'CheckBox' : 'CheckBoxOutlineBlank',
      width: 20,
      height: 20,
      fill,
    }

    return <Icon {...iconProps} />
  }

  return (
    <Box {...boxProps}>
      <Pressable
        testID={'selectionListItemButtonId'}
        onPress={setSelectedFn}
        accessibilityState={{ checked: isSelected }}
        accessibilityRole={'checkbox'}>
        <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} alignItems="center">
          <Box flex={1}>{content}</Box>
          {getIcon()}
        </Box>
      </Pressable>
    </Box>
  )
}

export default SelectionListItem
