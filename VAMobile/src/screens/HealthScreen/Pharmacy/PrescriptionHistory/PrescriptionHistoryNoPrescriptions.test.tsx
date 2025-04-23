import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

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
    expect(screen.getByText(t('prescriptions.notFound.title'))).toBeTruthy()
    expect(screen.getByText(t('prescriptions.notFound.yourVA'))).toBeTruthy()
    expect(screen.getByText(t('prescription.help.item1'))).toBeTruthy()
    expect(screen.getByText(t('prescription.help.item2'))).toBeTruthy()
    expect(screen.getByText(t('prescription.help.item3'))).toBeTruthy()
    expect(screen.getByText(t('prescription.help.item4'))).toBeTruthy()
    expect(screen.getByText(t('prescription.help.item5'))).toBeTruthy()
    expect(screen.getByText(t('prescriptions.notFound.bullets.ifYouThink'))).toBeTruthy()
    expect(screen.getByRole('link', { name: displayedTextPhoneNumber(t('8773270022')) })).toBeTruthy()
    expect(screen.getByRole('link', { name: t('contactVA.tty.displayText') })).toBeTruthy()
  })
})
