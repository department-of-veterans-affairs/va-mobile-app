import React from 'react'

import { t } from 'i18next'

import ComboBoxInput, { ComboBoxInputProps } from 'components/FormWrapper/FormFields/ComboBox/ComboBoxInput'
import { fireEvent, render, screen, waitFor } from 'testUtils'

const mockOnSelectionChange = jest.fn()
const mockSetError = jest.fn()

describe('ComboBoxInput Component', () => {
  const comboBoxOptions = {
    Group1: [
      { value: '1', label: 'Label1' },
      { value: '2', label: 'Label2' },
    ],
    Group2: [
      { value: '3', label: 'Label3' },
      { value: '4', label: 'Label4' },
    ],
  }

  const defaultProps: ComboBoxInputProps = {
    selectedValue: { value: '1', label: 'Label1' },
    onSelectionChange: mockOnSelectionChange,
    comboBoxOptions,
    disabled: false,
    setError: mockSetError,
    labelKey: 'Select an Item',
    testID: 'comboBoxInput',
    titleKey: 'ComboBox Title',
    virtualized: false,
    hideGroupsHeaders: false,
    hideRemoveButton: false,
  }

  const initializeTestInstance = (disabled?: boolean, hideRemoveButton?: boolean, error?: string): void => {
    render(
      <ComboBoxInput
        {...defaultProps}
        disabled={disabled || defaultProps.disabled}
        hideRemoveButton={hideRemoveButton || defaultProps.hideRemoveButton}
        error={error}
      />,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the ComboBoxInput with the correct label and selected value', () => {
    initializeTestInstance()

    expect(screen.getByText('Select an Item (Required)')).toBeTruthy()
    expect(screen.getByText('Label1')).toBeTruthy()
  })

  it('opens the modal when the ComboBox is pressed', () => {
    initializeTestInstance()

    fireEvent.press(screen.getByTestId('comboBoxInput'))
    expect(screen.getByText('ComboBox Title')).toBeTruthy()
  })

  it('calls onSelectionChange when an item is selected', () => {
    initializeTestInstance()

    fireEvent.press(screen.getByTestId('comboBoxInput'))
    fireEvent.press(screen.getByText('Label3'))

    expect(mockOnSelectionChange).toHaveBeenCalledWith({ value: '3', label: 'Label3' })
  })

  it('closes the modal when the close button is pressed', async () => {
    initializeTestInstance()

    fireEvent.press(screen.getByTestId('comboBoxInput'))
    await waitFor(() => fireEvent.press(screen.getByRole('button', { name: t('close') })))

    expect(screen.queryByText('ComboBox Title')).toBeFalsy()
  })

  it('displays an error message when the error prop is set', () => {
    initializeTestInstance(false, false, 'Error text')

    expect(screen.getByText('Error text')).toBeTruthy()
  })

  it('clears the error when the input receives focus', async () => {
    initializeTestInstance(false, false, 'Error text')

    fireEvent.press(screen.getByTestId('comboBoxInput'))
    await waitFor(() => fireEvent.press(screen.getByRole('button', { name: t('close') })))

    expect(mockSetError).toHaveBeenCalledWith('')
  })

  it('does not open the modal when the ComboBox is disabled', () => {
    initializeTestInstance(true)

    fireEvent.press(screen.getByTestId('comboBoxInput'))

    expect(screen.queryByText('ComboBox Title')).toBeFalsy()
  })

  it('removes the selected value when the remove button is pressed', async () => {
    initializeTestInstance()

    fireEvent.press(screen.getByTestId('comboBoxRemoveID'))

    expect(mockOnSelectionChange).toHaveBeenCalledWith(undefined)
  })

  it('renders without the remove button when hideRemoveButton is true', () => {
    initializeTestInstance(false, true)

    expect(screen.queryByTestId('comboBoxRemoveID')).toBeFalsy()
  })
})
