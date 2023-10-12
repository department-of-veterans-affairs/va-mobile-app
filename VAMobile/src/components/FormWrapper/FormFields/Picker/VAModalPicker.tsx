import { AccessibilityProps, Modal, Pressable, PressableProps, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement, useCallback, useEffect, useState } from 'react'

import { Box, BoxProps, TextView, TextViewProps, VAIcon, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { VAIconProps } from 'components/VAIcon'
import { a11yHintProp, a11yValueProp, testIdProps } from 'utils/accessibility'
import { generateA11yValue, generateInputTestID, getInputWrapperProps, removeInputErrorMessage, renderInputError, renderInputLabelSection } from '../formFieldUtils'
import { getTranslation } from 'utils/formattingUtils'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'
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
  /** Called when the cancel button is pressed */
  onClose?: () => void
  /** list of items of containing types label and value for each option in the picker */
  pickerOptions: Array<PickerItem>
  /** i18n key for the text label next the picker field */
  labelKey?: string
  /** optional boolean that disables the picker when set to true */
  disabled?: boolean
  /** optional boolean that displays required text next to label if set to true */
  isRequiredField?: boolean
  /** optional key for string to display underneath label */
  helperTextKey?: string
  /** optional callback to update the error message if there is an error */
  setError?: (error?: string) => void
  /** if this exists updated picker styles to error state */
  error?: string
  /** If true, will include a blank option at the top of the list with a blank value */
  includeBlankPlaceholder?: boolean
  /** renders a button instead of form field */
  displayButton?: boolean
  /** i18n key text for the name of the button */
  buttonText?: string
  /** i18n key  text for the picker confirm button */
  confirmBtnText?: string
  /** shows the modal by default */
  showModalByDefault?: boolean
  /** Optional TestID for scrollView */
  testID?: string
}

/**A common component to display a picker for the device with an optional label*/
const VAModalPicker: FC<VAModalPickerProps> = ({
  selectedValue,
  onSelectionChange,
  onClose,
  pickerOptions,
  labelKey,
  disabled,
  isRequiredField,
  helperTextKey,
  setError,
  error,
  includeBlankPlaceholder,
  displayButton = false,
  buttonText,
  confirmBtnText,
  testID,
  showModalByDefault,
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const theme = useTheme()
  const { t } = useTranslation()
  const insets = useSafeAreaInsets()

  const [currentSelectedValue, setCurrentSelectedValue] = useState(selectedValue)
  const [focusUpdated, setFocusUpdated] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    removeInputErrorMessage(isFocused, error, setError, focusUpdated, setFocusUpdated)
  }, [isFocused, selectedValue, error, setError, focusUpdated])

  const showModal = useCallback((): void => {
    logAnalyticsEvent(Events.vama_modalpick_open(labelKey ? getTranslation(labelKey, t) : testID ? testID : ''))
    if (!disabled) {
      setIsFocused(true)
      setModalVisible(true)
      if (!snackBar) {
        logAnalyticsEvent(Events.vama_snackbar_null('VAModalPicker'))
      }
      snackBar?.hideAll()
    }
  }, [disabled, labelKey, testID, t])

  useEffect(() => {
    showModalByDefault && showModal()
  }, [showModalByDefault, showModal])

  const onConfirm = (): void => {
    logAnalyticsEvent(Events.vama_modalpick_sel(labelKey ? getTranslation(labelKey, t) : testID ? testID : '', currentSelectedValue))
    onSelectionChange(currentSelectedValue)
    setModalVisible(false)
    setIsFocused(false)
    setFocusUpdated(true)
  }

  const onCancel = (): void => {
    onClose && onClose()
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
  const resultingTestID = generateInputTestID(testID, labelKey, isRequiredField, helperTextKey, error, t, 'picker')

  const parentProps: AccessibilityProps = {
    ...a11yValueProp({ text: generateA11yValue(currentlySelectedOption?.label, isFocused, t) }),
    accessibilityRole: 'spinbutton',
  }

  const renderSelectionBox = (): ReactElement => {
    const wrapperProps = getInputWrapperProps(theme, error, false)

    const valueBox = (
      <Box {...wrapperProps}>
        <Box width="100%" display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <TextView testID={testID} variant="MobileBody" flex={1}>
            {currentlySelectedOption?.label}
          </TextView>
          <Box mr={8} ml={16} my={16}>
            <VAIcon name="Sort" fill="pickerIcon" width={16} height={16} />
          </Box>
        </Box>
      </Box>
    )

    const content = (
      <Box>
        {labelKey && renderInputLabelSection(error, isRequiredField, labelKey, t, helperTextKey)}
        {!!error && renderInputError(error)}
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
    const color = disabled ? 'actionBarDisabled' : 'actionBar'

    const props: TouchableWithoutFeedbackProps = {
      onPress: showModal,
      disabled,
      accessibilityRole: 'button',
      accessible: true,
      accessibilityState: disabled ? { disabled: true } : { disabled: false },
    }

    return (
      <TouchableWithoutFeedback {...props} {...testIdProps(getTranslation(buttonText || '', t))}>
        <Box pr={theme.dimensions.headerButtonSpacing} height={theme.dimensions.headerHeight} justifyContent={'center'} pl={theme.dimensions.headerLeftButtonFromTextPadding}>
          <TextView variant="ActionBar" color={color} allowFontScaling={false} accessible={false}>
            {getTranslation(buttonText || '', t)}
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

  const topPadding = insets.top + 60

  const cancelLabel = t('cancel')
  const confirmLabel = getTranslation(confirmBtnText || 'done', t)

  const cancelButtonProps: PressableProps = {
    accessible: true,
    accessibilityRole: 'button',
    ...testIdProps(cancelLabel),
    ...a11yHintProp(t('cancel.picker.a11yHint')),
  }

  const confirmButtonProps: PressableProps = {
    accessible: true,
    accessibilityRole: 'button',
    ...testIdProps(confirmLabel),
    ...a11yHintProp(t('done.picker.a11yHint')),
  }

  const commonButtonProps: TextViewProps = {
    variant: 'MobileBody',
    color: 'link',
    allowFontScaling: false,
    py: 3, // bump up the padding to make touch target a bit bigger #2740
  }

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
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
                <TextView {...commonButtonProps}>{cancelLabel}</TextView>
              </Pressable>
              <Box flex={4}>
                <TextView variant="MobileBodyBold" textAlign={'center'} allowFontScaling={false}>
                  {getTranslation(labelKey || '', t)}
                </TextView>
              </Box>
              <Pressable onPress={onConfirm} {...confirmButtonProps}>
                <TextView {...commonButtonProps}>{confirmLabel}</TextView>
              </Pressable>
            </Box>
            <VAScrollView bounces={false}>
              <PickerList items={pickerListItems} />
            </VAScrollView>
          </Box>
        </Box>
      </Modal>
      {!showModalByDefault && (displayButton ? renderButton() : renderSelectionBox())}
    </View>
  )
}

export default VAModalPicker
