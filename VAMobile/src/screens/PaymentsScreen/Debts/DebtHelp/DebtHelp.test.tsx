import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import DebtHelp, { debtHelpType } from 'screens/PaymentsScreen/Debts/DebtHelp/DebtHelp'
import { context, mockNavProps, render, waitFor } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

context('DebtHelp', () => {
  const initializeTestInstance = (helpType: debtHelpType) => {
    render(<DebtHelp {...mockNavProps(undefined, undefined, { params: { helpType } })} />)
  }

  it('renders the LargePanel with correct title and close button', async () => {
    initializeTestInstance('questionsAboutDebt')
    await waitFor(() => expect(screen.getByRole('header', { name: t('debts.help.title') })).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('close'))).toBeTruthy())
  })

  it('renders questionsAboutDebt with expected text', async () => {
    initializeTestInstance('questionsAboutDebt')
    await waitFor(() => expect(screen.getByText(t('debts.help.questions.body.1'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('debts.help.questions.body.2'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(displayedTextPhoneNumber(t('8008270648')))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(displayedTextPhoneNumber(t('16127136415')))).toBeTruthy())
  })

  it('renders whyDisabilityPensionDebt with expected text', async () => {
    initializeTestInstance('whyDisabilityPensionDebt')
    await waitFor(() => expect(screen.getByText(t('debts.help.why.header'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('debts.help.why.disabilityPension.body'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('debts.help.why.disabilityPension.bullet.1'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('debts.help.why.disabilityPension.bullet.2'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('debts.help.why.disabilityPension.bullet.3'))).toBeTruthy())
  })

  it('renders whyEducationDebt with expected text', async () => {
    initializeTestInstance('whyEducationDebt')
    await waitFor(() => expect(screen.getByText(t('debts.help.why.header'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('debts.help.why.education.body'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('debts.help.why.education.bullet.1'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('debts.help.why.education.bullet.2'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(t('debts.help.why.education.bullet.3'))).toBeTruthy())
  })
})
