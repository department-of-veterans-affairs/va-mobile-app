import React from 'react'

import { t } from 'i18next'

import { context, mockNavProps, render, screen } from 'testUtils'

import SubmitSuccessScreen from './SubmitSuccessScreen'

context('SubmitSuccessScreen', () => {
  const props = mockNavProps()

  const initializeTestInstance = () => {
    render(<SubmitSuccessScreen {...props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByText(t('travelPay.success.title', { claimId: '12345' }))).toBeTruthy()
    expect(screen.getByText(t('travelPay.success.text'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.success.nextTitle'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.success.nextText'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.success.nextText2'))).toBeTruthy()
  })
})
