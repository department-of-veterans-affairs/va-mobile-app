import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Checkbox as CheckboxButton, RadioButton } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, VATextInput } from 'components'
import { a11yHintProp } from 'utils/accessibility'
import { getTranslation } from 'utils/formattingUtils'

export enum SelectorType {
  Checkbox = 'Checkbox',
  Radio = 'Radio',
}

/**
 * Signifies props for the component {@link VASelector}
 */
export type VASelectorProps = {
  /** render checkbox or radio button */
  selectorType?: SelectorType
  /** when true displays the filled checkbox/radio , when false displays the empty checkbox/radio */
  selected: boolean
  /** sets the value of selected on click of the checkbox/radio */
  onSelectionChange: (selected: boolean) => void
  /** translated labelKey displayed next to the checkbox/radio */
  labelKey: string
  /** optional arguments to pass in with the labelKey during translation */
  labelArgs?: { [key: string]: string }
  /** optional boolean that disables the VASelector/radio when set to true */
  disabled?: boolean
  /** optional accessibilityLabel */
  a11yLabel?: string
  /** optional accessibilityHint */
  a11yHint?: string
  /** optional error to display for the checkbox */
  error?: string
  /** optional callback to set the error message */
  setError?: (value?: string) => void
  /** optional boolean that marks the component as required */
  isRequiredField?: boolean
  /** Optional TestID */
  testID?: string
  textInput?: string
  setTextInput?: (val: string) => void
}

/**A common component to display a checkbox with text*/
const VASelector: FC<VASelectorProps> = ({
  selectorType = SelectorType.Checkbox,
  selected,
  onSelectionChange,
  labelKey,
  labelArgs,
  disabled,
  a11yLabel,
  a11yHint,
  error,
  testID,
  setError,
  textInput,
  setTextInput,
}) => {
  const { t } = useTranslation()

  const selectorOnPress = (): void => {
    if (!disabled) {
      setError && setError('')
      onSelectionChange(!selected)
    }
  }

  const hintProp = a11yHint ? a11yHintProp(a11yHint) : {}
  const errorText = error ? ` ${t('error', { error })}` : ''
  const text = `${getTranslation(labelKey, t, labelArgs)}`
  const textWithA11y = { text, a11yLabel: a11yLabel ? `${a11yLabel}${errorText}` : '' }

  if (selectorType === SelectorType.Checkbox) {
    return (
      <CheckboxButton
        checked={selected}
        label={textWithA11y}
        onPress={selectorOnPress}
        testID={testID}
        hint={{ text: '', a11yLabel: hintProp.accessibilityHint }}
        error={error}
      />
    )
  }

  return (
    <Box>
      <RadioButton
        selectedItem={selected ? text : undefined}
        items={[textWithA11y]}
        onSelectionChange={selectorOnPress}
        testID={testID}
        hint={{ text: '', a11yLabel: hintProp.accessibilityHint }}
        error={error}
      />
      {selected && setTextInput && (
        <VATextInput
          inputType="none"
          isTextArea={true}
          value={textInput}
          testID="AppFeedbackTaskID"
          onChange={setTextInput}
        />
      )}
    </Box>
  )
}

export default VASelector
