import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

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
    expect(screen.getByText(t('prescriptions.notAuthorized.warning'))).toBeTruthy()
    expect(screen.getByText(t('prescriptions.notAuthorized.systemProblem'))).toBeTruthy()
    expect(screen.getByText(t('prescriptions.notAuthorized.toAccess'))).toBeTruthy()
    expect(screen.getByText(t('prescriptions.notAuthorized.enrolled') + ' ' + t('and'))).toBeTruthy()
    expect(screen.getByText(t('prescriptions.notAuthorized.registered'))).toBeTruthy()
    expect(screen.getByText(t('prescriptions.notAuthorized.pleaseCall'))).toBeTruthy()
    expect(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8773270022')) })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
  })
})
