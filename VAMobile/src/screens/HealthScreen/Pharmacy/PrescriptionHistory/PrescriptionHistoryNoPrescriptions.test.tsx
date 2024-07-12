import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import PrescriptionHistoryNoPrescriptions from './PrescriptionHistoryNoPrescriptions'

const mockExternalLinkSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('PrescriptionHistoryNoPrescriptions', () => {
  it('initializes correctly', () => {
    render(<PrescriptionHistoryNoPrescriptions />)
    expect(screen.getByText("We can't find any VA prescriptions for you")).toBeTruthy()
    expect(screen.getByText('Your VA prescription list in the app won’t include:')).toBeTruthy()
    expect(screen.getByText('New prescriptions not yet processed by a VA pharmacy')).toBeTruthy()
    expect(screen.getByText('Prescriptions filled at non-VA pharmacies')).toBeTruthy()
    expect(screen.getByText('Prescriptions that are inactive for more than 180 days')).toBeTruthy()
    expect(screen.getByText('Medications administered at a clinic or ER')).toBeTruthy()
    expect(screen.getByText('Self-entered medications')).toBeTruthy()
    expect(
      screen.getByText(
        'If you think this is an error, or if you have questions about your VA prescriptions, please call the My HealtheVet help desk. We’re here Monday through Friday, 8:00 AM to 8:00 PM ET.',
      ),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: '877-327-0022' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
  })
})
