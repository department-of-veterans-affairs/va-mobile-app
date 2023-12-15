import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import { initialPrescriptionState } from 'store/slices'
import { HomeScreen } from './HomeScreen'
import { Linking } from 'react-native'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('utils/remoteConfig')

context('HomeScreen', () => {
  const initializeTestInstance = (activePrescriptionsCount?: number) => {
    const props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })
    render(<HomeScreen {...props} />, {
      preloadedState: {
        prescriptions: {
          ...initialPrescriptionState,
          prescriptionStatusCount: {
            active: activePrescriptionsCount || 0,
          }
        }
      }
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('button', { name: 'Talk to the Veterans Crisis Line now' })).toBeTruthy()
    expect(screen.getByText('About VA')).toBeTruthy()
    expect(screen.getByText('Contact VA')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Find a VA location' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'COVID-19 updates' })).toBeTruthy()
  })

  describe('when VA COVID-19 updates is pressed', () => {
    it('should navigate to https://www.va.gov/coronavirus-veteran-frequently-asked-questions', () => {
      fireEvent.press(screen.getByRole('button', { name: 'COVID-19 updates' }))
      const expectNavArgs = {
        url: 'https://www.va.gov/coronavirus-veteran-frequently-asked-questions',
        displayTitle: 'va.gov',
        loadingMessage: 'Loading VA COVID-19 updates...',
      }
      expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', expectNavArgs)
    })
  })

  describe('when the find VA location link is clicked', () => {
    it('should call useRouteNavigation', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Find a VA location' }))
      expect(mockNavigationSpy).toBeCalledWith('Webview', { displayTitle: 'va.gov', url: 'https://www.va.gov/find-locations/', loadingMessage: 'Loading VA location finder...' })
    })
  })

  it('displays prescriptions module when there are active prescriptions', () => {
    initializeTestInstance(2)
    expect(screen.getByText('Prescriptions')).toBeTruthy()
    expect(screen.getByText('(2 active)')).toBeTruthy()
  })

  it('navigates to prescriptions screen when prescriptions module is tapped', () => {
    initializeTestInstance(2)
    fireEvent.press(screen.getByText('Prescriptions'))
    expect(Linking.openURL).toBeCalledWith('vamobile://prescriptions')
  })

  it('does not display prescriptions module when there are no active prescriptions', () => {
    initializeTestInstance(0)
    expect(screen.queryByText('Prescriptions')).toBeFalsy()
  })
})
