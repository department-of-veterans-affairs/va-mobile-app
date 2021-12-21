import { AccessibilityProps, Modal, Pressable, PressableProps, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import React, { FC, ReactElement, useEffect, useState } from 'react'

import { Box, BoxProps, TextView, VAIcon, VAScrollView, ValidationFunctionItems } from 'components'
import { VAIconProps } from 'components/VAIcon'
import { a11yHintProp, a11yValueProp, testIdProps } from 'utils/accessibility'
import { generateA11yValue, generateInputTestID, getInputWrapperProps, renderInputError, renderInputLabelSection, updateInputErrorMessage } from '../formFieldUtils'
import { useTheme, useTranslation } from 'utils/hooks'
import PickerList, { PickerListItemObj } from './PickerList'

/**
 * Signifies type of each item in list of {@link pickerOptions}
 */
export type PickerItem = {
  /** label is the text displayed to the user for the item */
  label: string
  /** value is the unique value of the item, used to update and keep track of the current label displayed */
  value: string
  /** icon to show */
  icon?: VAIconProps
}

export type VAModalPickerProps = {
  /** Currently selected item from list of options */
  selectedValue: string
  /** Called when the selected value is changed */
  onSelectionChange: (selectValue: string) => void
  /** list of items of containing types label and value for each option in the picker */
  pickerOptions: Array<PickerItem>
  /** i18n key for the text label next the picker field */
  labelKey?: string
  /** optional boolean that disables the picker when set to true */
  disabled?: boolean
  /** optional testID for the overall component */
  testID?: string
  /** optional boolean that displays required text next to label if set to true */
  isRequiredField?: boolean
  /** optional key for string to display underneath label */
  helperTextKey?: string
  /** optional callback to update the error message if there is an error */
  setError?: (error?: string) => void
  /** if this exists updated picker styles to error state */
  error?: string
  /** optional list of validation functions to check against */
  validationList?: Array<ValidationFunctionItems>
  /** If true, will include a blank option at the top of the list with a blank value */
  includeBlankPlaceholder?: boolean
  /** renders a button instead of form field */
  displayButton?: boolean
  /** i18n key text for the name of the button */
  buttonText?: string
  /** i18n key  text for the picker confirm button */
  confirmBtnText?: string
}

/**A common component to display a picker for the device with an optional label*/
const VAModalPicker: FC<VAModalPickerProps> = ({
  selectedValue,
  onSelectionChange,
  pickerOptions,
  labelKey,
  disabled,
  testID,
  isRequiredField,
  helperTextKey,
  setError,
  error,
  validationList,
  includeBlankPlaceholder,
  displayButton = false,
  buttonText,
  confirmBtnText,
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const theme = useTheme()
  const t = useTranslation()
  const insets = useSafeAreaInsets()

  const [currentSelectedValue, setCurrentSelectedValue] = useState(selectedValue)
  const [focusUpdated, setFocusUpdated] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    updateInputErrorMessage(isFocused, isRequiredField, error, setError, selectedValue, focusUpdated, setFocusUpdated, validationList)
  }, [isFocused, labelKey, selectedValue, error, setError, isRequiredField, t, focusUpdated, validationList])

  const showModal = (): void => {
    if (!disabled) {
      setIsFocused(true)
      setModalVisible(true)
      snackBar.hideAll()
    }
  }

  const onConfirm = (): void => {
    onSelectionChange(currentSelectedValue)
    setModalVisible(false)
    setIsFocused(false)
    setFocusUpdated(true)
  }

  const onCancel = (): void => {
    // Reset the selected picker item
    setCurrentSelectedValue(selectedValue)

    setModalVisible(false)
    setIsFocused(false)
    setFocusUpdated(true)
  }

  const handleSelection = (selectionVal: string): void => {
    setCurrentSelectedValue(selectionVal)
  }

  const allPickerOptions: Array<PickerItem> = includeBlankPlaceholder
    ? [
        {
          value: '',
          label: '',
        },
      ].concat(pickerOptions)
    : pickerOptions

  const pickerListItems: Array<PickerListItemObj> = allPickerOptions.map((pickerOption) => {
    return {
      text: pickerOption.label,
      onPress: () => {
        handleSelection(pickerOption.value)
      },
      isSelected: currentSelectedValue === pickerOption.value,
      icon: pickerOption.icon,
    }
  })

  const currentlySelectedOption = allPickerOptions.find((el) => el.value === selectedValue)
  const resultingTestID = generateInputTestID(testID, labelKey, isRequiredField, helperTextKey, error, t, 'common:picker')

  const parentProps: AccessibilityProps = {
    ...a11yValueProp({ text: generateA11yValue(currentlySelectedOption?.label, isFocused, t) }),
    accessibilityRole: 'spinbutton',
  }

  const renderSelectionBox = (): ReactElement => {
    const wrapperProps = getInputWrapperProps(theme, error, false)

    const valueBox = (
      <Box {...wrapperProps} pl={theme.dimensions.condensedMarginBetween}>
        <Box width="100%" display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <TextView flex={1}>{currentlySelectedOption?.label}</TextView>
          <Box pr={theme.dimensions.buttonPadding}>
            <VAIcon name="DatePickerArrows" fill="grayDark" width={16} height={16} />
          </Box>
        </Box>
      </Box>
    )

    const content = (
      <Box>
        {labelKey && renderInputLabelSection(error, false, isRequiredField, labelKey, t, helperTextKey, theme)}
        {!!error && renderInputError(theme, error)}
        {valueBox}
      </Box>
    )

    return (
      <Pressable onPress={showModal} accessible={true} {...testIdProps(resultingTestID)} {...parentProps}>
        {content}
      </Pressable>
    )
  }

  const renderButton = () => {
    const color = disabled ? 'primaryContrastDisabled' : 'primaryContrast'

    const props: TouchableWithoutFeedbackProps = {
      onPress: showModal,
      disabled,
      accessibilityRole: 'button',
      accessible: true,
      accessibilityState: disabled ? { disabled: true } : { disabled: false },
    }

    return (
      <TouchableWithoutFeedback {...props} {...testIdProps(t(buttonText || ''))} {...a11yHintProp(t('common:pickerLaunchBtn.a11yHint'))}>
        <Box pr={theme.dimensions.headerButtonMargin} height={theme.dimensions.headerHeight} justifyContent={'center'} pl={theme.dimensions.headerButtonPadding}>
          <TextView variant="ActionBar" color={color} allowFontScaling={false} accessible={false}>
            {t(buttonText || '')}
          </TextView>
        </Box>
      </TouchableWithoutFeedback>
    )
  }

  const actionsBarBoxProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'pickerControls',
    minHeight: theme.dimensions.touchableMinHeight,
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.gutter,
    ml: insets.left,
    mr: insets.right,
  }

  const topPadding = insets.top + theme.dimensions.pickerModalTopPadding

  const cancelLabel = t('common:cancel')
  const confirmLabel = t(confirmBtnText || 'common:done')

  const cancelButtonProps: PressableProps = {
    accessible: true,
    accessibilityRole: 'button',
    ...testIdProps(cancelLabel),
    ...a11yHintProp(t('common:cancel.picker.a11yHint')),
  }

  const confirmButtonProps: PressableProps = {
    accessible: true,
    accessibilityRole: 'button',
    ...testIdProps(confirmLabel),
    ...a11yHintProp(t('common:done.picker.a11yHint')),
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}>
        <Box flex={1} flexDirection="column" accessibilityViewIsModal={true}>
          <Box flexGrow={1} backgroundColor="modalOverlay" opacity={0.8} pt={topPadding} />
          <Box backgroundColor="list" pb={insets.bottom} flexShrink={1}>
            <Box {...actionsBarBoxProps}>
              <Pressable onPress={onCancel} {...cancelButtonProps}>
                <TextView allowFontScaling={false}>{cancelLabel}</TextView>
              </Pressable>
              <Box flex={4}>
                <TextView variant="MobileBodyBold" color={'primaryTitle'} textAlign={'center'} allowFontScaling={false}>
                  {t(labelKey || '')}
                </TextView>
              </Box>
              <Pressable onPress={onConfirm} {...confirmButtonProps}>
                <TextView allowFontScaling={false}>{confirmLabel}</TextView>
              </Pressable>
            </Box>
            <VAScrollView bounces={false}>
              <PickerList items={pickerListItems} />
            </VAScrollView>
          </Box>
        </Box>
      </Modal>
      {displayButton ? renderButton() : renderSelectionBox()}
    </View>
  )
}

export default VAModalPicker
