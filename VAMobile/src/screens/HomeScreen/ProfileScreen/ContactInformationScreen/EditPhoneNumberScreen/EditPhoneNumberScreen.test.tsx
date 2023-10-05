import React from 'react'
import { fireEvent, screen, waitFor } from '@testing-library/react-native'

import { mockNavProps, render } from 'testUtils'
import EditPhoneNumberScreen from './EditPhoneNumberScreen'
import { PhoneData, PhoneType } from 'api/types'

describe('EditPhoneNumberScreen', () => {
  let props: any
  const phoneType: PhoneType = 'HOME'
  const phoneData: PhoneData = {
    id: 0,
    areaCode: '858',
    phoneNumber: '1234567',
    countryCode: '1',
    phoneType
  }

  const renderWithData = (data?: PhoneData) => {
    props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        goBack: jest.fn(),
        addListener: jest.fn(),
      },
      {
        params: {
          displayTitle: 'Home phone',
          phoneData,
          ...data
        },
      },
    )
    

    render(<EditPhoneNumberScreen {...props} />)
  }

  beforeEach(() => {
    renderWithData()
  })

  describe('when the phone number exists', () => {
    it('displays the remove button', () => {
      renderWithData()
      expect(screen.getByRole('button', { name: 'Remove home phone' })).toBeTruthy()
    })
  })

  describe('Phone number text input', () => {
    describe('when the length is less than or equal to 10 digits', () => {
      it('displays just the numbers in the text input', () => {
        const phoneNumberInput = screen.getByTestId('phoneNumberTestID')

        fireEvent.changeText(phoneNumberInput, '12345')
        phoneNumberInput.props.onEndEditing()
        expect(phoneNumberInput.props.value).toBe('12345')
      })
    })

    describe('when the new text is greater than 10 digits', () => {
      it('does not update phoneNumber to the new value', () => {
        const phoneNumberInput = screen.getByTestId('phoneNumberTestID')

        expect(phoneNumberInput.props.value).toBe('858-123-4567')
        fireEvent.changeText(phoneNumberInput, '123456789011')
        phoneNumberInput.props.onEndEditing()
        expect(phoneNumberInput.props.value).toBe('858-123-4567')
      })
    })

    describe('when there are 10 digits', () => {
      it('sets the value of the input to the formatted number', () => {
        const phoneNumberInput = screen.getByTestId('phoneNumberTestID')

        fireEvent.changeText(phoneNumberInput, '1234567890')
        phoneNumberInput.props.onEndEditing()
        expect(phoneNumberInput.props.value).toBe('123-456-7890')
      })
    })
  })

  describe('when the phone number is saved', () => {
    it('navigates back to the previous screen', async () => {
      fireEvent.press((screen.getByRole('button', { name: 'Save' })))
      await waitFor(() => expect(props.navigation.goBack).toBeCalled())
    })
  })

  describe('when the number input is invalid', () => {
    it('displays an error AlertBox and a field error', () => {
      const phoneNumberInput = screen.getByTestId('phoneNumberTestID')

      fireEvent.changeText(phoneNumberInput, '')
      fireEvent.press((screen.getByRole('button', { name: 'Save' })))
      expect(screen.getByText('Check your phone number')).toBeTruthy()
      expect(screen.getByText('Enter a valid phone number')).toBeTruthy()
    })
  })
})
