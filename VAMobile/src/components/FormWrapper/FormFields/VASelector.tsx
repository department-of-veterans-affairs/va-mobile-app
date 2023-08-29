import { TouchableWithoutFeedback } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, BoxProps, TextView, VAIcon, VAIconProps } from '../../index'
import { VAIconColors, VATextColors } from 'styles/theme'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { getTranslation } from 'utils/formattingUtils'
import { renderInputError } from './formFieldUtils'
import { useTheme } from 'utils/hooks'

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
}) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const iconWidth = 22

  const selectorOnPress = (): void => {
    if (!disabled) {
      setError && setError('')
      onSelectionChange(!selected)
    }
  }

  const getIconsProps = (name: string, stroke?: keyof VAIconColors | string, fill?: keyof VAIconColors | keyof VATextColors | string): VAIconProps => {
    return {
      name,
      stroke,
      width: iconWidth,
      height: 22,
      fill,
    } as VAIconProps
  }

  const errorBoxProps: BoxProps = {
    ml: 10 + iconWidth,
  }

  const selectorBoxProps: BoxProps = {
    ml: 10,
    flex: 1,
  }

  const getCheckBoxIcon = (): React.ReactNode => {
    if (disabled && selectorType === SelectorType.Radio) {
      return <VAIcon {...getIconsProps('RadioEmpty', 'checkboxDisabled', 'radioDisabled')} {...testIdProps('RadioEmpty')} />
    }

    if (!!error && selectorType === SelectorType.Checkbox) {
      return <VAIcon {...getIconsProps('CheckBoxError', theme.colors.icon.error, 'checkboxDisabledContrast')} {...testIdProps('CheckBoxError')} />
    }

    const filledName = selectorType === SelectorType.Checkbox ? 'CheckBoxFilled' : 'RadioFilled'
    const emptyName = selectorType === SelectorType.Checkbox ? 'CheckBoxEmpty' : 'RadioEmpty'

    const name = selected ? filledName : emptyName
    const fill = selected ? 'checkboxEnabledPrimary' : 'checkboxDisabledContrast'
    const stroke = selected ? undefined : 'checkboxDisabled'

    return <VAIcon {...getIconsProps(name, stroke, fill)} {...testIdProps(name)} />
  }

  const hintProp = a11yHint ? a11yHintProp(a11yHint) : {}
  const a11yRole = selectorType === SelectorType.Checkbox ? 'checkbox' : 'radio'
  const a11yState = selectorType === SelectorType.Checkbox ? { checked: selected } : { selected }
  const labelToUse = `${a11yLabel || getTranslation(labelKey, t, labelArgs)} ${error ? t('error', { error }) : ''}`

  return (
    <TouchableWithoutFeedback testID={testID} onPress={selectorOnPress} accessibilityState={a11yState} accessibilityRole={a11yRole} accessibilityLabel={labelToUse} {...hintProp}>
      <Box>
        {!!error && <Box {...errorBoxProps}>{renderInputError(error)}</Box>}
        <Box flexDirection="row">
          <Box {...testIdProps('checkbox-with-label')} mt={5}>
            {getCheckBoxIcon()}
          </Box>
          <Box {...selectorBoxProps}>
            <TextView variant="VASelector" color={disabled ? 'checkboxDisabled' : 'bodyText'}>
              {getTranslation(labelKey, t, labelArgs)}
            </TextView>
          </Box>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default VASelector
