import { isEqual, map } from 'underscore'
import React, { FC, ReactElement } from 'react'

import { useTheme } from 'utils/hooks'
import Box from './Box'
import VASelector, { SelectorType } from './VASelector'

export type RadioValueType = { [key: string]: string | number } | string | number

export type radioOption = {
  label: string
  value: RadioValueType
}

/**
 * Signifies props for the component {@link RadioGroup}
 */
export type RadioGroupProps = {
  /* Zero based array of options. An option is an object with both a value which is the relevant data, and a label which is displayed as a string to represent the value. */
  options: Array<radioOption>
  /* Currently selected option. An initial value can be used or this can be left undefined which will have nothing initially selected.  */
  value?: RadioValueType
  /* Call back function that passes the newly selected option's value as an argument to.*/
  onChange: (val: RadioValueType) => void
}

const RadioGroup: FC<RadioGroupProps> = ({ options, value, onChange }) => {
  const theme = useTheme()

  const getRadios = (): ReactElement => {
    const radios = map(options, (option, index) => {
      const selected = isEqual(option.value, value)
      const onVASelectorChange = (_selected: boolean): void => {
        onChange(option.value)
      }

      return (
        <Box mb={theme.dimensions.marginBetween} key={index}>
          <VASelector selectorType={SelectorType.Radio} selected={selected} onSelectionChange={onVASelectorChange} label={option.label} />
        </Box>
      )
    })

    return <Box>{radios}</Box>
  }

  return getRadios()
}

export default RadioGroup
