import { AccessibilityProps, Modal, Pressable, View } from 'react-native'
import React, { FC, ReactElement, useEffect, useState } from 'react'

import { Box, BoxProps, PickerItem, TextView, VAScrollView, ValidationFunctionItems } from 'components'
import { generateA11yValue, generateInputTestID, getInputWrapperProps, renderInputError, renderInputLabelSection, updateInputErrorMessage } from '../formFieldUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import PickerList, { PickerListItemObj } from './PickerList'

export type VAModalPickerProps = {
  /** Currently selected item from list of options */
  selectedValue: string
  /** Called when the selected value is changed */
  onSelectionChange: (selectValue: string) => void
  /** list of items of containing types label and value for each option in the picker */
  pickerOptions: Array<PickerItem>
  /** i18n key for the text label next the picker field */
  labelKey?: string
  /** optional i18n ID for the placeholder */
  placeholderKey?: string
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
}

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
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const theme = useTheme()
  const t = useTranslation()

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
    }
  }

  const onDone = (): void => {
    onSelectionChange(currentSelectedValue)
    setModalVisible(false)
  }

  const onCancel = (): void => {
    setModalVisible(false)
    setIsFocused(false)
    setFocusUpdated(true)
  }

  const handleSelection = (selectionVal: string): void => {
    setCurrentSelectedValue(selectionVal)
    console.log(selectionVal)
  }

  const pickerListItems: Array<PickerListItemObj> = pickerOptions.map((pickerOption) => {
    return {
      text: pickerOption.label,
      onPress: () => {
        handleSelection(pickerOption.value)
      },
      isSelected: currentSelectedValue === pickerOption.value,
    }
  })

  const currentlySelectedLabel = pickerOptions.find((el) => el.value === selectedValue)
  const resultingTestID = generateInputTestID(testID, labelKey, isRequiredField, helperTextKey, error, t, 'common:picker')

  const parentProps: AccessibilityProps = {
    accessibilityValue: { text: generateA11yValue(currentlySelectedLabel?.label, '', isFocused, t) },
    accessibilityRole: 'spinbutton',
  }

  const renderSelectionBox = (): ReactElement => {
    const wrapperProps = getInputWrapperProps(theme, error, false)

    const valueBox = (
      <Box {...wrapperProps} pl={theme.dimensions.condensedMarginBetween}>
        <Box width="100%">
          <TextView>{selectedValue}</TextView>
        </Box>
      </Box>
    )

    const content = (
      <Box>
        {labelKey && renderInputLabelSection(error, false, isRequiredField, labelKey, t, helperTextKey, theme)}
        {valueBox}
        {!!error && renderInputError(theme, error)}
      </Box>
    )

    //{...testIdProps(resultingTestID)}
    return (
      <Pressable onPress={showModal} accessible={true}>
        {content}
      </Pressable>
    )
  }

  const actionsBarBoxProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'main',
    minHeight: theme.dimensions.touchableMinHeight,
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.gutter,
  }

  return (
    <View {...parentProps} accessible={true}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}>
        <Box flex={1} flexDirection="column">
          <Box flexGrow={1} backgroundColor="modalOverlay" opacity={0.8} pt={theme.dimensions.pickerModalTopPadding} />
          <Box backgroundColor="list">
            <Box {...actionsBarBoxProps}>
              <Pressable onPress={onCancel}>
                <TextView>{t('common:cancel')}</TextView>
              </Pressable>
              <TextView>Country</TextView>
              <Pressable onPress={onDone}>
                <TextView>{t('common:done')}</TextView>
              </Pressable>
            </Box>
            <VAScrollView bounces={false}>
              <PickerList items={pickerListItems} />
            </VAScrollView>
          </Box>
        </Box>
      </Modal>
      {renderSelectionBox()}
    </View>
  )
}

export default VAModalPicker
