import React from 'react'

import { screen } from '@testing-library/react-native'

import { personalInformationKeys } from 'api/personalInformation/queryKeys'
import { BranchesOfServiceConstants, MilitaryServiceHistoryData, ServiceHistoryAttributes } from 'api/types'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

import ProfileScreen from './ProfileScreen'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('ProfileScreen', () => {
  const initializeTestInstance = (): void => {
    const props = mockNavProps(undefined, {
      setOptions: jest.fn(),
      navigate: jest.fn(),
      addListener: jest.fn(),
    })

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

    render(<ProfileScreen {...props} />, {
      queriesData,
    })
  }

  describe('when userProfileUpdate is false, true would not work since mockReturnValueOnce would not work like the other screens so confirm true with demo mode', () => {
    it('it should only render military info and settings', async () => {
      const serviceHistoryMock: ServiceHistoryAttributes = {
        serviceHistory: [
          {
            branchOfService: BranchesOfServiceConstants.MarineCorps,
            beginDate: '1993-06-04',
            endDate: '1995-07-10',
            formattedBeginDate: 'June 04, 1993',
            formattedEndDate: 'July 10, 1995',
            characterOfDischarge: 'Honorable',
            honorableServiceIndicator: 'Y',
          },
        ],
      }
      const militaryServiceHistoryData: MilitaryServiceHistoryData = {
        data: {
          type: 'a',
          id: 'string',
          attributes: serviceHistoryMock,
        },
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/military-service-history')
        .mockResolvedValue(militaryServiceHistoryData)
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Personal information')).toBeFalsy())
      await waitFor(() => expect(screen.queryByText('Contact information')).toBeFalsy())
      await waitFor(() => expect(screen.getByText('Military information')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Settings')).toBeTruthy())
    })
  })

  describe('when common error occurs', () => {
    it('render error message', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v0/military-service-history')
        .mockRejectedValue({ networkError: true } as api.APIError)
      initializeTestInstance()

      await waitFor(() =>
        expect(screen.getByText('We can’t show all activity right now. Check back later.')).toBeTruthy(),
      )
    })
  })
})
