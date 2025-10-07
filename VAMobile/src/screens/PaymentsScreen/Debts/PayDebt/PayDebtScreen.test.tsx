import React from 'react'

import { __mockSnackbar as __mockSnackbarMock } from '@department-of-veterans-affairs/mobile-component-library'
import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import PayDebtScreen from 'screens/PaymentsScreen/Debts/PayDebt/PayDebtScreen'
import { context, mockNavProps, render, waitFor } from 'testUtils'

jest.mock('@department-of-veterans-affairs/mobile-component-library', () => {
  const original = jest.requireActual('@department-of-veterans-affairs/mobile-component-library')
  const mockShow = jest.fn()
  return {
    ...original,
    useSnackbar: () => ({ show: mockShow }),
    __mockSnackbar: { show: mockShow },
  }
})

declare module '@department-of-veterans-affairs/mobile-component-library' {
  // test-only export from our jest.mock factory
  export const __mockSnackbar: { show: jest.Mock }
}

context('PayDebtScreen (data render + copy snackbars)', () => {
  const baseDebt = {
    id: '1',
    type: 'debt',
    attributes: {
      currentAr: 830,
      fileNumber: 'FN-12345678',
      payeeNumber: 'PN-99',
      personEntitled: 'J Q PUBLIC',
      deductionCode: '30',
    },
  }

  const renderWithDebt = (overrides?: Partial<typeof baseDebt.attributes>) => {
    const route = {
      params: {
        debt: { ...baseDebt, attributes: { ...baseDebt.attributes, ...(overrides || {}) } },
      },
    }
    render(<PayDebtScreen {...mockNavProps({ route })} />)
  }

  const expectSnack = (msg: string) => {
    const last = __mockSnackbarMock.show.mock.calls.at(-1)
    expect(last?.[0]).toBe(msg)
  }

  beforeEach(() => {
    __mockSnackbarMock.show.mockClear()
  })

  it('renders labels and formatted values from debt', async () => {
    renderWithDebt()

    expect(screen.getByText(t('debts.payDebt.intro'))).toBeTruthy()
    expect(screen.getByText(t('debts.payDebt.currentBalance'))).toBeTruthy()
    expect(screen.getByText(t('debts.payDebt.fileNumber'))).toBeTruthy()
    expect(screen.getByText(t('debts.payDebt.payeeNumber'))).toBeTruthy()
    expect(screen.getByText(t('debts.payDebt.personEntitled'))).toBeTruthy()
    expect(screen.getByText(t('debts.payDebt.deductionCode'))).toBeTruthy()

    await waitFor(() => expect(screen.getByText('$830.00')).toBeTruthy())
    expect(screen.getByText('FN-12345678')).toBeTruthy()
    expect(screen.getByText('PN-99')).toBeTruthy()
    expect(screen.getByText('J Q PUBLIC')).toBeTruthy()
    expect(screen.getByText('30')).toBeTruthy()
  })

  it('shows snackbars with "<label> copied" when copy is pressed (balance, file, payee, person)', async () => {
    renderWithDebt()

    fireEvent.press(screen.getByTestId('row-current-balance-copy'))
    expectSnack(`${t('debts.payDebt.currentBalance')} copied`)

    fireEvent.press(screen.getByTestId('row-file-number-copy'))
    expectSnack(`${t('debts.payDebt.fileNumber')} copied`)

    fireEvent.press(screen.getByTestId('row-payee-number-copy'))
    expectSnack(`${t('debts.payDebt.payeeNumber')} copied`)

    fireEvent.press(screen.getByTestId('row-person-entitled-copy'))
    expectSnack(`${t('debts.payDebt.personEntitled')} copied`)
  })

  it('handles empty values: renders dashes and only balance is copyable', async () => {
    renderWithDebt({
      currentAr: 0,
      fileNumber: '',
      payeeNumber: '',
      personEntitled: '',
      deductionCode: '',
    })

    await waitFor(() => expect(screen.getByText('$0.00')).toBeTruthy())
    expect(screen.getByTestId('row-file-number-value').props.children).toBe('—')
    expect(screen.getByTestId('row-payee-number-value').props.children).toBe('—')
    expect(screen.getByTestId('row-person-entitled-value').props.children).toBe('—')

    fireEvent.press(screen.getByTestId('row-current-balance-copy'))
    expectSnack(`${t('debts.payDebt.currentBalance')} copied`)

    // Ensure non-balance rows are not copyable when empty
    expect(screen.queryByTestId('row-file-number-copy')).toBeNull()
    expect(screen.queryByTestId('row-payee-number-copy')).toBeNull()
    expect(screen.queryByTestId('row-person-entitled-copy')).toBeNull()
  })
})
