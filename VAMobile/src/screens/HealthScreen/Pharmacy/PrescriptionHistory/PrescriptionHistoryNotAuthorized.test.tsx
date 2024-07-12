import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import PrescriptionHistoryNotAuthorized from './PrescriptionHistoryNotAuthorized'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('PrescriptionHistoryNotAuthorized', () => {
  it('initializes correctly', () => {
    render(<PrescriptionHistoryNotAuthorized />)
    expect(screen.getByText("You can't access your VA prescriptions")).toBeTruthy()
    expect(
      screen.getByText('To access your VA prescriptions, upgrade your My HealtheVet account to a Premium account.'),
    ).toBeTruthy()
    expect(screen.getByText('To upgrade, you must meet these requirements:')).toBeTruthy()
    expect(screen.getByText("You're enrolled in VA health care, and")).toBeTruthy()
    expect(screen.getByText("You're registered as a patient at a VA health facility.")).toBeTruthy()
    expect(screen.getByText('Learn how to upgrade to a My HealtheVet Premium account')).toBeTruthy()
    expect(
      screen.getByText(
        'If you need help, please call the My HealtheVet help desk. We’re here Monday through Friday, 8:00 AM to 8:00 PM ET.',
      ),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: '877-327-0022' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
  })
})
