import { AccessibilityInfo } from 'react-native'
import { isEqual, map } from 'underscore'
import { useTranslation } from 'react-i18next'
import React, { ReactElement, useEffect } from 'react'

import { Box, ButtonDecoratorType, DefaultList, DefaultListItemObj, SelectorType, TextLine, TextView, VASelector } from '../../index'
import { NAMESPACE } from 'constants/namespaces'
import { getTranslation } from 'utils/formattingUtils'
import { isIOS } from 'utils/platform'
import { renderInputError } from './formFieldUtils'
import { useTheme } from 'utils/hooks'

export type radioOption<T> = {
  /** translated text displayed next to the checkbox/radio */
  labelKey: string
  /** optional arguments to pass in with the labelKey during translation */
  labelArgs?: { [key: string]: string }
  /** value of the radio button */
  value: T
  /** string for the header if one needed */
  headerText?: string
  /** optional accessibilityLabel */
  a11yLabel?: string
  /** Additional text to present under label key */
  additionalLabelText?: Array<string>
  /** Removes the radio btn icon from radio list and makes it not selectable*/
  notSelectableRadioBtn?: boolean
  /** Optional TestID */
  testID?: string
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
  /** optional error to display */
  error?: string
  /** optional boolean to indicate to use the radio buttons in a list */
  isRadioList?: boolean
  /** optional text to show as the radio list title */
  radioListTitle?: string
}

/**A common component to display radio button selectors for a list of selectable items*/
const RadioGroup = <T,>({ options, value, onChange, disabled = false, error, isRadioList, radioListTitle }: RadioGroupProps<T>): ReactElement => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const hasSingleOption = options.length === 1

  useEffect(() => {
    // Auto select the first option if there is only one option
    if (hasSingleOption && !value) {
      onChange(options[0].value)
    }
  }, [hasSingleOption, value, options, onChange])

  const getOption = (option: radioOption<T>): ReactElement => {
    const { labelKey, labelArgs, a11yLabel, testID } = option

    // Render option as simple text
    if (hasSingleOption) {
      return (
        <TextView accessibilityLabel={a11yLabel || getTranslation(labelKey, t, labelArgs)} variant="VASelector">
          {getTranslation(labelKey, t, labelArgs)}
        </TextView>
      )
    }

    const selected = isEqual(option.value, value)
    const onVASelectorChange = (_selected: boolean): void => {
      onChange(option.value)
    }

    return (
      <VASelector
        selectorType={SelectorType.Radio}
        selected={selected}
        onSelectionChange={onVASelectorChange}
        labelKey={labelKey}
        labelArgs={labelArgs}
        disabled={disabled}
        a11yLabel={a11yLabel}
        testID={testID}
      />
    )
  }

  /** creates the radio group with an optiona title and the radio button on the left side */
  const getStandardRadioGroup = () => {
    return map(options, (option, index) => {
      const { headerText } = option
      return (
        <Box key={index}>
          {headerText && (
            <Box>
              <TextView variant="MobileBodyBold" accessibilityRole="header">
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
    const listItems: Array<DefaultListItemObj> = options.map((option, index) => {
      const selected = isEqual(option.value, value)
      const onSelectorChange = (): void => {
        if (!disabled && !option.notSelectableRadioBtn) {
          // Prevents VoiceOver from repeating accessibility label twice on changes
          isIOS() && AccessibilityInfo.announceForAccessibility('')
          onChange(option.value)
        }
      }
      const textLines: Array<TextLine> = [{ text: option.labelKey, variant: 'VASelector', color: disabled ? 'checkboxDisabled' : 'primary' }]

      if (option.additionalLabelText && option.additionalLabelText.length > 0) {
        textLines[0].variant = 'MobileBodyBold'
        option.additionalLabelText.forEach((item) => {
          textLines.push({ text: item, variant: 'MobileBody' })
        })
      }

      const radioButton: DefaultListItemObj = {
        textLines,
        decorator: option.notSelectableRadioBtn
          ? ButtonDecoratorType.None
          : disabled
          ? ButtonDecoratorType.RadioDisabled
          : selected
          ? ButtonDecoratorType.RadioFilled
          : ButtonDecoratorType.RadioEmpty,
        onPress: onSelectorChange,
        minHeight: 64,
        a11yRole: 'radio',
        a11yState: { selected: selected },
        backgroundColor: selected ? 'listActive' : undefined,
        testId: `${option.a11yLabel || option.labelKey} ${t('optionOutOfTotal', { count: index + 1, totalOptions: options.length })}`,
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
    return (
      <Box>
        {!!error && <Box mb={theme.dimensions.condensedMarginBetween}>{renderInputError(error)}</Box>}
        {isRadioList ? getRadioGroupList() : getStandardRadioGroup()}
      </Box>
    )
  }

  return getRadios()
}

export default RadioGroup
