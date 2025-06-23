import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'

import BeneficiaryTravelAgreement from './BeneficiaryTravelAgreement'

context('BeneficiaryTravelAgreement', () => {
  const initializeTestInstance = () => {
    const props = mockNavProps()
    render(<BeneficiaryTravelAgreement {...props} />)
  }
  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByLabelText(t('travelPay.beneficiaryTravelAgreement.title'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.travelAgreementHeader'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.beneficiaryTravelAgreement.bulletOne'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.beneficiaryTravelAgreement.bulletTwo'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.beneficiaryTravelAgreement.bulletThree'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.beneficiaryTravelAgreement.bulletFour'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.beneficiaryTravelAgreement.bulletFive'))).toBeTruthy()
  })
})
