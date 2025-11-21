import React, { ReactElement } from 'react'

import { Checkbox } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, ButtonDecoratorType, List, ListItemObj, TextView } from 'components'
import { useTheme } from 'utils/hooks'
import { CheckboxOption, FILTER_KEY_ALL, isChecked, isIndeterminate } from 'utils/travelPay'

type TravelPayClaimsFilterCheckboxGroupProps = {
  options: Array<CheckboxOption>
  onChange: (val: string) => void
  listTitle?: string
  selectedValues: Set<string>
  allLabelText: string
}

const getA11yLabel = (option: CheckboxOption): string =>
  option.value === FILTER_KEY_ALL ? 'Select all' : `${option.optionLabelKey}`

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
    const checked = isChecked(option.value, options, selectedValues)
    return {
      content: (
        <Box flexDirection={'row'} justifyContent={'space-between'} width={'100%'} alignItems="center">
          <TextView
            mr={theme.dimensions.condensedMarginBetween}
            variant="VASelector"
            color="primary"
            testID={`checkbox_label_${option.value}`}>
            {option.optionLabelKey}
          </TextView>
          <Box>
            <Box pointerEvents="none">
              <Checkbox
                label=""
                checked={checked}
                onPress={() => {}} // Outer list item will handle the press
                indeterminate={isIndeterminate(option.value, options, selectedValues)}
                testID={`checkbox_${option.value}`}
              />
            </Box>
          </Box>
        </Box>
      ),
      minHeight: 64,
      backgroundColor: isChecked(option.value, options, selectedValues) ? 'listActive' : undefined,
      onPress: () => onChange(option.value),
      decorator: ButtonDecoratorType.None,
      testId: getA11yLabel(option),
      a11yState: { checked: checked },
      a11yRole: 'checkbox',
    }
  })

  return (
    <Box>
      <List items={listItems} title={listTitle} />
    </Box>
  )
}

export default TravelPayClaimsFilterCheckboxGroup
