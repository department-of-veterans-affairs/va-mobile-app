import React from 'react'

import { MessageAlert } from 'components'
import { context, render, screen } from 'testUtils'

context('MessageAlert', () => {
  const initializeTestInstance = ({
    hasValidationError,
    saveDraftAttempted,
  }: {
    hasValidationError?: boolean
    saveDraftAttempted?: boolean
    errorList?: { [key: number]: string }
  }): void => {
    render(<MessageAlert hasValidationError={hasValidationError} saveDraftAttempted={saveDraftAttempted} />)
  }

  it('displays save draft validation', async () => {
    initializeTestInstance({ hasValidationError: true, saveDraftAttempted: true })
    expect(screen.getByText('We need more information')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'We need more information' })).toBeTruthy()
    expect(screen.getByText('To save this message, provide this information:')).toBeTruthy()
  })

  it('displays send validation', async () => {
    initializeTestInstance({ hasValidationError: true, saveDraftAttempted: false })
    expect(screen.getByText('We need more information')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'We need more information' })).toBeTruthy()
    expect(screen.getByText('To send this message, provide this information:')).toBeTruthy()
  })
})
