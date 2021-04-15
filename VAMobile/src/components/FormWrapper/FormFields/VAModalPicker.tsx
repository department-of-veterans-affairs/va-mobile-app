import { AccessibilityProps, Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { Box, PickerItem, ValidationFunctionItems } from '../../index'
import { NAMESPACE } from '../../../constants/namespaces'
import { SafeAreaView } from 'react-native-safe-area-context'
import { generateA11yValue, getInputWrapperProps, renderInputError, renderInputLabelSection } from './formFieldUtils'
import { testIdProps } from '../../../utils/accessibility'
import { useTheme, useTranslation } from '../../../utils/hooks'
import React, { FC, ReactElement, useState } from 'react'
import TextView from '../../TextView'
import VAScrollView from '../../VAScrollView'

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
  placeholderKey,
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
  const t = useTranslation(NAMESPACE.COMMON)

  const showModal = (): void => {
    setModalVisible(true)
  }

  const hideModal = (): void => {
    setModalVisible(false)
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

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}>
        <Box flex={1} backgroundColor="buttonPrimary" flexDirection="column">
          <Box flexGrow={1} />
          <Box mt={60} backgroundColor="buttonPrimaryActive">
            <VAScrollView>
              <Pressable style={[styles.button, styles.buttonClose]} onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </VAScrollView>
          </Box>
        </Box>
      </Modal>
      {renderSelectionBox()}
    </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'green',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})

export default VAModalPicker
