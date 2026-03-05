import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { DebtRecord } from 'api/types'
import MakePaymentButton from 'screens/PaymentsScreen/Debts/MakePayment/MakePaymentButton'
import { context, render } from 'testUtils'

const mockNavigateTo = jest.fn()

jest.mock('utils/hooks', () => ({
  useTheme: () => ({
    dimensions: { buttonPadding: 2 },
  }),
  useRouteNavigation: () => mockNavigateTo,
}))

const mockDebt = {
  id: '1',
  type: 'debt',
  attributes: {
    deductionCode: '30',
    diaryCode: '600',
    benefitType: 'Compensation',
    currentAr: 123.45,
  },
} as DebtRecord

context('MakePaymentButton', () => {
  const initializeTestInstance = () => {
    render(<MakePaymentButton debt={mockDebt} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders button with correct label', () => {
    initializeTestInstance()

    expect(screen.getByRole('button', { name: t('debts.makePayment') })).toBeTruthy()
  })

  it('navigates to PayDebt with debt when pressed', () => {
    initializeTestInstance()

    fireEvent.press(screen.getByRole('button', { name: t('debts.makePayment') }))

    expect(mockNavigateTo).toHaveBeenCalledWith('PayDebt', { debt: mockDebt })
  })
})
