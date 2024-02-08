import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'

import { contactInformationKeys } from 'api/contactInformation/queryKeys'
import { put } from 'store/api'
import { QueriesData, mockNavProps, render, when } from 'testUtils'

import EditEmailScreen from './EditEmailScreen'

describe('EditEmailScreen', () => {
  let onBackSpy: jest.Mock

  const renderWithOptions = (queriesData?: QueriesData) => {
    onBackSpy = jest.fn(() => {})

    const props = mockNavProps(
      {},
      {
        addListener: jest.fn(),
        navigate: jest.fn(),
        goBack: onBackSpy,
      },
    )

    render(<EditEmailScreen {...props} />, { queriesData })
  }

  beforeEach(() => {
    renderWithOptions()
  })

  describe('when an email exists', () => {
    it('initializes the text input with the current email', () => {
      renderWithOptions([
        {
          queryKey: contactInformationKeys.contactInformation,
          data: {
            contactEmail: {
              id: '0',
              emailAddress: 'my@email.com',
            },
          },
        },
      ])

      expect(screen.getByDisplayValue('my@email.com')).toBeTruthy()
    })
  })

  describe('when the email is saved', () => {
    it('navigates back to the previous screen', async () => {
      fireEvent.changeText(screen.getByTestId('emailAddressEditTestID'), 'my@email.com')
      fireEvent.press(screen.getByRole('button', { name: 'Save' }))
      await waitFor(() => expect(onBackSpy).toHaveBeenCalled())
    })
  })

  describe('when the email does not have an @ followed by text on save', () => {
    it('displays an AlertBox and field error', () => {
      fireEvent.changeText(screen.getByTestId('emailAddressEditTestID'), 'myemail')
      fireEvent.press(screen.getByRole('button', { name: 'Save' }))
      expect(screen.getByText('Check your email address')).toBeTruthy()
      expect(screen.getByText('Enter your email address again using this format: X@X.com')).toBeTruthy()
    })
  })

  describe('when the email input is empty on save', () => {
    it('displays an AlertBox and field error', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Save' }))
      expect(screen.getByText('Check your email address')).toBeTruthy()
      expect(screen.getByText('Enter your email address again using this format: X@X.com')).toBeTruthy()
    })
  })

  describe('when the save button is pressed for a valid email', () => {
    it('submits a PUT request', async () => {
      renderWithOptions([
        {
          queryKey: contactInformationKeys.contactInformation,
          data: {
            contactEmail: {
              id: '0',
              emailAddress: 'my@email.com',
            },
          },
        },
      ])

      const updatedEmail = 'my@newemail.com'
      const payload = { id: '0', emailAddress: updatedEmail }
      when(put as jest.Mock)
        .calledWith('/v0/user/emails', payload)
        .mockResolvedValue({})

      fireEvent.changeText(screen.getByTestId('emailAddressEditTestID'), updatedEmail)
      fireEvent.press(screen.getByRole('button', { name: 'Save' }))
      await waitFor(() => expect(put as jest.Mock).toBeCalledWith('/v0/user/emails', payload))
    })
  })

  describe('when there is an existing email', () => {
    it('displays the remove button', () => {
      renderWithOptions([
        {
          queryKey: contactInformationKeys.contactInformation,
          data: {
            contactEmail: {
              id: '0',
              emailAddress: 'my@email.com',
            },
          },
        },
      ])

      expect(screen.getByRole('button', { name: 'Remove email address' })).toBeTruthy()
    })
  })
})
