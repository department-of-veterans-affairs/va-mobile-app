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
    expect(screen.getByText("You can't access prescriptions right now")).toBeTruthy()
    expect(
      screen.getByText("We're sorry. This may be a temporary problem with our system. Try again later."),
    ).toBeTruthy()
    expect(
      screen.getByText(
        "If it still doesn't work, you may not have access to prescriptions. To access prescriptions, both of these must be true:",
      ),
    ).toBeTruthy()
    expect(screen.getByText("You're enrolled in VA health care, and")).toBeTruthy()
    expect(screen.getByText("You're registered as a patient at a VA health facility")).toBeTruthy()
    expect(
      screen.getByText(
        "If you’ve received care at a VA health facility, call the My HealtheVet help desk and let us know you're experiencing an issue with your My HealtheVet account ID. We're here Monday through Friday, 8:00 a.m. to 8:00 p.m. ET.",
      ),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: '877-327-0022' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
  })
})
