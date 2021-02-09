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
  options: Array<radioOption>
  /* Currently selected option */
  value: RadioValueType
  onChange: (val: RadioValueType) => void
}

const RadioGroup: FC<RadioGroupProps> = ({ options, value, onChange }) => {
  const theme = useTheme()

  const getRadios = (): ReactElement => {
    const radios = map(options, (option) => {
      const selected = isEqual(option.value, value)
      const onVASelectorChange = (_selected: boolean): void => {
        onChange(option.value)
      }

      return (
        <Box mb={theme.dimensions.marginBetween}>
          <VASelector selectorType={SelectorType.Radio} selected={selected} onSelectionChange={onVASelectorChange} label={option.label} />
        </Box>
      )
    })

    return <Box>{radios}</Box>
  }

  return getRadios()
}

export default RadioGroup
