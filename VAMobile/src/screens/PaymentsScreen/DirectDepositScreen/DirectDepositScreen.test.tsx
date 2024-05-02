import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { directDepositKeys } from 'api/directDeposit'
import { DirectDepositData } from 'api/types'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, waitFor, when } from 'testUtils'

import DirectDepositScreen from './index'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native')
  return {
    ...original,
    useFocusEffect: () => jest.fn(),
  }
})

const mockData: DirectDepositData = {
  data: {
    type: 'checking',
    id: '1',
    attributes: {
      paymentAccount: {
        accountNumber: '******1234',
        accountType: 'Savings',
        financialInstitutionName: 'BoA',
        financialInstitutionRoutingNumber: '12341234123',
      },
    },
  },
}

const noData = {
  data: {
    type: null,
    id: null,
    attributes: {
      paymentAccount: {
        accountNumber: null,
        accountType: null,
        financialInstitutionName: null,
        financialInstitutionRoutingNumber: null,
      },
    },
  },
}

context('DirectDepositScreen', () => {
  const initializeTestInstance = (data?: DirectDepositData) => {
    const queriesData: QueriesData = [
      {
        queryKey: directDepositKeys.directDeposit,
        data: data,
      },
    ]
    render(<DirectDepositScreen {...mockNavProps()} />, { queriesData: queriesData })
  }

  describe('when there is bank data', () => {
    it('should display the button with the given bank data and call navigation anvigate when info is clicked', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/payment-information/benefits')
        .mockResolvedValue(mockData)
      initializeTestInstance(mockData)
      await waitFor(() => expect(screen.getByText('Account')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('BoA')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('******1234')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Savings account')).toBeTruthy())
      await waitFor(() => fireEvent.press(screen.getByTestId('account-boa-******1234-savings-account')))
      await waitFor(() =>
        expect(mockNavigationSpy).toBeCalledWith('EditDirectDeposit', { displayTitle: 'Edit account' }),
      )
    })
  })

  describe('when there is no bank data', () => {
    it('should render the button with the text Add your bank account information', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/payment-information/benefits')
        .mockResolvedValue(noData)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText('Add your bank account information')).toBeTruthy())
    })
  })

  describe('when common error occurs', () => {
    it('should render error component', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/payment-information/benefits')
        .mockRejectedValue({ networkError: true } as api.APIError)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('header', { name: "The app can't be loaded." })).toBeTruthy())
    })
  })
})
