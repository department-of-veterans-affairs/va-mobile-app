import React from 'react'

import { t } from 'i18next'

import { TravelPayError } from 'constants/travelPay'
import { context, fireEvent, mockNavProps, render, screen } from 'testUtils'

import ErrorScreen from './ErrorScreen'

const mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('ErrorScreen', () => {
  const initializeTestInstance = (error?: TravelPayError) => {
    const props = mockNavProps(undefined, { navigate: mockNavigationSpy }, { params: { error } })
    render(<ErrorScreen {...props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByText(t('travelPay.error.error.title'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.error.error.text'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.error.error.text2'))).toBeTruthy()
    expect(screen.getByTestId('fileOnlineComponent')).toBeTruthy()
    expect(screen.getByTestId('travelPayHelp')).toBeTruthy()
  })

  it('should display no address error when error is noAddress', () => {
    initializeTestInstance('noAddress')
    expect(screen.getByText(t('travelPay.error.noAddress.title'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.error.noAddress.text'))).toBeTruthy()
    expect(screen.getByTestId('updateAddressLink')).toBeTruthy()
    expect(screen.getByTestId('fileOnlineComponent')).toBeTruthy()
    expect(screen.getByTestId('travelPayHelp')).toBeTruthy()
  })

  it('should display no eligible error when error is noEligibleType', () => {
    initializeTestInstance('noEligibleType')
    expect(screen.getByText(t('travelPay.error.notEligible.title'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.error.notEligible.text'))).toBeTruthy()
    expect(screen.getByTestId('fileOnlineComponent')).toBeTruthy()
    expect(screen.getByTestId('travelPayHelp')).toBeTruthy()
  })

  it('should navigate to ContactInformation when updateAddressLink is pressed', () => {
    initializeTestInstance('noAddress')
    fireEvent.press(screen.getByTestId('updateAddressLink'))
    expect(mockNavigationSpy).toHaveBeenCalledWith('ContactInformation')
  })
})
