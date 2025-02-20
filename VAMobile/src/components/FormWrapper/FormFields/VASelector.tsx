import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableWithoutFeedback } from 'react-native'

import { Icon, IconProps } from '@department-of-veterans-affairs/mobile-component-library'
import { colors } from '@department-of-veterans-affairs/mobile-tokens'

import { VAIconColors, VATextColors } from 'styles/theme'
import { a11yHintProp } from 'utils/accessibility'
import { getTranslation } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

import { Box, BoxProps, TextView } from '../../index'
import { renderInputError } from './formFieldUtils'

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

  const getIconsProps = (
    name: string,
    stroke?: keyof VAIconColors | string,
    fill?: keyof VAIconColors | keyof VATextColors | string,
  ): IconProps => {
    return {
      name,
      stroke,
      width: iconWidth,
      height: 22,
      fill,
    } as IconProps
  }

  const errorBoxProps: BoxProps = {
    ml: 10 + iconWidth,
  }

  const selectorBoxProps: BoxProps = {
    ml: 10,
    flex: 1,
  }

  const getCheckBoxIcon = (): React.ReactNode => {
    const buttonSelectedFill =
      theme.mode === 'dark' ? colors.vadsColorFormsForegroundActiveOnDark : colors.vadsColorFormsForegroundActiveOnLight
    const buttonUnselectedFill =
      theme.mode === 'dark' ? colors.vadsColorFormsBorderDefaultOnDark : colors.vadsColorFormsBorderDefaultOnLight

    if (disabled && selectorType === SelectorType.Radio) {
      return (
        <Icon
          {...getIconsProps(
            'RadioButtonUnchecked',
            theme.colors.icon.checkboxDisabled,
            theme.colors.icon.radioDisabled,
          )}
          testID="RadioEmpty"
        />
      )
    }

    if (!!error && selectorType === SelectorType.Checkbox) {
      return (
        <Icon
          {...getIconsProps('Error', theme.colors.icon.error, theme.colors.icon.checkboxDisabledContrast)}
          testID="Error"
        />
      )
    }

    const filledName = selectorType === SelectorType.Checkbox ? 'CheckBox' : 'RadioButtonChecked'
    const emptyName = selectorType === SelectorType.Checkbox ? 'CheckBoxOutlineBlank' : 'RadioButtonUnchecked'

    const name = selected ? filledName : emptyName
    const fill = selected ? buttonSelectedFill : buttonUnselectedFill
    const stroke = selected ? undefined : theme.colors.icon.checkboxDisabled

    return <Icon {...getIconsProps(name, stroke, fill)} testID={name} />
  }

  const hintProp = a11yHint ? a11yHintProp(a11yHint) : {}
  const a11yRole = selectorType === SelectorType.Checkbox ? 'checkbox' : 'radio'
  const a11yState = selectorType === SelectorType.Checkbox ? { checked: selected } : { selected }
  const labelToUse = `${a11yLabel || getTranslation(labelKey, t, labelArgs)} ${error ? t('error', { error }) : ''}`

  return (
    <TouchableWithoutFeedback
      testID={testID}
      onPress={selectorOnPress}
      accessibilityState={a11yState}
      accessibilityRole={a11yRole}
      accessibilityLabel={labelToUse}
      {...hintProp}>
      <Box>
        {!!error && <Box {...errorBoxProps}>{renderInputError(error)}</Box>}
        <Box flexDirection="row">
          <Box testID="checkbox-with-label" mt={5}>
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
