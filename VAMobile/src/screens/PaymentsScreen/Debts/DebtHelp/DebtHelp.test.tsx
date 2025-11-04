import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import DebtHelp from 'screens/PaymentsScreen/Debts/DebtHelp/DebtHelp'
import { context, mockNavProps, render, waitFor } from 'testUtils'

context('DebtHelp', () => {
  const initializeTestInstance = () => {
    render(<DebtHelp {...mockNavProps()} />)
  }

  it('renders the LargePanel with correct title and close button', async () => {
    initializeTestInstance()
    await waitFor(() => expect(screen.getByRole('header', { name: t('debts.help.title') })).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('close'))).toBeTruthy())
  })

  it('renders the Trans component with expected text', async () => {
    initializeTestInstance()
    // Extract text content between all tags into an array
    const texts = Array.from(t('debts.help.questions').matchAll(/>([^<]+)</g), (m) => (m as RegExpMatchArray)[1].trim())
    for (const text of texts) {
      await waitFor(() => expect(screen.getByText(text)).toBeTruthy())
    }
  })
})
