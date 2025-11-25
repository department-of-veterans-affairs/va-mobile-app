import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { useDebts } from 'api/debts'
import { useMaintenanceWindows } from 'api/maintenanceWindows/getMaintenanceWindows'
import { useMedicalCopays } from 'api/medicalCopays'
import {
  DisabilityRatingData,
  FacilitiesPayload,
  MilitaryServiceHistoryData,
  PaymentsGetData,
  ServiceHistoryAttributes,
} from 'api/types'
import { DEFAULT_UPCOMING_DAYS_LIMIT } from 'constants/appointments'
import { HomeScreen } from 'screens/HomeScreen/HomeScreen'
import { DowntimeFeatureType, get } from 'store/api'
import { AuthState } from 'store/slices'
import { RenderParams, context, mockNavProps, render, when } from 'testUtils'
import { formatDateUtc, numberToUSDollars } from 'utils/formattingUtils'
import { featureEnabled } from 'utils/remoteConfig'
import { getMaintenanceWindowsPayload } from 'utils/tests/maintenanceWindows'
import {
  getAppointmentsPayload,
  getClaimsAndAppealsPayload,
  getFoldersPayload,
  getPrescriptionsPayload,
} from 'utils/tests/personalization'

jest.mock('utils/remoteConfig')

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const allMaintenanceWindowServices: Array<DowntimeFeatureType> = [
  'rx_refill',
  'appointments',
  'appeals',
  'claims',
  'secure_messaging',
  'payment_history',
]
const useMaintenanceWindowsMock = useMaintenanceWindows as jest.Mock
jest.mock('api/maintenanceWindows/getMaintenanceWindows', () => {
  return {
    useMaintenanceWindows: jest.fn().mockReturnValue({ maintenanceWindows: {} }),
  }
})

jest.mock('api/medicalCopays', () => ({
  useMedicalCopays: jest.fn(() => ({
    summary: { amountDue: 0, count: 0 },
    isLoading: false,
    error: undefined,
  })),
}))

jest.mock('api/debts', () => ({
  useDebts: jest.fn(() => ({
    summary: { amountDue: 0, count: 0 },
    isLoading: false,
    error: undefined,
  })),
}))

const getFacilitiesPayload = (isCernerPatient: boolean): FacilitiesPayload => ({
  data: {
    attributes: {
      facilities: [
        {
          id: '0',
          name: 'Cary VA Medical Center',
          city: 'Cary',
          state: 'WY',
          cerner: isCernerPatient,
          miles: '3.63',
        },
      ],
    },
  },
})

const getDisabilityRatingPayload = (combinedDisabilityRating: number): DisabilityRatingData => ({
  data: {
    type: 'disabilityRating',
    id: '0',
    attributes: {
      combinedDisabilityRating,
      combinedEffectiveDate: '',
      legalEffectiveDate: '',
      individualRatings: [],
    },
  },
})

const getPaymentHistoryPayload = (monthlyAwardAmount: string, monthlyAwardDate: string): PaymentsGetData => ({
  data: [],
  paymentsByDate: undefined,
  meta: {
    availableYears: null,
    recurringPayment: {
      amount: monthlyAwardAmount,
      date: monthlyAwardDate,
    },
  },
  links: {
    self: null,
    first: null,
    prev: null,
    next: null,
    last: null,
  },
})

const getMilitaryServiceHistoryPayload = (serviceHistory: ServiceHistoryAttributes): MilitaryServiceHistoryData => ({
  data: {
    type: 'a',
    id: 'string',
    attributes: serviceHistory,
  },
})

