import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, mockNavProps, render } from 'testUtils'

import InterstitialScreen from './InterstitialScreen'

const mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('InterstitialScreen', () => {
  const props = mockNavProps(undefined, { navigate: mockNavigationSpy })

  const initializeTestInstance = () => {
    render(<InterstitialScreen {...props} />)
  }

  it('should initialize correctly', () => {
    initializeTestInstance()
    expect(screen.getByText(t('travelPay.beforeYouFileQuestion'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.checkEligibility'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.checkEligibility.description'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.checkEligibility.link'))).toBeTruthy()
    expect(screen.getByTestId('checkEligibilityLinkID')).toBeTruthy()
    expect(screen.getByText(t('travelPay.setUpDirectDeposit'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.setUpDirectDeposit.description'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.setUpDirectDeposit.link'))).toBeTruthy()
    expect(screen.getByTestId('setUpDirectDepositLinkID')).toBeTruthy()
    expect(screen.getByText(t('travelPay.reviewPrivacyStatement'))).toBeTruthy()
    expect(screen.getByTestId('reviewPrivacyStatementLinkID')).toBeTruthy()
    expect(screen.getByText(t('travelPay.burdenTime'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.ombControlNumber'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.ombExpirationDate'))).toBeTruthy()
  })

  it('should navigate to BurdenStatementScreen when reviewPrivacyStatementLinkID is pressed', () => {
    initializeTestInstance()
    fireEvent.press(screen.getByTestId('reviewPrivacyStatementLinkID'))
    expect(mockNavigationSpy).toHaveBeenCalledWith('BurdenStatementScreen')
  })
})
