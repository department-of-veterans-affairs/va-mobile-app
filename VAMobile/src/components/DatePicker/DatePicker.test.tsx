import React from 'react'

import { t } from 'i18next'
import { DateTime } from 'luxon'

import DatePicker, { DatePickerProps } from 'components/DatePicker/DatePicker'
import { fireEvent, render, screen } from 'testUtils'

describe('DatePicker', () => {
  const mockOnApply = jest.fn()
  const mockOnReset = jest.fn()

  const initialDateRange = {
    startDate: DateTime.local(2025, 1, 1),
    endDate: DateTime.local(2025, 4, 1),
  }

  const initializeTestInstance = (): void => {
    const props: DatePickerProps = {
      labelKey: 'Select a date range',
      initialDateRange,
      onApply: mockOnApply,
      onReset: mockOnReset,
    }

    render(<DatePicker {...props} />)
  }

  it('renders the component with the correct label and date fields', () => {
    initializeTestInstance()

    expect(screen.getByText(t('pastAppointments.selectADateRange'))).toBeTruthy()
    expect(screen.getByRole('button', { name: t('Reset') })).toBeTruthy()
    expect(screen.getByText(t('datePicker.from'))).toBeTruthy()
    expect(screen.getByText(t('datePicker.to'))).toBeTruthy()
    expect(screen.getByText('January 01, 2025')).toBeTruthy()
    expect(screen.getByText('April 01, 2025')).toBeTruthy()
  })

  it('opens the "From" field when pressed and closes the "To" field', () => {
    initializeTestInstance()

    fireEvent.press(screen.getByTestId('datePickerFromFieldTestId'))

    expect(screen.getByTestId('datePickerFromFieldTestId-nativeCalendar')).toBeTruthy()
    expect(screen.queryByTestId('datePickerToFieldTestId-nativeCalendar')).toBeFalsy()
  })

  it('opens the "To" field when pressed and closes the "From" field', () => {
    initializeTestInstance()

    fireEvent.press(screen.getByTestId('datePickerToFieldTestId'))

    expect(screen.getByTestId('datePickerToFieldTestId-nativeCalendar')).toBeTruthy()
    expect(screen.queryByTestId('datePickerFromFieldTestId-nativeCalendar')).toBeNull()
  })

  it('updates the selected date label on the "From" field when the onDateChange event is received from the native date picker', () => {
    initializeTestInstance()

    fireEvent(screen.getByTestId('datePickerFromFieldTestId'), 'onDateChange', {
      nativeEvent: { date: '2024-10-01' },
    })

    expect(screen.getByText('October 01, 2024')).toBeTruthy()
  })

  it('updates the selected date label on the "To" field when the onDateChange event is received from the native date picker', () => {
    initializeTestInstance()

    fireEvent(screen.getByTestId('datePickerToFieldTestId'), 'onDateChange', {
      nativeEvent: { date: '2025-07-01' },
    })

    expect(screen.getByText('July 01, 2025')).toBeTruthy()
  })

  it('calls the onApply callback with the selected date range when the apply button is pressed', () => {
    initializeTestInstance()

    fireEvent.press(screen.getByText('Apply'))

    expect(mockOnApply).toHaveBeenCalledWith(initialDateRange, true)
  })

  it('calls the onReset callback and closes the fields the reset button is pressed', () => {
    initializeTestInstance()

    fireEvent.press(screen.getByText('Reset'))

    expect(mockOnReset).toHaveBeenCalled()
    expect(screen.queryByTestId('datePickerFromFieldTestId-nativeCalendar')).toBeNull()
    expect(screen.queryByTestId('datePickerToFieldTestId-nativeCalendar')).toBeNull()
  })
})
