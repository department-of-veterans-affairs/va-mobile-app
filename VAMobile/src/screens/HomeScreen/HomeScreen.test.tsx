import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { appointmentsKeys } from 'api/appointments'
import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { personalInformationKeys } from 'api/personalInformation/queryKeys'
import { prescriptionKeys } from 'api/prescriptions'
import { secureMessagingKeys } from 'api/secureMessaging'
import {
  AppointmentsGetData,
  ClaimsAndAppealsListPayload,
  PrescriptionsGetData,
  SecureMessagingFoldersGetData,
} from 'api/types'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { context, mockNavProps, render } from 'testUtils'
import { defaultPrescriptionsList as mockData } from 'utils/tests/prescription'

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
    const mock: PrescriptionsGetData = {
      data: refillablePrescriptionsCount && refillablePrescriptionsCount > 0 ? mockData : [],
      meta: {
        pagination: {
          currentPage: 1,
          perPage: 10,
          totalPages: 1,
          totalEntries: 2,
        },
        prescriptionStatusCount: {
          active: refillablePrescriptionsCount || 0,
          isRefillable: refillablePrescriptionsCount || 0,
          discontinued: 0,
          expired: 0,
          historical: 0,
          pending: 0,
          transferred: 0,
          submitted: 0,
          hold: 0,
          unknown: 0,
          total: 0,
        },
      },
      links: {
        self: '',
        first: '',
        prev: '',
        next: '',
        last: '',
      },
    }
    const claimsAppealsPayload: ClaimsAndAppealsListPayload = {
      data: [],
      meta: {
        pagination: {
          currentPage: 1,
          totalEntries: 3,
          perPage: 10,
        },
        activeClaimsCount: activeClaimsCount,
      },
    }
    const apptsData: AppointmentsGetData = {
      data: [],
      meta: {
        dataFromStore: false,
        upcomingAppointmentsCount: 0,
        upcomingDaysLimit: 0,
      },
    }
    const inboxData: SecureMessagingFoldersGetData = {
      data: [
        {
          id: '1',
          type: 'hah',
          attributes: {
            folderId: 1,
            name: 'Inbox',
            count: 22,
            unreadCount: 13,
            systemFolder: true,
          },
        },
      ],
      links: {
        self: '1',
        first: '1',
        prev: '1',
        next: '1',
        last: '1',
      },
      meta: {
        pagination: {
          currentPage: 1,
          perPage: 1,
          totalPages: 1,
          totalEntries: 1,
        },
      },
      inboxUnreadCount: 13,
    }
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
      {
        queryKey: prescriptionKeys.prescriptions,
        data: mock,
      },
      {
        queryKey: [claimsAndAppealsKeys.claimsAndAppeals, 'ACTIVE', 1],
        data: claimsAppealsPayload,
      },
      {
        queryKey: [appointmentsKeys.appointments, TimeFrameTypeConstants.UPCOMING],
        data: apptsData,
      },
      {
        queryKey: secureMessagingKeys.folders,
        data: inboxData,
      },
    ]
    render(<HomeScreen {...props} />, { queriesData })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('link', { name: 'Talk to the Veterans Crisis Line now' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Contact us' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Find a VA location' })).toBeTruthy()
  })

  describe('when the find VA location link is clicked', () => {
    it('should call useRouteNavigation', () => {
      fireEvent.press(screen.getByRole('link', { name: 'Find a VA location' }))
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