context('HomeScreen', () => {
  const mockFeatureEnabled = featureEnabled as jest.Mock

  const initializeTestInstance = (options?: RenderParams, maintenanceWindows?: Array<DowntimeFeatureType>) => {
    const props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })
    useMaintenanceWindowsMock.mockReturnValue(getMaintenanceWindowsPayload(maintenanceWindows || []))
    return render(<HomeScreen {...props} />, { ...options })
  }

  describe('Activity section', () => {
    it('displays error message when one of the API calls fails', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(3, 5))
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(3))
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(3))
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockRejectedValue('failure')

      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('activity.error.cantShowAllActivity'))).toBeTruthy())
    })

    it('displays error message when one of the features are in downtime', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(3, 5))
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(3))
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(3))
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockResolvedValue(getPrescriptionsPayload(3))

      initializeTestInstance(
        {
          preloadedState: {
            auth: {
              loggedIn: true,
            } as AuthState,
          },
        },
        allMaintenanceWindowServices,
      )

      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.getByText(t('activity.error.cantShowAllActivity'))).toBeTruthy())
    })

    it('displays error message when all the features are in downtime', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(3, 5))
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(3))
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(3))
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockResolvedValue(getPrescriptionsPayload(3))

      initializeTestInstance(
        {
          preloadedState: {
            auth: {
              loggedIn: true,
            } as AuthState,
          },
        },
        allMaintenanceWindowServices,
      )
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.getByText(t('activity.error.cantShowAllActivity'))).toBeTruthy())
    })

    it('does not display an error message when all API calls succeed', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(3, 5))
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(3))
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(3))
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockResolvedValue(getPrescriptionsPayload(3))

      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByText(t('activity.error.cantShowAllActivity'))).toBeFalsy())
    })

    it('displays cerner related message if veteran has a cerner facility', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/facilities-info')
        .mockResolvedValue(getFacilitiesPayload(true))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText(t('activity.informationNotIncluded'))).toBeTruthy())
    })

    it('does not display cerner related message if veteran does not have a cerner facility', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/facilities-info')
        .mockResolvedValue(getFacilitiesPayload(false))
      initializeTestInstance()
      await waitFor(() => expect(get).toBeCalledWith('/v0/facilities-info'))
      await waitFor(() => expect(screen.queryByText(t('activity.informationNotIncluded'))).toBeFalsy())
    })
  })

  describe('Upcoming Appointments module', () => {
    it('displays upcoming appointment count when there are upcoming appointments', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(3, 0))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('link', { name: t('upcomingAppointments') })).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByRole('link', {
            name: t('upcomingAppointments.activityButton.subText', {
              count: 3,
              dayCount: DEFAULT_UPCOMING_DAYS_LIMIT,
            }),
          }),
        ).toBeTruthy(),
      )
    })

    it('navigates to Appointments screen when pressed', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(3, 0))
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: t('upcomingAppointments') })))
      await waitFor(() => expect(Linking.openURL).toBeCalledWith('vamobile://appointments'))
    })

    it('is not displayed when there are no upcoming appointments', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(0, 0))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('upcomingAppointments') })).toBeFalsy())
    })

    it('is not displayed when the API call throws an error', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockRejectedValue('fail')
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('upcomingAppointments') })).toBeFalsy())
    })

    it('is not displayed when appointments is in downtime', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(3, 0))
      initializeTestInstance(
        {
          preloadedState: {
            auth: {
              loggedIn: true,
            } as AuthState,
          },
        },
        allMaintenanceWindowServices,
      )
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('upcomingAppointments') })).toBeFalsy())
    })
  })

  describe('Past Appointments module', () => {
    it('displays travel pay reimbursement eligible appointments when they exist', async () => {
      when(mockFeatureEnabled).calledWith('travelPaySMOC').mockReturnValue(true)
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(0, 5))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('link', { name: t('pastAppointments') })).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByRole('link', {
            name: t('pastAppointments.activityButton.subText', {
              count: 5,
            }),
          }),
        ).toBeTruthy(),
      )
    })

    it('navigates to Appointments screen when pressed', async () => {
      when(mockFeatureEnabled).calledWith('travelPaySMOC').mockReturnValue(true)
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(0, 5))
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: t('pastAppointments') })))
      await waitFor(() => expect(Linking.openURL).toBeCalledWith('vamobile://pastAppointments'))
    })

    it('is not displayed when there are no upcoming appointments', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(0, 0))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('pastAppointments') })).toBeFalsy())
    })

    it('is not displayed when the API call throws an error', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockRejectedValue('fail')
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('pastAppointments') })).toBeFalsy())
    })

    it('is not displayed when appointments is in downtime', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockResolvedValue(getAppointmentsPayload(0, 3))
      initializeTestInstance(
        {
          preloadedState: {
            auth: {
              loggedIn: true,
            } as AuthState,
          },
        },
        allMaintenanceWindowServices,
      )
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('pastAppointments') })).toBeFalsy())
    })
  })

  describe('Claims module', () => {
    it('displays active claims count when there are active claims', async () => {
      const activeClaimsCount = 3
      when(get as jest.Mock)
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(activeClaimsCount))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('link', { name: t('claims.title') })).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByRole('link', {
            name: t('claims.activityButton.subText', {
              count: activeClaimsCount,
            }),
          }),
        ).toBeTruthy(),
      )
    })

    it('navigates to Claims history screen when pressed', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(2))
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: t('claims.title') })))
      await waitFor(() => expect(Linking.openURL).toBeCalledWith('vamobile://claims'))
    })

    it('is not displayed when there are no active claims', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(0))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('claims.title') })).toBeFalsy())
    })

    it('is not displayed when the API call throws an error', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockRejectedValue('fail')
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('claims.title') })).toBeFalsy())
    })

    it('is not displayed when there is a service error', async () => {
      const serviceErrors = [
        {
          service: 'claims',
          errorDetails: [{ title: 'Claims error' }],
        },
      ]

      when(get as jest.Mock)
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(2, serviceErrors))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('claims.title') })).toBeFalsy())
    })

    it('is not displayed when claims is in downtime', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/claims-and-appeals-overview', expect.anything())
        .mockResolvedValue(getClaimsAndAppealsPayload(2))
      initializeTestInstance(
        {
          preloadedState: {
            auth: {
              loggedIn: true,
            } as AuthState,
          },
        },
        allMaintenanceWindowServices,
      )
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('claims.title') })).toBeFalsy())
    })
  })

  describe('Messages module', () => {
    it('displays unread count when there are unread messages', async () => {
      const unreadMessageCount = 3
      when(get as jest.Mock)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(unreadMessageCount))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('link', { name: t('messages') })).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByRole('link', {
            name: t('secureMessaging.activityButton.subText', { count: unreadMessageCount }),
          }),
        ).toBeTruthy(),
      )
    })

    it('navigates to Messages screen when pressed', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(3))
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: t('messages') })))
      await waitFor(() => expect(Linking.openURL).toBeCalledWith('vamobile://messages'))
    })

    it('is not displayed when there are no unread messages', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(0))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('messages') })).toBeFalsy())
    })

    it('is not displayed when the API call throws an error', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/messaging/health/folders')
        .mockRejectedValue('fail')
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('messages') })).toBeFalsy())
    })

    it('is not displayed when secure messaging is in downtime', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(getFoldersPayload(3))
      initializeTestInstance(
        {
          preloadedState: {
            auth: {
              loggedIn: true,
            } as AuthState,
          },
        },
        allMaintenanceWindowServices,
      )
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('messages') })).toBeFalsy())
    })
  })

  describe('Copay & Overpayment modules', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('renders Copays and Debts with correct subtext when amount & count > 0', async () => {
      when(mockFeatureEnabled).calledWith('overpayCopay').mockReturnValue(true)
      ;(useMedicalCopays as jest.Mock).mockReturnValue({
        summary: { amountDue: 396.93, count: 6 },
        isLoading: false,
        error: undefined,
      })
      ;(useDebts as jest.Mock).mockReturnValue({
        summary: { amountDue: 347.5, count: 2 },
        isLoading: false,
        error: undefined,
      })

      initializeTestInstance()

      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())

      const copaysTitle = t('copays.title')
      const debtsTitle = t('debts.title')

      const copaysSub = t('copays.activityButton.subText', {
        amount: numberToUSDollars(396.93),
        count: 6,
      })
      const debtsSub = t('debts.activityButton.subText', {
        amount: numberToUSDollars(347.5),
        count: 2,
      })

      expect(screen.getByRole('link', { name: copaysTitle })).toBeTruthy()
      expect(screen.getByRole('link', { name: debtsTitle })).toBeTruthy()

      expect(screen.getByRole('link', { name: copaysSub })).toBeTruthy()
      expect(screen.getByRole('link', { name: debtsSub })).toBeTruthy()
    })

    it('hides Copays and Debts tiles when summaries are empty', async () => {
      when(mockFeatureEnabled).calledWith('overpayCopay').mockReturnValue(true)
      ;(useMedicalCopays as jest.Mock).mockReturnValue({
        summary: { amountDue: 0, count: 0 },
        isLoading: false,
        error: undefined,
      })
      ;(useDebts as jest.Mock).mockReturnValue({
        summary: { amountDue: 0, count: 0 },
        isLoading: false,
        error: undefined,
      })

      initializeTestInstance()

      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())

      expect(screen.queryByRole('link', { name: t('copays.title') })).toBeFalsy()
      expect(screen.queryByRole('link', { name: t('debts.title') })).toBeFalsy()
    })
  })

  describe('Prescription module', () => {
    it('displays refill count when there are refillable prescriptions', async () => {
      const refillablePrescriptionsCount = 3
      when(get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockResolvedValue(getPrescriptionsPayload(refillablePrescriptionsCount))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByRole('link', { name: t('prescription.title') })).toBeTruthy())
      await waitFor(() =>
        expect(
          screen.getByRole('link', {
            name: t('prescriptions.activityButton.subText', {
              count: refillablePrescriptionsCount,
            }),
          }),
        ).toBeTruthy(),
      )
    })

    it('navigates to Prescriptions screen when pressed', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockResolvedValue(getPrescriptionsPayload(3))
      initializeTestInstance()
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: t('prescription.title') })))
      await waitFor(() => expect(Linking.openURL).toBeCalledWith('vamobile://prescriptions'))
    })

    it('is not displayed when there are no active prescriptions', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockResolvedValue(getPrescriptionsPayload(0))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('prescription.title') })).toBeFalsy())
    })

    it('is not displayed when the API call throws an error', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockRejectedValue('fail')
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('prescription.title') })).toBeFalsy())
    })

    it('is not displayed when prescriptions is in downtime', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/health/rx/prescriptions', expect.anything())
        .mockResolvedValue(getPrescriptionsPayload(3))
      initializeTestInstance(
        {
          preloadedState: {
            auth: {
              loggedIn: true,
            } as AuthState,
          },
        },
        allMaintenanceWindowServices,
      )
      await waitFor(() => expect(screen.queryByText(t('activity.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByRole('link', { name: t('prescription.title') })).toBeFalsy())
    })
  })

  describe('About you section', () => {
    it('displays obfuscated disability rating percentage revealed on show when veteran has disability rating', async () => {
      const disabilityRating = 100
      when(get as jest.Mock)
        .calledWith('/v0/disability-rating')
        .mockResolvedValue(getDisabilityRatingPayload(disabilityRating))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByLabelText(t('disabilityRating.title.obfuscatedLabel'))).toBeTruthy())
      await waitFor(() => fireEvent.press(screen.getByTestId('showDisabilityTestID')))
      await waitFor(() =>
        expect(
          screen.getByLabelText(
            `${t('disabilityRatingDetails.percentage', { rate: disabilityRating })} ${t('disabilityRating.serviceConnected')}`,
          ),
        ).toBeTruthy(),
      )
    })

    it('does not display disability rating percentage when veteran does not have disability rating', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/disability-rating')
        .mockResolvedValue(getDisabilityRatingPayload(undefined))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('aboutYou.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByText(t('disabilityRating.title'))).toBeFalsy())
    })

    it('does not display disability rating percentage and show error message when disability ratings API call fails', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/disability-rating')
        .mockRejectedValue('fail')
        .calledWith('/v0/payment-history', {})
        .mockResolvedValue(getPaymentHistoryPayload('$3084.74', '2025-03-21T00:00:00.000-06:00'))
        .calledWith('/v0/military-service-history')
        .mockResolvedValue(getMilitaryServiceHistoryPayload({} as ServiceHistoryAttributes))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('aboutYou.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByText(t('disabilityRating.title'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByText(t('aboutYou.error.cantShowAllInfo'))).toBeTruthy())
    })

    it('displays obfuscated monthly payment amount that is revealed on show when veteran has monthly compensation payment', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/disability-rating')
        .mockResolvedValue(getDisabilityRatingPayload(100))
        .calledWith('/v0/payment-history', {})
        .mockResolvedValue(getPaymentHistoryPayload('$3084.74', '2025-03-21T00:00:00.000-06:00'))
      initializeTestInstance()
      await waitFor(() => expect(screen.getByLabelText(t('monthlyCompensationPayment.obfuscated'))).toBeTruthy())
      await waitFor(() => fireEvent.press(screen.getByTestId('showCompensationTestID')))
      await waitFor(() =>
        expect(
          screen.getByLabelText(
            `${'$3084.74'} ${t('monthlyCompensationPayment.depositedOn')} ${formatDateUtc('2025-03-21T00:00:00.000-06:00', 'MMMM d, yyyy')}`,
          ),
        ).toBeTruthy(),
      )
    })

    it('does not display monthly payment amount when veteran does not have monthly compensation payment', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/payment-history', {})
        .mockResolvedValue(getPaymentHistoryPayload('', ''))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('aboutYou.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByText(t('monthlyCompensationPayment'))).toBeFalsy())
    })

    it('does not display monthly payment and show error message when the beneficiary API call fails', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/disability-rating')
        .mockResolvedValue(getDisabilityRatingPayload(100))
        .calledWith('/v0/payment-history', {})
        .mockRejectedValue('fail')
        .calledWith('/v0/military-service-history')
        .mockResolvedValue(getMilitaryServiceHistoryPayload({} as ServiceHistoryAttributes))
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('aboutYou.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByText(t('monthlyCompensationPayment'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByText(t('aboutYou.error.cantShowAllInfo'))).toBeTruthy())
    })

    it("displays message when no 'About you' info exists", async () => {
      when(get as jest.Mock)
        .calledWith('/v0/disability-rating')
        .mockResolvedValue(getDisabilityRatingPayload(undefined))
        .calledWith('/v0/payment-history', {})
        .mockResolvedValue(getPaymentHistoryPayload('', ''))
        .calledWith('/v0/military-service-history')
        .mockResolvedValue(getMilitaryServiceHistoryPayload({} as ServiceHistoryAttributes))

      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('aboutYou.noInformation'))).toBeTruthy())
      await waitFor(() => expect(screen.queryByText(t('aboutYou.error.cantShowAllInfo'))).toBeFalsy())
    })

    it('displays error message when one of the features are in downtime', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/disability-rating')
        .mockResolvedValue(getDisabilityRatingPayload(100))
        .calledWith('/v0/payment-history', {})
        .mockResolvedValue(getPaymentHistoryPayload('$3000', '2025-03-21T00:00:00.000-06:00'))
        .calledWith('/v0/military-service-history')
        .mockResolvedValue(getMilitaryServiceHistoryPayload({} as ServiceHistoryAttributes))
      initializeTestInstance(
        {
          preloadedState: {
            auth: {
              loggedIn: true,
            } as AuthState,
          },
        },
        allMaintenanceWindowServices,
      )
      await waitFor(() => expect(screen.queryByText(t('aboutYou.loading'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByText(t('aboutYou.error.cantShowAllInfo'))).toBeTruthy())
    })

    it("displays error message when some 'About you' info doesn't exist and rest of info has errors", async () => {
      when(get as jest.Mock)
        .calledWith('/v0/disability-rating')
        .mockResolvedValue(getDisabilityRatingPayload(0))
        .calledWith('/v0/payment-history', {})
        .mockResolvedValue(getPaymentHistoryPayload('', ''))
        .calledWith('/v0/military-service-history')
        .mockRejectedValue('fail')

      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText(t('aboutYou.noInformation'))).toBeFalsy())
      await waitFor(() => expect(screen.queryByText(t('aboutYou.error.cantShowAllInfo'))).toBeTruthy())
    })
  })

  describe('VA resources section', () => {
    it('navigates to the "Contact VA" screen when the "Contact us" link is pressed', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('link', { name: t('contactUs') }))
      expect(mockNavigationSpy).toBeCalledWith('ContactVA')
    })

    it('launches WebView when the "Find a VA location" link is pressed', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('link', { name: t('findLocation.title') }))
      expect(mockNavigationSpy).toBeCalledWith('Webview', {
        displayTitle: t('webview.vagov'),
        url: 'https://www.va.gov/find-locations/',
        loadingMessage: t('webview.valocation.loading'),
      })
    })
  })
})
