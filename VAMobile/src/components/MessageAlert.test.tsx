import React from 'react'
import { context, render, screen } from 'testUtils'
import { AlertBox, MessageAlert } from 'components'

context('MessageAlert', () => {

  const initializeTestInstance = ({
    hasValidationError,
    saveDraftAttempted,
    savingDraft,
  }: {
    hasValidationError?: boolean
    saveDraftAttempted?: boolean
    savingDraft?: boolean
    errorList?: { [key: number]: string }
  }): void => {
    render(<MessageAlert hasValidationError={hasValidationError} saveDraftAttempted={saveDraftAttempted} />)
  }

  it('displays save draft validation', async () => {
    initializeTestInstance({ hasValidationError: true, saveDraftAttempted: true })
    expect(screen.getByText('We need more information')).toBeTruthy()
    expect(screen.getByRole('header', { name: 'We need more information' })).toBeTruthy()
    expect(screen.getByText('To save this message, provide this information:')).toBeTruthy()
  })

  it('displays send validation', async () => {
    initializeTestInstance({ hasValidationError: true, saveDraftAttempted: false })
    expect(screen.getByText('We need more information')).toBeTruthy()
    expect(screen.getByRole('header', { name: 'We need more information' })).toBeTruthy()
    expect(screen.getByText('To send this message, provide this information:')).toBeTruthy()
  })
})
