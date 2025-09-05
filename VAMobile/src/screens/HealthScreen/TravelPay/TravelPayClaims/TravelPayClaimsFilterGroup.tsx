import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Box,
  List,
  ListItemObj,
  TextView,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'
import { Checkbox, Icon } from '@department-of-veterans-affairs/mobile-component-library'
import { FILTER_KEY_ALL } from './TravelPayClaimsFilterModal'

type Option<T> = {
  optionLabelKey: string
  labelArgs?: { [key: string]: string }
  value: T
}

type CheckboxGroupProps = {
  options: Array<Option<string>>
  onChange: (val: string) => void
  listTitle?: string
  selectedValues: Set<String>;
}

const isIntermediate = (value: string, options: Array<Option<string>>, selectedValues: Set<String>) => {
  const somethingOtherThanAll = selectedValues.has(FILTER_KEY_ALL)
    ? selectedValues.size > 1 && selectedValues.size < options.length
    : selectedValues.size > 0

  return value === FILTER_KEY_ALL && somethingOtherThanAll;
}

/**A common component to display radio button selectors for a list of selectable items*/
const TravelClaimsFilterCheckboxGroup = ({
  options,
  onChange,
  listTitle,
  selectedValues,
}: CheckboxGroupProps): ReactElement => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const listItems: Array<ListItemObj> = options.map((option, index) => {
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
            indeterminate={isIntermediate(option.value, options,selectedValues)}
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
      <List items={listItems} title={listTitle}  />
    </Box>
  )
}

export default TravelClaimsFilterCheckboxGroup
