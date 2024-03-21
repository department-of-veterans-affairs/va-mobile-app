import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { when } from 'jest-when'

import { SecureMessagingFoldersGetData } from 'api/types'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

import { HealthScreen } from './HealthScreen'

const mockNavigationSpy = jest.fn()

jest.mock('../../api/authorizedServices/getAuthorizedServices', () => {
  const original = jest.requireActual('../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest.fn().mockReturnValue({
      status: 'success',
      data: {
        appeals: true,
        appointments: true,
        claims: true,
        decisionLetters: true,
        directDepositBenefits: true,
        directDepositBenefitsUpdate: true,
        disabilityRating: true,
        genderIdentity: true,
        lettersAndDocuments: true,
        militaryServiceHistory: true,
        paymentHistory: true,
        preferredName: true,
        prescriptions: true,
        scheduleAppointments: true,
        secureMessaging: true,
        userProfileUpdate: true,
      },
    }),
  }
})

jest.mock('utils/remoteConfig')

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('HealthScreen', () => {
  const mockFeatureEnabled = featureEnabled as jest.Mock

  afterEach(() => {
    jest.clearAllMocks()
  })
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
  }

  const initializeTestInstance = (prescriptionsEnabled = false) => {
    when(mockFeatureEnabled).calledWith('prescriptions').mockReturnValue(prescriptionsEnabled)

    const props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })

    render(<HealthScreen {...props} />)
  }
  beforeEach(() => {
    initializeTestInstance()
  })

  describe('prescriptions', () => {
    describe('feature disabled', () => {
      it('does not display prescriptions button if feature toggle disabled', async () => {
        expect(screen.getByText('Appointments')).toBeTruthy()
        expect(screen.getByText('Messages')).toBeTruthy()
        expect(screen.queryByText('Prescriptions')).toBeFalsy()
        expect(screen.getByText('V\ufeffA vaccine records')).toBeTruthy()
        expect(screen.getByText('COVID-19 updates')).toBeTruthy()
      })
    })

    describe('feature enabled', () => {
      it('does not display prescriptions button if feature toggle enabled', () => {
        initializeTestInstance(true)
        expect(screen.getByText('Appointments')).toBeTruthy()
        expect(screen.getByText('Messages')).toBeTruthy()
        expect(screen.getByText('Prescriptions')).toBeTruthy()
        expect(screen.getByTestId('V\ufeffA vaccine records')).toBeTruthy()
        expect(screen.getByText('COVID-19 updates')).toBeTruthy()
      })
    })
  })

  describe('on click of the prescriptions button', () => {
    it('should call useRouteNavigation', () => {
      initializeTestInstance(true)
      fireEvent.press(screen.getByText('Prescriptions'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('PrescriptionHistory')
    })
  })

  describe('on click of the appointments button', () => {
    it('should call useRouteNavigation', async () => {
      fireEvent.press(screen.getByText('Appointments'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('Appointments')
    })
  })

  describe('on click of the secure messaging button', () => {
    it('should call useRouteNavigation', () => {
      fireEvent.press(screen.getByText('Messages'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('SecureMessaging', { activeTab: 0 })
    })
  })

  describe('on click of the vaccines button', () => {
    it('should call useRouteNavigation', async () => {
      fireEvent.press(screen.getByText('V\ufeffA vaccine records'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('VaccineList')
    })
  })

  describe('on click of the covid-19 updates button', () => {
    it('should navigate to https://www.va.gov/coronavirus-veteran-frequently-asked-questions', async () => {
      fireEvent.press(screen.getByText('COVID-19 updates'))
      const expectNavArgs = {
        url: 'https://www.va.gov/coronavirus-veteran-frequently-asked-questions',
        displayTitle: 'va.gov',
        loadingMessage: 'Loading VA COVID-19 updates...',
      }
      expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', expectNavArgs)
    })
  })

  it('should render messagesCountTag with the correct count number', async () => {
    when(api.get as jest.Mock)
      .calledWith('/v0/messaging/health/folders')
      .mockResolvedValue(inboxData)
    initializeTestInstance()
    await waitFor(() => expect(screen.getByText('13')).toBeTruthy())
  })
})
