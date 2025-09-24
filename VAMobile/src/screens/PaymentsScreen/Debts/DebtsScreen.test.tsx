import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { DebtRecord } from 'api/types/DebtData'
import DebtsScreen from 'screens/PaymentsScreen/Debts/DebtsScreen'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

const mockNavigationSpy = jest.fn()

const mockShowActionSheetWithOptions = jest.fn()
jest.mock('@expo/react-native-action-sheet', () => {
  const original = jest.requireActual('@expo/react-native-action-sheet')
  return {
    ...original,
    useActionSheet: () => {
      return { showActionSheetWithOptions: mockShowActionSheetWithOptions }
    },
  }
})

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const debtsDataMock = {
  data: [
    {
      id: '1',
      type: 'debt',
      attributes: {
        deductionCode: '30',
        diaryCode: '71',
        benefitType: 'Compensation',
        currentAr: 123.45,
      },
    },
    {
      id: '2',
      type: 'debt',
      attributes: {
        deductionCode: '73',
        diaryCode: '655',
        benefitType: 'Education',
        currentAr: 678.9,
      },
    },
  ] as DebtRecord[],
}

const emptyDebtsMock = {
  data: [],
}

context('DebtsScreen', () => {
  const initializeTestInstance = () => {
    render(<DebtsScreen {...mockNavProps()} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initializes correctly', () => {
    it('should show the debts and review details link', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/debts')
        .mockResolvedValue(debtsDataMock)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('header', { name: t('debts.title') })).toBeTruthy())
      // Check for the first debt's header, summary text and balance
      await waitFor(() => expect(screen.getByText(t('debts.deductionCode.chapter33'))).toBeTruthy())
      await waitFor(() => expect(screen.getByText(t('debts.summary.verifyMilitaryStatus'))).toBeTruthy())
      await waitFor(() => expect(screen.getByText(/\$123\.45/)).toBeTruthy())
      // Check for the review details link
      await waitFor(() => expect(screen.getAllByText(t('debts.reviewDetails'))[0]).toBeTruthy())
    })

    it('should show resolve debt button and action sheet when pressed', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/debts')
        .mockResolvedValue(debtsDataMock)
      initializeTestInstance()
      const allButtons = await screen.findAllByRole('button', { name: t('debts.resolveDebt') })
      const resolveDebtButton = allButtons[0]
      expect(resolveDebtButton).toBeTruthy()
      fireEvent.press(resolveDebtButton)
      expect(mockShowActionSheetWithOptions).toHaveBeenCalled()
    })

    it('should navigate to DebtHelp when help button is pressed', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/debts')
        .mockResolvedValue(debtsDataMock)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('header', { name: t('debts.title') })).toBeTruthy())
      fireEvent.press(screen.getByTestId('debtHelpID'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('DebtHelp')
    })

    it('should navigate to DebtDetails when review details is pressed', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/debts')
        .mockResolvedValue(debtsDataMock)
      initializeTestInstance()
      await waitFor(() => expect(screen.getAllByText(t('debts.reviewDetails'))[0]).toBeTruthy())
      fireEvent.press(screen.getAllByText(t('debts.reviewDetails'))[0])
      expect(mockNavigationSpy).toHaveBeenCalledWith('DebtDetails', { debt: debtsDataMock.data[0] })
    })

    describe('When there are no debts', () => {
      it('should display the no debts message and phone number', async () => {
        when(api.get as jest.Mock)
          .calledWith('/v0/debts')
          .mockResolvedValue(emptyDebtsMock)
        initializeTestInstance()
        await waitFor(() => expect(screen.getByText(t('debts.none.header'))).toBeTruthy())
        await waitFor(() => expect(screen.getByText(t('debts.none.message'))).toBeTruthy())
        await waitFor(() => expect(screen.getByText(displayedTextPhoneNumber(t('8008270648')))).toBeTruthy())
      })
    })

    describe('When there is a service error', () => {
      it('should display the error alert and phone number', async () => {
        when(api.get as jest.Mock)
          .calledWith('/v0/debts')
          .mockRejectedValue(new Error('Service error'))
        initializeTestInstance()
        await waitFor(() => expect(screen.getByText(t('debts.error.header'))).toBeTruthy())
        await waitFor(() => expect(screen.getByText(t('debts.error.description'))).toBeTruthy())
        await waitFor(() => expect(screen.getByText(displayedTextPhoneNumber(t('8008270648')))).toBeTruthy())
      })
    })
  })
})
