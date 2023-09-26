import 'react-native'
import React from 'react'

import { screen, fireEvent } from '@testing-library/react-native'
import { context, mockNavProps, render } from 'testUtils'
import { HealthScreen } from './HealthScreen'
import { initialAuthState, initialErrorsState, initialSecureMessagingState, loadAllPrescriptions } from 'store/slices'
import { when } from 'jest-when'
import { featureEnabled } from 'utils/remoteConfig'

const mockNavigateToSpy = jest.fn()
const mockNavigationSpy = jest.fn()

jest.mock('../../api/authorizedServices/getAuthorizedServices', () => {
  let original = jest.requireActual('../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest.fn().mockReturnValue({
      status: "success",
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
        userProfileUpdate: true
      }
    })
  }
})

jest.mock('utils/remoteConfig')

jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigateToSpy
    },
  }
})

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    loadAllPrescriptions: jest.fn(() => {
      return {
        type: '',
        payload: {},
      }
    }),
  }
})

context('HealthScreen', () => {
  let props: any
  let mockNavigateToAppointmentSpy: jest.Mock
  let mockNavigateToSecureMessagingSpy: jest.Mock
  let mockNavigateToVAVaccinesSpy: jest.Mock
  let mockNavigateToPharmacySpy: jest.Mock
  let mockFeatureEnabled = featureEnabled as jest.Mock

  afterEach(() => {
    jest.clearAllMocks()
  })

  //mockList:  SecureMessagingMessageList --> for inboxMessages
  const initializeTestInstance = (unreadCount = 13, hasLoadedInbox = true, prescriptionsEnabled = false, prescriptionsNeedLoad = false) => {
    mockNavigateToAppointmentSpy = jest.fn()
    mockNavigateToSecureMessagingSpy = jest.fn()
    mockNavigateToVAVaccinesSpy = jest.fn()
    mockNavigateToPharmacySpy = jest.fn()
    when(mockNavigateToSpy)
      .mockReturnValue(() => {})
      .calledWith('Appointments')
      .mockReturnValue(mockNavigateToAppointmentSpy)
      .calledWith('SecureMessaging')
      .mockReturnValue(mockNavigateToSecureMessagingSpy)
      .calledWith('VaccineList')
      .mockReturnValue(mockNavigateToVAVaccinesSpy)
      .calledWith('PrescriptionHistory')
      .mockReturnValue(mockNavigateToPharmacySpy)

    when(mockFeatureEnabled).calledWith('prescriptions').mockReturnValue(prescriptionsEnabled)

    props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })

    render(<HealthScreen {...props} />, {
      preloadedState: {
        auth: { ...initialAuthState },
        prescriptions: { prescriptionsNeedLoad },
        secureMessaging: {
          ...initialSecureMessagingState,
          hasLoadedInbox,
          inbox: {
            type: 'Inbox',
            id: '123',
            attributes: {
              //SecureMessagingFolderAttributes
              folderId: 123,
              name: 'Inbox',
              count: 45,
              unreadCount: unreadCount,
              systemFolder: true,
            },
          },
        },
        errors: initialErrorsState,
      },
    })
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
      it('does not display prescriptions button if feature toggle enabled', async () => {
        initializeTestInstance(0, true, true)
        expect(screen.getByText('Appointments')).toBeTruthy()
        expect(screen.getByText('Messages')).toBeTruthy()
        expect(screen.getByText('Prescriptions')).toBeTruthy()
        expect(screen.getByTestId('V\ufeffA vaccine records')).toBeTruthy()
        expect(screen.getByText('COVID-19 updates')).toBeTruthy()
      })
    })
  })

  describe('on click of the prescriptions button', () => {
    it('should call useRouteNavigation', async () => {
      initializeTestInstance(0, true, true)
      fireEvent.press(screen.getByText('Prescriptions'))
      expect(mockNavigateToPharmacySpy).toHaveBeenCalled()
    })

    it('should reload rx data if data is present', async () => {
      initializeTestInstance(0, true, true, false)
      fireEvent.press(screen.getByText('Prescriptions'))
      expect(loadAllPrescriptions).toHaveBeenCalled()
    })

    it('should not reload rx data if data is not present', async () => {
      initializeTestInstance(0, true, true, true)
      fireEvent.press(screen.getByText('Prescriptions'))
      expect(loadAllPrescriptions).not.toHaveBeenCalled()
    })
  })

  describe('on click of the appointments button', () => {
    it('should call useRouteNavigation', async () => {
      fireEvent.press(screen.getByText('Appointments'))
      expect(mockNavigateToAppointmentSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the secure messaging button', () => {
    it('should call useRouteNavigation', async () => {
      fireEvent.press(screen.getByText('Messages'))
      expect(mockNavigateToSecureMessagingSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the vaccines button', () => {
    it('should call useRouteNavigation', async () => {
      fireEvent.press(screen.getByText('V\ufeffA vaccine records'))
      expect(mockNavigateToVAVaccinesSpy).toHaveBeenCalled()
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
    initializeTestInstance(13)
    expect(screen.getByText('13')).toBeTruthy()
  })
})
