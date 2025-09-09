import React, { ReactElement } from 'react'

import { Checkbox } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, List, ListItemObj, TextView } from 'components'
import { FILTER_KEY_ALL } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilterModal'
import { useTheme } from 'utils/hooks'

type Option<T> = {
  optionLabelKey: string
  labelArgs?: { [key: string]: string }
  value: T
}

type TravelPayClaimsFilterCheckboxGroupProps = {
  options: Array<Option<string>>
  onChange: (val: string) => void
  listTitle?: string
  selectedValues: Set<string>
}

const isIntermediate = (value: string, options: Array<Option<string>>, selectedValues: Set<string>) => {
  const somethingOtherThanAll = !selectedValues.has(FILTER_KEY_ALL) && selectedValues.size > 0
  return value === FILTER_KEY_ALL && somethingOtherThanAll
}

/**A common component to display radio button selectors for a list of selectable items*/
const TravelPayClaimsFilterCheckboxGroup = ({
  options,
  onChange,
  listTitle,
  selectedValues,
}: TravelPayClaimsFilterCheckboxGroupProps): ReactElement => {
  const theme = useTheme()

  const listItems: Array<ListItemObj> = options.map((option) => {
    return {
      content: (
        <Box flexDirection={'row'} flexGrow={1} alignItems="center">
          <TextView
            mr={theme.dimensions.condensedMarginBetween}
            flex={7}
            variant="VASelector"
            color={theme.colors.text.primary}>
            {option.optionLabelKey}
          </TextView>
          <Box>
            <Checkbox
              label=""
              checked={selectedValues?.has(option.value)}
              onPress={() => onChange(option.value)}
              indeterminate={isIntermediate(option.value, options, selectedValues)}
            />
          </Box>
        </Box>
      ),
      minHeight: 64,
      backgroundColor: selectedValues?.has(option.value) ? 'listActive' : undefined,
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
