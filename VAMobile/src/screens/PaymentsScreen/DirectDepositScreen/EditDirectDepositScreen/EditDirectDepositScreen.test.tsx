import React from 'react'

import { StackScreenProps } from '@react-navigation/stack'

import { RootNavStackParamList } from 'App'

import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { initialDirectDepositState, updateBankInfo } from 'store/slices'
import { context, fireEvent, mockNavProps, render, screen } from 'testUtils'

import EditDirectDepositScreen from './EditDirectDepositScreen'

jest.mock('store/slices', () => {
  const actual = jest.requireActual('store/slices')
  return {
    ...actual,
    updateBankInfo: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    finishEditBankInfo: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('EditDirectDepositScreen', () => {
  let props: StackScreenProps<RootNavStackParamList, 'EditDirectDeposit'>

  const initializeTestInstance = (saving = false, bankInfoUpdated = false, invalidRoutingNumberError = false) => {
    props = mockNavProps(
      {},
      {
        goBack: jest.fn(),
        navigate: jest.fn(),
        addListener: jest.fn(),
      },
      { params: { displayTitle: 'Edit Direct Deposit' } },
    )

    render(<EditDirectDepositScreen {...props} />, {
      preloadedState: {
        directDeposit: {
          ...initialDirectDepositState,
          saving,
          bankInfoUpdated: bankInfoUpdated,
          invalidRoutingNumberError: invalidRoutingNumberError,
        },
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when saving is set to true', () => {
    it('should show loading screen', () => {
      initializeTestInstance(true)
      expect(screen.getByText('Saving your direct deposit information...')).toBeTruthy()
    })
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
    it('should call updateBankInfo when save is pressed', () => {
      fireEvent.changeText(screen.getByTestId('routingNumber'), '053100300')
      fireEvent.changeText(screen.getByTestId('accountNumber'), '12345678901234567')
      fireEvent.press(screen.getByTestId('accountType'))
      fireEvent.press(screen.getByText('Checking'))
      fireEvent.press(screen.getByText('Done'))
      fireEvent.press(screen.getByTestId('checkBox'))
      fireEvent.press(screen.getByText('Save'))
      expect(updateBankInfo).toBeCalledWith(
        '12345678901234567',
        '053100300',
        'Checking',
        { errorMsg: 'Direct deposit information could not be saved', successMsg: 'Direct deposit information saved' },
        ScreenIDTypesConstants.EDIT_DIRECT_DEPOSIT_SCREEN_ID,
      )
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

  describe('when bankInfoUpdated is true', () => {
    it('should call navigations go back function', () => {
      initializeTestInstance(false, true)
      expect(props.navigation.goBack).toBeCalled()
    })
  })

  describe('when invalidRoutingNumberError is true', () => {
    it('should show alert box', () => {
      initializeTestInstance(false, true, true)
      expect(
        screen.getByText(
          "We couldn't find a bank linked to this routing number. Please check your bank's 9-digit routing number and enter again.",
        ),
      ).toBeTruthy()
    })
  })
})
