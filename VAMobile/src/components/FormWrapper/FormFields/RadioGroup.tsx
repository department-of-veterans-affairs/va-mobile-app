import { isEqual, map } from 'underscore'
import React, { ReactElement, useEffect } from 'react'

import { Box, ButtonDecoratorType, DefaultList, DefaultListItemObj, SelectorType, TextLine, TextView, VASelector } from '../../index'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme, useTranslation } from 'utils/hooks'

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
  /** Zero based array of options. An option is an object with both a value which is the relevant data, and a label which is displayed as a string to represent the value. */
  options: Array<radioOption<T>>
  /** Currently selected option. An initial value can be used or this can be left undefined which will have nothing initially selected.  */
  value?: T
  /** Call back function that passes the newly selected option's value as an argument to.*/
  onChange: (val: T) => void
  /** optional boolean that disables the radio group when set to true */
  disabled?: boolean
  /** optional boolean to indicate to use the radio buttons in a list */
  isRadioList?: boolean
  /** optional text to show as the radio list title */
  radioListTitle?: string
}

/**A common component to display radio button selectors for a list of selectable items*/
const RadioGroup = <T,>({ options, value, onChange, disabled = false, isRadioList, radioListTitle }: RadioGroupProps<T>): ReactElement => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const hasSingleOption = options.length === 1

  useEffect(() => {
    // Auto select the first option if there is only one option
    if (hasSingleOption && !value) {
      onChange(options[0].value)
    }
  }, [hasSingleOption, value, options, onChange])

  const getOption = (option: radioOption<T>): ReactElement => {
    const { labelKey, labelArgs } = option

    // Render option as simple text
    if (hasSingleOption) {
      return (
        <TextView variant="VASelector" color="primary">
          {t(labelKey, labelArgs)}
        </TextView>
      )
    }

    const selected = isEqual(option.value, value)
    const onVASelectorChange = (_selected: boolean): void => {
      onChange(option.value)
    }

    return <VASelector selectorType={SelectorType.Radio} selected={selected} onSelectionChange={onVASelectorChange} labelKey={labelKey} labelArgs={labelArgs} disabled={disabled} />
  }

  /** creates the radio group with an optiona title and the radio button on the left side */
  const getStandardRadioGroup = () => {
    return map(options, (option, index) => {
      const { headerText } = option
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
            {getOption(option)}
          </Box>
        </Box>
      )
    })
  }

  /** creates the radio group with a optional title and the radio buttons in a list with the radio button ot the far right */
  const getRadioGroupList = () => {
    const listItems: Array<DefaultListItemObj> = options.map((option) => {
      const selected = isEqual(option.value, value)
      const onSelectorChange = (): void => {
        if (!disabled) {
          onChange(option.value)
        }
      }
      const textLines: Array<TextLine> = [{ text: option.labelKey, variant: 'VASelector', color: disabled ? 'checkboxDisabled' : 'primary' }]

      const radioButton: DefaultListItemObj = {
        textLines,
        decorator: disabled ? ButtonDecoratorType.DisabledRadio : selected ? ButtonDecoratorType.FilledRadio : ButtonDecoratorType.EmptyRadio,
        onPress: onSelectorChange,
      }

      return radioButton
    })
    return (
      <Box>
        <DefaultList items={listItems} title={radioListTitle} />
      </Box>
    )
  }

  const getRadios = (): ReactElement => {
    return <Box>{isRadioList ? getRadioGroupList() : getStandardRadioGroup()}</Box>
  }

  return getRadios()
}

export default RadioGroup
