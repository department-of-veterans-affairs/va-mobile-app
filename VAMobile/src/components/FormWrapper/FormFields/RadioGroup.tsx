import { isEqual, map } from 'underscore'
import React, { ReactElement } from 'react'

import { Box, SelectorType, TextView, VASelector } from '../../index'
import { useTheme } from 'utils/hooks'

export type radioOption<T> = {
  /** translated labelKey displayed next to the checkbox/radio */
  labelKey: string
  /** optional arguments to pass in with the labelKey during translation */
  labelArgs?: { [key: string]: string }
  /** value of the radio button */
  value: T
  /** string for the header if one needed */
  headerText?: string
}

/**
 * Signifies props for the component {@link RadioGroup}
 */
export type RadioGroupProps<T> = {
  /* Zero based array of options. An option is an object with both a value which is the relevant data, and a label which is displayed as a string to represent the value. */
  options: Array<radioOption<T>>
  /* Currently selected option. An initial value can be used or this can be left undefined which will have nothing initially selected.  */
  value?: T
  /* Call back function that passes the newly selected option's value as an argument to.*/
  onChange: (val: T) => void
  /** optional boolean that disables the radio group when set to true */
  disabled?: boolean
}

const RadioGroup = <T,>({ options, value, onChange, disabled = false }: RadioGroupProps<T>): ReactElement => {
  const theme = useTheme()

  const getRadios = (): ReactElement => {
    const radios = map(options, (option, index) => {
      const selected = isEqual(option.value, value)
      const onVASelectorChange = (_selected: boolean): void => {
        onChange(option.value)
      }
      const { labelKey, labelArgs, headerText } = option
      return (
        <Box key={index}>
          {headerText && (
            <Box>
              <TextView color="primary" variant="MobileBodyBold" accessibilityRole="header">
                {headerText}
              </TextView>
            </Box>
          )}
          <Box mb={theme.dimensions.standardMarginBetween} key={index} mt={headerText ? theme.dimensions.contentMarginTop : 0}>
            <VASelector
              selectorType={SelectorType.Radio}
              selected={selected}
              onSelectionChange={onVASelectorChange}
              labelKey={labelKey}
              labelArgs={labelArgs}
              disabled={disabled}
            />
          </Box>
        </Box>
      )
    })

    return <Box>{radios}</Box>
  }

  return getRadios()
}

export default RadioGroup
