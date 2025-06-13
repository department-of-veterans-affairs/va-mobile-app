import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { Box, TextView } from 'components/index'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

import { getInputWrapperProps, renderInputError, renderInputLabelSection } from '../formFieldUtils'
import ComboBox, { ComboBoxProps } from './ComboBox'

export type ComboBoxItem = {
  /** label is the text displayed to the user for the item */
  label: string
  /** value is the unique value of the item, used to update and keep track of the current label displayed */
  value: string
}

export type ComboBoxOptions = Record<string, Array<unknown>>

export type ComboBoxInputProps = {
  /** Currently selected item from list of options */
  selectedValue?: ComboBoxItem
  /** Called when the selected value is changed */
  onSelectionChange: (item?: ComboBoxItem) => void
  /** Called when the cancel button is pressed */
  onClose?: () => void
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
  /** list of items of containing types label and value for each option in the combobox */
  comboBoxOptions: ComboBoxOptions
  /** Optional TestID */
  testID?: string
}

const ComboBoxInput: FC<ComboBoxInputProps> = ({
  selectedValue,
  onSelectionChange,
  comboBoxOptions,
  disabled,
  error,
  labelKey,
  testID,
}) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const wrapperProps = getInputWrapperProps(theme, error, false)
  const [modalVisible, setModalVisible] = useState(false)

  const renderSelectionBox = () => {
    return (
      <Box>
        {labelKey && renderInputLabelSection(error, true, labelKey, t, '')}
        {!!error && renderInputError(error)}
        <Pressable
          onPress={showModal}
          accessible={true}
          accessibilityLabel={t('secureMessaging.startNewMessage.combobox.selection')}
          accessibilityHint={t('secureMessaging.startNewMessage.combobox.selection.a11y')}>
          <Box {...wrapperProps}>
            <Box
              width="100%"
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}>
              <TextView testID={testID} variant="MobileBody" flex={1}>
                {selectedValue?.label}
              </TextView>
              {selectedValue && (
                <Pressable accessibilityRole="button" onPress={() => onSelectionChange(undefined)}>
                  <Box ml={16} my={12}>
                    <Icon name="Close" fill={theme.colors.icon.pickerIcon} width={30} height={30} />
                  </Box>
                </Pressable>
              )}
              <Box ml={12} my={12}>
                <Icon name="UnfoldMore" fill={theme.colors.icon.pickerIcon} width={30} height={30} />
              </Box>
            </Box>
          </Box>
        </Pressable>
      </Box>
    )
  }

  const comboboxProps: ComboBoxProps = {
    selectedValue,
    comboBoxOptions,
    onSelectionChange,
    onClose: () => setModalVisible(false),
  }

  const showModal = () => {
    if (!disabled) {
      setModalVisible(true)
    }
  }

  const topPadding = insets.top + 60

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent={true}
        visible={modalVisible}
        supportedOrientations={['portrait', 'landscape']}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <Box flex={1} flexDirection="column" accessibilityViewIsModal={true}>
          <Box backgroundColor="modalOverlay" opacity={0.8} pt={topPadding} />
          <ComboBox {...comboboxProps} />
        </Box>
      </Modal>
      {renderSelectionBox()}
    </View>
  )
}

export default ComboBoxInput
