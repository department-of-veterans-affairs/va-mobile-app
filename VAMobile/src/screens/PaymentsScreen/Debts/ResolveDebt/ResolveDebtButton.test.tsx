import React from 'react'

import { fireEvent } from '@testing-library/react-native'
import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { DebtRecord } from 'api/types'
import ResolveDebtButton from 'screens/PaymentsScreen/Debts/ResolveDebt/ResolveDebtButton'
import { context, render } from 'testUtils'

const mockShowActionSheetWithOptions = jest.fn()
jest.mock('utils/hooks', () => ({
  useTheme: () => ({
    dimensions: { buttonPadding: 2 },
  }),
  useRouteNavigation: () => jest.fn(),
  useShowActionSheet: () => mockShowActionSheetWithOptions,
}))

const mockDebt = {
  id: '1',
  type: 'debt',
  attributes: {
    deductionCode: '30',
    diaryCode: '71',
    benefitType: 'Compensation',
    currentAr: 123.45,
  },
} as DebtRecord

context('ResolveDebtButton', () => {
  const initializeTestInstance = () => {
    render(<ResolveDebtButton debt={mockDebt} />)
  }

  it('renders button with correct label', () => {
    initializeTestInstance()
    expect(screen.getByRole('button', { name: t('debts.resolveDebt') })).toBeTruthy()
  })

  it('calls showActionSheet with correct options when pressed', () => {
    initializeTestInstance()
    fireEvent.press(screen.getByRole('button', { name: t('debts.resolveDebt') }))
    expect(mockShowActionSheetWithOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        options: [
          t('debts.resolveDebt.payDebt'),
          t('debts.resolveDebt.requestHelp'),
          t('debts.resolveDebt.disputeDebt'),
          t('cancel'),
        ],
        title: t('debts.resolveDebt'),
        message: t('debts.resolveDebt.how'),
        cancelButtonIndex: 3,
      }),
      expect.any(Function),
    )
  })
})
