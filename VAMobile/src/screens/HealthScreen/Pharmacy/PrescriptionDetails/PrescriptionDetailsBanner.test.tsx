import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'

import PrescriptionsDetailsBanner from './PrescriptionsDetailsBanner'

context('PrescriptionsDetailsBanner', () => {
  it('initializes correctly', () => {
    render(<PrescriptionsDetailsBanner />)
    expect(screen.getByText(t('prescription.details.banner.title'))).toBeTruthy()
  })

  it('should show expanded content', () => {
    render(<PrescriptionsDetailsBanner />)
    fireEvent.press(screen.getByText(t('prescription.details.banner.title')))
    expect(screen.getByText(`${t('prescription.details.banner.bullet1')} ${t('or')}`)).toBeTruthy()
    expect(screen.getByText(`${t('prescription.details.banner.bullet2')} ${t('or')}`)).toBeTruthy()
    expect(screen.getByText(`${t('prescription.details.banner.bullet3')} ${t('or')}`)).toBeTruthy()
    expect(screen.getByText(t('prescription.details.banner.bullet4'))).toBeTruthy()
    expect(screen.getByText(t('automatedPhoneSystem'))).toBeTruthy()
    expect(screen.getByText(displayedTextPhoneNumber(t('5418307563')))).toBeTruthy()
    expect(screen.getByText(t('contactVA.tty.displayText'))).toBeTruthy()
  })
})
