import React from 'react'
import { Keyboard, KeyboardEventListener } from 'react-native'

import { t } from 'i18next'

import ComboBox from 'components/FormWrapper/FormFields/ComboBox/ComboBox'
import { ComboBoxOptions } from 'components/FormWrapper/FormFields/ComboBox/ComboBoxInput'
import { fireEvent, render, screen, waitFor } from 'testUtils'

const mockOnSelectionChange = jest.fn()
const mockOnClose = jest.fn()

let listeners: Record<string, KeyboardEventListener> = {}

// @ts-expect-error mock EmitterSubscription
jest.spyOn(Keyboard, 'addListener').mockImplementation((event, callback) => {
  listeners[event] = callback
  return { remove: jest.fn() }
})

// @ts-expect-error mock KeyboardMetrics
jest.spyOn(Keyboard, 'metrics').mockReturnValue({
  height: 300,
})

const defaultComboBoxOptions = {
  Group1: [
    { value: '1', label: 'Label1' },
    { value: '2', label: 'Label2' },
  ],
  Group2: [
    { value: '3', label: 'Label3' },
    { value: '4', label: 'Label4' },
  ],
}

const comboBoxOptionsLong: ComboBoxOptions = {
  Group1: Array.from({ length: 30 }, (_, i) => ({
    value: `${i + 1}`,
    label: `Label${i + 1}`,
  })),
}

describe('ComboBox Component', () => {
  const initializeTestInstance = (
    virtualized?: boolean,
    hideGroupsHeaders?: boolean,
    comboBoxOptions?: ComboBoxOptions,
  ): void => {
    render(
      <ComboBox
        titleKey="Select an Item"
        comboBoxOptions={comboBoxOptions || defaultComboBoxOptions}
        onSelectionChange={mockOnSelectionChange}
        onClose={mockOnClose}
        virtualized={virtualized}
        hideGroupsHeaders={hideGroupsHeaders}
      />,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
    listeners = {}
  })

  it('renders the ComboBox with the correct title', () => {
    initializeTestInstance()

    expect(screen.getByText('Select an Item')).toBeTruthy()
  })

  it('renders all groups and items', () => {
    initializeTestInstance()

    expect(screen.getByText('Group1')).toBeTruthy()
    expect(screen.getByText('Group2')).toBeTruthy()

    expect(screen.getByRole('button', { name: 'Label1' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Label2' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Label3' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Label4' })).toBeTruthy()
  })

  it('does not render group if no items are provided', () => {
    initializeTestInstance(false, false, {
      Group1: [],
      Group2: [
        { value: '3', label: 'Label3' },
        { value: '4', label: 'Label4' },
      ],
    })

    expect(screen.queryByText('Group1')).toBeFalsy()
    expect(screen.getByText('Group2')).toBeTruthy()
  })

  it('filters items based on input', () => {
    initializeTestInstance()

    // Simulate typing 'label1' into TextInput
    fireEvent.changeText(screen.getByTestId('comboBoxTextInputID'), 'label1')

    // Check that only matching items are displayed
    expect(screen.getByRole('button', { name: 'Label1' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Label2' })).toBeFalsy()
    expect(screen.queryByRole('button', { name: 'Label3' })).toBeFalsy()
    expect(screen.queryByRole('button', { name: 'Label4' })).toBeFalsy()
  })

  it('calls onSelectionChange and onClose when an item is selected', () => {
    initializeTestInstance()

    fireEvent.press(screen.getByRole('button', { name: 'Label1' }))

    expect(mockOnSelectionChange).toHaveBeenCalledWith({ value: '1', label: 'Label1' })
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('closes the ComboBox when the close button is pressed', () => {
    initializeTestInstance()

    fireEvent.press(screen.getByRole('button', { name: t('close') }))

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should set padding on ScrollView when keyboard opens', async () => {
    initializeTestInstance()

    // Simulate the keyboardWillShow event
    listeners.keyboardWillShow({
      duration: 0,
      easing: 'linear',
      endCoordinates: { height: 300, width: 0, screenX: 0, screenY: 0 },
    })

    // Verify that padding on ScrollView is properly set
    const scrollView = screen.getByTestId('comboBoxScrollViewID')
    await waitFor(() => expect(scrollView.props.contentContainerStyle.paddingBottom).toBe(300))
  })

  it('renders without group headers when hideGroupsHeaders is true', () => {
    initializeTestInstance(false, true)

    expect(screen.queryByText('Group1')).toBeFalsy()
    expect(screen.queryByText('Group2')).toBeFalsy()

    expect(screen.getByRole('button', { name: 'Label1' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Label2' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Label3' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Label4' })).toBeTruthy()
  })

  it('renders virtualized list when virtualized is true', () => {
    // Generate a long list of options
    initializeTestInstance(true, true, comboBoxOptionsLong)

    // Verify that only part of the options list is rendered
    expect(screen.getByRole('button', { name: 'Label1' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Label2' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Label3' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Label4' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Label30' })).toBeFalsy()
  })

  it('calls onSelectionChange and onClose when an item is selected in virtualized list', () => {
    initializeTestInstance(true, false, comboBoxOptionsLong)

    fireEvent.press(screen.getByRole('button', { name: 'Label1' }))

    expect(mockOnSelectionChange).toHaveBeenCalledWith({ value: '1', label: 'Label1' })
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('renders virtualized list without group headers when hideGroupsHeaders is true', () => {
    initializeTestInstance(true, true, comboBoxOptionsLong)

    expect(screen.queryByText('Group1')).toBeFalsy()

    expect(screen.getByRole('button', { name: 'Label1' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Label2' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Label3' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Label4' })).toBeTruthy()
  })
})
