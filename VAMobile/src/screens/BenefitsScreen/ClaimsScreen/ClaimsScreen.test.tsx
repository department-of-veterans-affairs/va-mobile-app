import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import ClaimsScreen from 'screens/BenefitsScreen/ClaimsScreen'
import { context, mockNavProps, render } from 'testUtils'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('utils/remoteConfig', () => ({
  featureEnabled: jest.fn(),
}))

context('ClaimsScreen', () => {
  const initializeTestInstance = () => {
    const props = mockNavProps(undefined, { navigate: mockNavigationSpy })

    render(<ClaimsScreen {...props} />)
  }

  it('navigates to Claims history when the button is pressed', () => {
    initializeTestInstance()

    fireEvent.press(screen.getByTestId('toClaimsHistoryID'))
    expect(mockNavigationSpy).toHaveBeenCalledWith('ClaimsHistoryScreen')
  })

  it('navigates to Claims letters when the button is pressed', () => {
    initializeTestInstance()

    fireEvent.press(screen.getByTestId('toClaimLettersID'))
    expect(mockNavigationSpy).toHaveBeenCalledWith('ClaimLettersScreen')
  })

  describe('Travel Claims button', () => {
    it('is displayed if feature toggle is enabled', () => {
      initializeTestInstance()

      expect(screen.getByTestId('toTravelPayClaimsButtonID')).toBeTruthy()
    })

    it('should navigate to the Travel Claims screen', () => {
      initializeTestInstance()

      fireEvent.press(screen.getByTestId('toTravelPayClaimsButtonID'))

      expect(mockNavigationSpy).toHaveBeenCalledWith('BenefitsTab', { screen: 'TravelPayClaims', initial: false })
    })
  })
})
