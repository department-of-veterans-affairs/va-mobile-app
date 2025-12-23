// EmptyStateMessage.test.tsx
import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import EmptyStateMessage from 'components/EmptyStateMessage'
import { context, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

context('EmptyStateMessage', () => {
  it('renders Copays empty state', () => {
    const title = t('copays.none.header')
    const body = t('copays.none.message')
    const phone = t('8664001238')

    render(<EmptyStateMessage title={title} body={body} phone={phone} />)

    expect(screen.getByRole('header', { name: title })).toBeTruthy()
    expect(screen.getByText(body)).toBeTruthy()
    expect(screen.getByText(displayedTextPhoneNumber(phone))).toBeTruthy()
  })

  it('renders Debts empty state', () => {
    const title = t('debts.empty.title')
    const body = t('debts.empty.body')
    const phone = t('8008270648')

    render(<EmptyStateMessage title={title} body={body} phone={phone} />)

    expect(screen.getByRole('header', { name: title })).toBeTruthy()
    expect(screen.getByText(body)).toBeTruthy()
    expect(screen.getByText(displayedTextPhoneNumber(phone))).toBeTruthy()
  })
})
