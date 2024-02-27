import React from 'react'

import { PaymentAccountData } from 'api/types'
import { DirectDepositErrors } from 'constants/errors'
import * as api from 'store/api'
import { context, fireEvent, mockNavProps, render, screen, waitFor, when } from 'testUtils'

import EditDirectDepositScreen from './EditDirectDepositScreen'

context('EditDirectDepositScreen', () => {
  const initializeTestInstance = () => {
    const props = mockNavProps(
      {},
      {
        goBack: jest.fn(),
        navigate: jest.fn(),
        addListener: jest.fn(),
      },
      { params: { displayTitle: 'Edit Direct Deposit' } },
    )

    render(<EditDirectDepositScreen {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when user enters a routing number', () => {
    it('should update the value of routingNumber', () => {
      fireEvent.changeText(screen.getByTestId('routingNumber'), '053100300')
      expect(screen.getByDisplayValue('053100300')).toBeTruthy()
    })
  })

  describe('when user enters an account number', () => {
    it('should update the value of accountNumber', () => {
      fireEvent.changeText(screen.getByTestId('accountNumber'), '12345678901234567')
      expect(screen.getByDisplayValue('12345678901234567')).toBeTruthy()
    })
  })

  describe('when user selects an account type', () => {
    it('should update the value of the accountType', () => {
      fireEvent.press(screen.getByTestId('accountType'))
      fireEvent.press(screen.getByText('Checking'))
      fireEvent.press(screen.getByText('Done'))
      expect(screen.getByText('Checking')).toBeTruthy()
    })
  })

  describe('when content is valid', () => {
    it('should call updateBankInfo when save is pressed', async () => {
      const bankData = {
        financialInstitutionRoutingNumber: '053100300',
        financialInstitutionName: 'Bank',
        accountNumber: '12345678901234567',
        accountType: 'Checking',
      } as PaymentAccountData
      fireEvent.changeText(screen.getByTestId('routingNumber'), '053100300')
      fireEvent.changeText(screen.getByTestId('accountNumber'), '12345678901234567')
      fireEvent.press(screen.getByTestId('accountType'))
      fireEvent.press(screen.getByText('Checking'))
      fireEvent.press(screen.getByText('Done'))
      fireEvent.press(screen.getByTestId('checkBox'))
      fireEvent.press(screen.getByText('Save'))
      when(api.put as jest.Mock)
        .calledWith(`/v0/payment-information/benefits`, bankData)
        .mockResolvedValue('success')
      expect(screen.getByText('Saving your direct deposit information...')).toBeTruthy()
      await waitFor(() => expect(api.put as jest.Mock).toBeCalledWith(`/v0/payment-information/benefits`, bankData))
    })
  })

  describe('when content is invalid', () => {
    it('should display an AlertBox and field errors', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Save' }))
      expect(screen.getByText('Check your direct deposit information')).toBeTruthy()
      expect(screen.getByText('Enter a 9-digit routing number')).toBeTruthy()
      expect(screen.getByText('Enter an account number')).toBeTruthy()
      expect(screen.getByText('Select an account type')).toBeTruthy()
      expect(screen.getByText('Select checkbox to confirm information')).toBeTruthy()
    })
  })

  describe('when invalidRoutingNumberError is true', () => {
    it('should show alert box', async () => {
      initializeTestInstance()
      const bankData = {
        financialInstitutionRoutingNumber: '053100300',
        financialInstitutionName: 'Bank',
        accountNumber: '12345678901234567',
        accountType: 'Checking',
      } as PaymentAccountData
      fireEvent.changeText(screen.getByTestId('routingNumber'), '053100300')
      fireEvent.changeText(screen.getByTestId('accountNumber'), '12345678901234567')
      fireEvent.press(screen.getByTestId('accountType'))
      fireEvent.press(screen.getByText('Checking'))
      fireEvent.press(screen.getByText('Done'))
      fireEvent.press(screen.getByTestId('checkBox'))
      fireEvent.press(screen.getByText('Save'))
      when(api.put as jest.Mock)
        .calledWith(`/v0/payment-information/benefits`, bankData)
        .mockRejectedValue({
          json: {
            errors: [
              {
                meta: {
                  messages: [
                    {
                      key: DirectDepositErrors.INVALID_ROUTING_NUMBER,
                    },
                  ],
                },
              },
            ],
          },
        })
      await waitFor(() =>
        expect(
          screen.getByText(
            "We couldn't find a bank linked to this routing number. Please check your bank's 9-digit routing number and enter again.",
          ),
        ).toBeTruthy(),
      )
    })
  })
})
