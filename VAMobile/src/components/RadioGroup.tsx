import { isEqual, map } from 'underscore'
import React, { FC, ReactElement } from 'react'

import Box from './Box'
import VASelector, { SelectorType } from './VASelector'

export type radioOption = {
  label: string
  value: { [key: string]: string | number } | string | number
}

/**
 * Signifies props for the component {@link RadioGroup}
 */
export type RadioGroupProps = {
  options: Array<radioOption>
  /* Currently selected option */
  value: { [key: string]: string | number } | string | number
  onChange: (val: { [key: string]: string | number } | string | number) => void
}

const RadioGroup: FC<RadioGroupProps> = ({ options, value, onChange }) => {
  const getRadios = (): ReactElement => {
    const radios = map(options, (option) => {
      const selected = isEqual(option.value, value)
      const onVASelectorChange = (_selected: boolean): void => {
        onChange(option.value)
      }

      return <VASelector selectorType={SelectorType.Radio} selected={selected} onSelectionChange={onVASelectorChange} label={option.label} />
    })

    return <Box>{radios}</Box>
  }

  return getRadios()
}

export default RadioGroup
