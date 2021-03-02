import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select'
import React, { FC, ReactElement, ReactNode, useState } from 'react'

import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import { useTranslation } from 'utils/hooks'
import Box, { BorderColorVariant, BoxProps } from './Box'
import TextView, { TextViewProps } from './TextView'
import VAIcon from './VAIcon'

/**
 * Signifies type of each item in list of {@link pickerOptions}
 */
export type PickerItem = {
  /** label is the text displayed to the user for the item */
  label: string
  /** value is the unique value of the item, used to update and keep track of the current label displayed */
  value: string
}

/**
 * Signifies props for the {@link VAPicker}
 */
export type VAPickerProps = {
  /** Currently selected item from list of options */
  selectedValue: string
  /** Called when the selected value is changed */
  onSelectionChange: (selectValue: string) => void
  /** list of items of containing types label and value for each option in the picker */
  pickerOptions: Array<PickerItem>
  /** i18n key for the text label next the picker field */
  labelKey?: string
  /** optional function run on click of up arrow in ios - should change the focus from the current input field to the one above it */
  onUpArrow?: () => void
  /** optional function run on click of down arrow in ios - should change the focus from the current input field to the one below it */
  onDownArrow?: () => void
  /** optional i18n ID for the placeholder */
  placeholderKey?: string
  /** optional boolean that disables the picker when set to true */
  disabled?: boolean
  /** optional testID for the overall component */
  testID?: string
  /** optional ref value */
  pickerRef?: React.Ref<RNPickerSelect>
  /** optional callback when the 'Done' button is pressed. IOS Only */
  onDonePress?: () => void
  /** optional boolean that displays required text next to label if set to true */
  isRequiredField?: boolean
  /** optional key for string to display underneath label */
  helperTextKey?: string
  /** if this exists updated picker styles to error state */
  error?: string
}

const VAPicker: FC<VAPickerProps> = ({
  selectedValue,
  onSelectionChange,
  pickerOptions,
  labelKey,
  onUpArrow,
  onDownArrow,
  placeholderKey,
  disabled,
  pickerRef,
  testID,
  onDonePress,
  isRequiredField,
  helperTextKey,
  error,
}) => {
  const theme = useTheme()
  const t = useTranslation()
  const [isFocused, setIsFocused] = useState(false)

  const getBorderColor = (): BorderColorVariant => {
    if (error) {
      return 'error'
    }

    if (isFocused) {
      return 'focusedPickerAndInput'
    }

    return 'pickerAndInput'
  }

  const pickerWrapperProps: BoxProps = {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'textBox',
    minHeight: theme.dimensions.touchableMinHeight,
    borderColor: getBorderColor(),
    borderWidth: isFocused || !!error ? theme.dimensions.focusedInputBorderWidth : theme.dimensions.borderWidth,
  }

  const fontSize = theme.fontSizes.MobileBody.fontSize
  const fontFamily = theme.fontFace.regular

  const pickerProps: PickerSelectProps = {
    style: {
      inputAndroid: { color: disabled ? theme.colors.text.placeholder : theme.colors.text.secondary, fontSize, fontFamily },
      inputIOS: { color: disabled ? theme.colors.text.placeholder : theme.colors.text.secondary, fontSize, fontFamily, marginLeft: theme.dimensions.condensedMarginBetween },
      placeholder: { color: theme.colors.text.placeholder },
      chevronUp: !onUpArrow ? { opacity: 0 } : {},
      chevronDown: !onDownArrow ? { opacity: 0 } : !onUpArrow ? { right: 0, position: 'absolute' } : {},
      iconContainer: { height: '100%', justifyContent: 'center', paddingRight: theme.dimensions.datePickerArrowsPaddingRight },
    },
    value: selectedValue,
    onValueChange: (value: string): void => {
      if (value !== selectedValue) {
        onSelectionChange(value)
      }
    },
    items: pickerOptions,
    onUpArrow: onUpArrow,
    onDownArrow: onDownArrow,
    onDonePress: onDonePress,
    onOpen: () => setIsFocused(true),
    onClose: () => setIsFocused(false),
    placeholder: placeholderKey ? { label: t(placeholderKey) } : {},
    disabled,
    Icon: (): ReactNode => {
      return <VAIcon name="DatePickerArrows" fill="grayDark" />
    },
  }

  const generateLabel = (): ReactElement => {
    const variant = error ? 'MobileBodyBold' : 'MobileBody'

    const labelProps: TextViewProps = {
      color: disabled ? 'placeholder' : 'primary',
      variant,
    }

    const label = <TextView {...labelProps}>{t(labelKey || '')}</TextView>

    if (isRequiredField) {
      return (
        <Box display="flex" flexDirection="row" flexWrap="wrap">
          {label}
          <TextView>&nbsp;</TextView>
          <TextView color="error" variant={variant}>
            {t('common:required')}
          </TextView>
        </Box>
      )
    }

    return label
  }

  const generateTestID = (): string => {
    let resultingTestID = ''

    if (testID) {
      resultingTestID += `${testID} ${t('common:picker')}`
    } else if (labelKey) {
      resultingTestID += `${t(labelKey)} ${t('common:picker')}`
    } else {
      resultingTestID += t('common:picker')
    }

    if (isRequiredField) {
      resultingTestID += t('common:required.a11yLabel')
    }

    if (helperTextKey) {
      resultingTestID += t(helperTextKey)
    }

    if (error) {
      resultingTestID += `${error} ${t('common:error')}`
    }

    return resultingTestID
  }

  const getA11yValue = (): string => {
    const currentlySelectedLabel = pickerOptions.find((el) => el.value === selectedValue)
    if (currentlySelectedLabel) {
      return `${currentlySelectedLabel.label} ${t('common:currentlySelected')}`
    }

    if (placeholderKey) {
      return `${t(placeholderKey)} ${t('common:placeHolder.A11yValue')}`
    }

    return t('common:noItemSelected')
  }

  return (
    <Box {...testIdProps(generateTestID())} accessibilityValue={{ text: getA11yValue() }} accessibilityRole="spinbutton" accessible={true}>
      {labelKey && (
        <Box mb={theme.dimensions.pickerLabelMargin}>
          {generateLabel()}
          {!!helperTextKey && <TextView variant="TableFooterLabel">{t(helperTextKey)}</TextView>}
        </Box>
      )}
      <Box {...pickerWrapperProps}>
        <Box width="100%">
          <RNPickerSelect {...pickerProps} ref={pickerRef} />
        </Box>
      </Box>
      {!!error && (
        <TextView variant="MobileBodyBold" color="error" mt={theme.dimensions.pickerLabelMargin}>
          {error}
        </TextView>
      )}
    </Box>
  )
}

export default VAPicker
