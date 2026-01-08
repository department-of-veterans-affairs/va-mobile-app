import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import NoTravelClaims from 'screens/HealthScreen/TravelPay/TravelPayClaims/NoTravelClaims'
import { context, render } from 'testUtils'

// Mock navigation
const mockNavigateTo = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigateTo,
  }
})

context('NoTravelClaims', () => {
  describe('Loading State', () => {
    it('should navigate to appointments with the correct parameters when the past appointments link is pressed', () => {
      render(<NoTravelClaims />)

      const link = screen.getByTestId('goToPastAppointmentsLinkID')
      fireEvent.press(link)
      expect(mockNavigateTo).toHaveBeenCalledWith('HealthTab', {
        screen: 'Appointments',
        params: { tab: 1 },
        initial: false,
      })
    })
  })
})
