import React, { ReactElement } from 'react'

import { Checkbox } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, List, ListItemObj, TextView } from 'components'
import { useTheme } from 'utils/hooks'

export const FILTER_KEY_ALL = 'all'

export type CheckboxOption = {
  optionLabelKey: string
  value: string
}

export const isChecked = (value: string, options: Array<CheckboxOption>, selectedValues: Set<string>) => {
  if (value === FILTER_KEY_ALL) {
    const allOptions = new Set(options.map((option) => option.value))
    return selectedValues.size === allOptions.size
  }

  return selectedValues.has(value)
}

export const isIndeterminate = (value: string, options: Array<CheckboxOption>, selectedValues: Set<string>) => {
  if (value === FILTER_KEY_ALL) {
    const allOptions = new Set(options.map((option) => option.value))
    const somethingOtherThanAll = selectedValues.size > 0 && selectedValues.size < allOptions.size
    return somethingOtherThanAll
  }

  return false
}

type TravelPayClaimsFilterCheckboxGroupProps = {
  options: Array<CheckboxOption> // TODO: sc - can we reuse this from elsewhere?
  onChange: (val: string) => void
  listTitle?: string
  selectedValues: Set<string>
  allLabelText: string
}

/**A common component to display radio button selectors for a list of selectable items*/
const TravelPayClaimsFilterCheckboxGroup = ({
  options,
  onChange,
  listTitle,
  selectedValues,
  allLabelText,
}: TravelPayClaimsFilterCheckboxGroupProps): ReactElement => {
  const theme = useTheme()

  // Always add "All" option
  const optionsWithAll = [
    {
      optionLabelKey: allLabelText,
      value: FILTER_KEY_ALL,
    },
    ...options,
  ]

  const listItems: Array<ListItemObj> = optionsWithAll.map((option) => {
    return {
      content: (
        <Box flexDirection={'row'} flexGrow={1} alignItems="center">
          <TextView
            mr={theme.dimensions.condensedMarginBetween}
            flex={7}
            variant="VASelector"
            color="primary"
            testID={`checkbox_label_${option.value}`}>
            {option.optionLabelKey}
          </TextView>
          <Box>
            <Checkbox
              label=""
              checked={isChecked(option.value, options, selectedValues)}
              onPress={() => onChange(option.value)}
              indeterminate={isIndeterminate(option.value, options, selectedValues)}
              testID={`checkbox_${option.value}`}
            />
          </Box>
        </Box>
      ),
      minHeight: 64,
      backgroundColor: isChecked(option.value, options, selectedValues) ? 'listActive' : undefined,
      onPress: () => onChange(option.value),
    }
  })

  return (
    <Box>
      <List items={listItems} title={listTitle} />
    </Box>
  )
}

export default TravelPayClaimsFilterCheckboxGroup
