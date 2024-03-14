import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { personalInformationKeys } from 'api/personalInformation/queryKeys'
import { initialPrescriptionState } from 'store/slices'
import { initialClaimsAndAppealsState } from 'store/slices'
import { context, mockNavProps, render } from 'testUtils'

import { HomeScreen } from './HomeScreen'

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
  const initializeTestInstance = (refillablePrescriptionsCount?: number, activeClaimsCount?: number) => {
    const props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })
    const queriesData = [
      {
        queryKey: personalInformationKeys.personalInformation,
        data: {
          firstName: 'Gary',
          middleName: null,
          lastName: 'Washington',
          signinEmail: 'Gary.Washington@idme.com',
          signinService: 'IDME',
          fullName: 'Gary Washington',
          birthDate: null,
          hasFacilityTransitioningToCerner: false,
        },
      },
    ]
    render(<HomeScreen {...props} />, {
      preloadedState: {
        prescriptions: {
          ...initialPrescriptionState,
          prescriptionStatusCount: {
            isRefillable: refillablePrescriptionsCount || 0,
          },
        },
        claimsAndAppeals: {
          ...initialClaimsAndAppealsState,
          activeClaimsCount: activeClaimsCount || 0,
        },
      },
      queriesData,
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
  })

  describe('when the find VA location link is clicked', () => {
    it('should call useRouteNavigation', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Find a VA location' }))
      expect(mockNavigationSpy).toBeCalledWith('Webview', {
        displayTitle: 'va.gov',
        url: 'https://www.va.gov/find-locations/',
        loadingMessage: 'Loading VA location finder...',
      })
    })
  })

  it('displays prescriptions module when there are active prescriptions', () => {
    initializeTestInstance(2)
    expect(screen.getByRole('link', { name: 'Prescriptions' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '2 ready to refill' })).toBeTruthy()
  })

  it('navigates to prescriptions screen when prescriptions module is tapped', () => {
    initializeTestInstance(2)
    fireEvent.press(screen.getByRole('link', { name: 'Prescriptions' }))
    expect(Linking.openURL).toBeCalledWith('vamobile://prescriptions')
  })

  it('does not display prescriptions module when there are no active prescriptions', () => {
    initializeTestInstance(0)
    expect(screen.queryByText('Prescriptions')).toBeFalsy()
  })

  it('displays claims module when there are active claims', () => {
    initializeTestInstance(0, 2)
    expect(screen.getByRole('link', { name: 'Claims' })).toBeTruthy()
    expect(screen.getByRole('link', { name: '2 active' })).toBeTruthy()
  })

  it('navigates to claims history screen when claims module is tapped', () => {
    initializeTestInstance(0, 2)
    fireEvent.press(screen.getByRole('link', { name: 'Claims' }))
    expect(Linking.openURL).toBeCalledWith('vamobile://claims')
  })

  it('does not display claims module when there are no active claims', () => {
    initializeTestInstance(0)
    expect(screen.queryByText('Claims')).toBeFalsy()
  })
})
