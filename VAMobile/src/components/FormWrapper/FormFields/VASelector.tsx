import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import { Box, TextView, VAIcon, VAIconProps } from '../../index'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { renderInputError } from './formFieldUtils'
import { useTheme, useTranslation } from 'utils/hooks'

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
  setError,
  isRequiredField,
}) => {
  const theme = useTheme()
  const t = useTranslation()
  const {
    dimensions: { selectorWidth, selectorHeight, checkboxLabelMargin },
  } = theme

  const selectorOnPress = (): void => {
    if (!disabled) {
      setError && setError('')

      // if its a required checkbox and its being unchecked, display the error
      if (isRequiredField && selected && setError && selectorType === SelectorType.Checkbox) {
        setError()
      }

      onSelectionChange(!selected)
    }
  }

  const getCheckBoxIcon = (): React.ReactNode => {
    if (disabled && selectorType === SelectorType.Radio) {
      return <VAIcon name="DisabledRadio" width={selectorWidth} height={selectorHeight} {...testIdProps('DisabledRadio')} />
    }

    if (!!error && selectorType === SelectorType.Checkbox) {
      return <VAIcon name="ErrorCheckBox" width={selectorWidth} height={selectorHeight} stroke={theme.colors.icon.error} {...testIdProps('ErrorCheckBox')} />
    }

    const filledName = selectorType === SelectorType.Checkbox ? 'FilledCheckBox' : 'FilledRadio'
    const emptyName = selectorType === SelectorType.Checkbox ? 'EmptyCheckBox' : 'EmptyRadio'

    const name = selected ? filledName : emptyName
    const fill = selected ? 'checkboxEnabledPrimary' : 'checkboxDisabledContrast'
    const stroke = selected ? 'checkboxEnabledPrimary' : 'checkboxDisabled'

    const selectorIconProps: VAIconProps = {
      name,
      width: selectorWidth,
      height: selectorHeight,
      fill,
      stroke,
    }

    return <VAIcon {...selectorIconProps} {...testIdProps(name)} />
  }

  const hintProp = a11yHint ? a11yHintProp(a11yHint) : {}
  const a11yRole = selectorType === SelectorType.Checkbox ? 'checkbox' : 'radio'
  const a11yState = selectorType === SelectorType.Checkbox ? { checked: selected } : { selected }

  return (
    <TouchableWithoutFeedback
      onPress={selectorOnPress}
      accessibilityState={a11yState}
      accessibilityRole={a11yRole}
      {...hintProp}
      {...testIdProps(a11yLabel || t(labelKey, labelArgs))}>
      <Box>
        {!!error && <Box ml={checkboxLabelMargin + selectorWidth}>{renderInputError(theme, error)}</Box>}
        <Box flexDirection="row">
          <Box {...testIdProps('checkbox-with-label')}>{getCheckBoxIcon()}</Box>
          <Box flex={1} ml={checkboxLabelMargin}>
            <TextView variant="VASelector" color={disabled ? 'checkboxDisabled' : 'primary'}>
              {t(labelKey, labelArgs)}
            </TextView>
          </Box>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default VASelector
