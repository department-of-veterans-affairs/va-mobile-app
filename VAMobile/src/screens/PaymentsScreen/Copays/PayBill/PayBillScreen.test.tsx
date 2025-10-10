import React from 'react'

import { __mockSnackbar as __mockSnackbarMock } from '@department-of-veterans-affairs/mobile-component-library'
import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import PayBillScreen from 'screens/PaymentsScreen/Copays/PayBill/PayBillScreen'
import { context, mockNavProps, render, waitFor, within } from 'testUtils'

// TODO: Add mock for @react-native-clipboard/clipboard after merge
// jest.mock('@react-native-clipboard/clipboard', () => ({
//   setString: jest.fn(),
// }))

jest.mock('utils/env', () => () => ({
  LINK_URL_ASK_VA_GOV: 'https://pay.gov',
}))

jest.mock('utils/copays', () => {
  const original = jest.requireActual('utils/copays')
  return {
    ...original,
    getMedicalCenterNameByID: (id: string) => (id ? `Facility ${id}` : ''),
  }
})

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
  export const __mockSnackbar: { show: jest.Mock }
}

context('PayBillScreen (copays) – render, copy snackbars, directions link', () => {
  const baseCopay = {
    id: 'cp-1',
    pHAmtDue: 251.5,
    accountNumber: 'ABC-1234-5678-ABCDE-XYZ',
    station: {
      facilitYNum: '673',
      facilitYDesc: 'Fallback Facility',
      staTAddress1: '13000 Bruce B Downs Blvd',
      staTAddress2: '',
      staTAddress3: '',
      city: 'Tampa',
      state: 'FL',
      ziPCde: '33612',
    },
  }

  const renderWithCopay = (overrides?: Partial<typeof baseCopay>) => {
    const route = {
      params: {
        copay: { ...baseCopay, ...(overrides || {}) },
      },
    }
    render(<PayBillScreen {...mockNavProps({ route })} />)
  }

  const expectSnack = (msg: string) => {
    const last = __mockSnackbarMock.show.mock.calls.at(-1)
    expect(last?.[0]).toBe(msg)
  }

  beforeEach(() => {
    __mockSnackbarMock.show.mockClear()
  })

  it('renders labels and formatted values; splits account parts 1–5', async () => {
    renderWithCopay()

    expect(screen.getByText(t('copays.payBill.intro'))).toBeTruthy()
    expect(screen.getByText(t('copays.payBill.currentBalance'))).toBeTruthy()
    expect(screen.getByText(t('copays.payBill.part1'))).toBeTruthy()
    expect(screen.getByText(t('copays.payBill.part2'))).toBeTruthy()
    expect(screen.getByText(t('copays.payBill.part3'))).toBeTruthy()
    expect(screen.getByText(t('copays.payBill.part4'))).toBeTruthy()
    expect(screen.getByText(t('copays.payBill.part5'))).toBeTruthy()

    await waitFor(() => expect(screen.getByText('$251.50')).toBeTruthy())

    expect(screen.getByTestId('row-copay-part1-value').props.children).toBe('ABC')
    expect(screen.getByTestId('row-copay-part2-value').props.children).toBe('1234')
    expect(screen.getByTestId('row-copay-part3-value').props.children).toBe('5678')
    expect(screen.getByTestId('row-copay-part4-value').props.children).toBe('ABCDE')
    expect(screen.getByTestId('row-copay-part5-value').props.children).toBe('XYZ')

    expect(screen.getByTestId('payOnVAGovID')).toBeTruthy()
  })

  it('shows snackbars "<label> copied" for balance and non-empty parts', async () => {
    renderWithCopay()

    fireEvent.press(screen.getByTestId('row-copay-current-balance-copy'))
    expectSnack(`${t('copays.payBill.currentBalance')} copied`)

    fireEvent.press(screen.getByTestId('row-copay-part1-copy'))
    expectSnack(`${t('copays.payBill.part1')} copied`)

    fireEvent.press(screen.getByTestId('row-copay-part3-copy'))
    expectSnack(`${t('copays.payBill.part3')} copied`)
  })

  it('renders directions link when full address exists (and hides when missing)', async () => {
    renderWithCopay()
    const accordion = await screen.findByTestId('accordion-copay-pay-in-person')
    const header = within(accordion).getByRole('tab')
    fireEvent.press(header)

    expect(await screen.findByTestId('copay-in-person-directions')).toBeTruthy()

    __mockSnackbarMock.show.mockClear()
    const noAddr = {
      ...baseCopay,
      station: {
        facilitYNum: '673',
        facilitYDesc: 'Fallback Facility',
        staTAddress1: '',
        city: '',
        state: '',
        ziPCde: '',
      },
    }
    const route2 = { params: { copay: noAddr } }
    render(<PayBillScreen {...mockNavProps({ route: route2 })} />)
    expect(screen.queryByTestId('copay-in-person-directions')).toBeNull()
  })

  it('handles empty account number: shows dashes and no copy buttons for empty parts', async () => {
    renderWithCopay({ accountNumber: '' })

    expect(screen.getByTestId('row-copay-part1-value').props.children).toBe('—')
    expect(screen.getByTestId('row-copay-part2-value').props.children).toBe('—')
    expect(screen.getByTestId('row-copay-part3-value').props.children).toBe('—')
    expect(screen.getByTestId('row-copay-part4-value').props.children).toBe('—')
    expect(screen.getByTestId('row-copay-part5-value').props.children).toBe('—')

    expect(screen.queryByTestId('row-copay-part1-copy')).toBeNull()
    expect(screen.queryByTestId('row-copay-part2-copy')).toBeNull()
    expect(screen.queryByTestId('row-copay-part3-copy')).toBeNull()
    expect(screen.queryByTestId('row-copay-part4-copy')).toBeNull()
    expect(screen.queryByTestId('row-copay-part5-copy')).toBeNull()
  })
})
