import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'
import { when } from 'jest-when'
import { DateTime } from 'luxon'

import { appointmentsKeys } from 'api/appointments'
import { prescriptionKeys } from 'api/prescriptions'
import { secureMessagingKeys } from 'api/secureMessaging'
import { DEFAULT_UPCOMING_DAYS_LIMIT, TimeFrameTypeConstants } from 'constants/appointments'
import { HealthScreen } from 'screens/HealthScreen/HealthScreen'
import { get } from 'store/api'
import { ErrorsState } from 'store/slices'
import { RenderParams, context, mockNavProps, render } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'
import { getAppointmentsPayload, getFoldersPayload, getPrescriptionsPayload } from 'utils/tests/personalization'

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

context('HealthScreen', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const initializeTestInstance = (options?: RenderParams) => {
    const props = mockNavProps(undefined, { setOptions: jest.fn(), navigate: mockNavigationSpy })

    render(<HealthScreen {...props} />, { ...options })
  }

  describe('Appointments button', () => {
    it('navigates to Appointments screen when pressed', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('link', { name: 'Appointments' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('Appointments')
    })

    it('displays upcoming appointment count when there are upcoming appointments', () => {
      const upcomingAppointmentsCount = 3
      initializeTestInstance({
        queriesData: [
          {
            queryKey: [appointmentsKeys.appointments, TimeFrameTypeConstants.UPCOMING],
            data: getAppointmentsPayload(upcomingAppointmentsCount, 5),
          },
        ],
      })
      expect(screen.getByRole('link', { name: 'Appointments' })).toBeTruthy()
      expect(
        screen.getByRole('link', {
          name: `${upcomingAppointmentsCount} in the next ${DEFAULT_UPCOMING_DAYS_LIMIT} days`,
        }),
      ).toBeTruthy()
    })

    it('does not display upcoming appointment count when there are no upcoming appointments', () => {
      const upcomingAppointmentsCount = 0
      initializeTestInstance({
        queriesData: [
          {
            queryKey: [appointmentsKeys.appointments, TimeFrameTypeConstants.UPCOMING],
            data: getAppointmentsPayload(upcomingAppointmentsCount, 5),
          },
        ],
      })
      expect(
        screen.queryByRole('link', {
          name: `${upcomingAppointmentsCount} in the next ${DEFAULT_UPCOMING_DAYS_LIMIT} days`,
        }),
      ).toBeFalsy()
    })

    it('does not display upcoming appointment count when the appointments API call throws an error', async () => {
      when(get as jest.Mock)
        .calledWith('/v0/appointments', expect.anything())
        .mockRejectedValue('fail')
      initializeTestInstance()
      await waitFor(() => expect(get).toHaveBeenCalledWith('/v0/appointments', expect.anything()))
      await waitFor(() =>
        expect(screen.queryByText(`in the next ${DEFAULT_UPCOMING_DAYS_LIMIT} days`, { exact: false })).toBeFalsy(),
      )
    })
  })

  describe('Travel button', () => {
    it('is not displayed if feature toggle is disabled', () => {
      when(featureEnabled as jest.Mock)
        .calledWith('travelPayStatusList')
        .mockReturnValue(false)
      initializeTestInstance()
      expect(screen.queryByText(t('travelPay.title'))).toBeFalsy()
    })

    it('is displayed if feature toggle is enabled', () => {
      when(featureEnabled as jest.Mock)
        .calledWith('travelPayStatusList')
        .mockReturnValue(true)
      initializeTestInstance()
      expect(screen.getByText(t('travelPay.title'))).toBeTruthy()
    })

    it('navigates to Travel Reimbursement screen when pressed', () => {
      when(featureEnabled as jest.Mock)
        .calledWith('travelPayStatusList')
        .mockReturnValue(true)
      initializeTestInstance()
      fireEvent.press(screen.getByText(t('travelPay.title')))
      expect(mockNavigationSpy).toHaveBeenCalledWith('TravelPayClaims')
    })
  })

  describe('Messages button', () => {
    it('navigates to Messages screen when pressed', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByText('Messages'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('SecureMessaging', { activeTab: 0 })
    })

    it('displays unread message count when there are unread messages', () => {
      const unreadMessageCount = 3
      initializeTestInstance({
        queriesData: [
          {
            queryKey: secureMessagingKeys.folders,
            data: getFoldersPayload(unreadMessageCount),
          },
        ],
      })
      expect(
        screen.getByRole('link', {
          name: `${unreadMessageCount} unread`,
        }),
      ).toBeTruthy()
    })

    it('does not display unread message count when there are no unread messages', () => {
      const unreadMessageCount = 0
      initializeTestInstance({
        queriesData: [
          {
            queryKey: secureMessagingKeys.folders,
            data: getFoldersPayload(unreadMessageCount),
          },
        ],
      })
      expect(
        screen.queryByRole('link', {
          name: `${unreadMessageCount} unread`,
        }),
      ).toBeFalsy()
    })
  })

  describe('Prescriptions button', () => {
    it('navigates to Prescription history screen when pressed', () => {
      initializeTestInstance()
      fireEvent.press(screen.getByText('Prescriptions'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('PrescriptionHistory')
    })

    it('is displayed correctly', () => {
      initializeTestInstance()
      expect(screen.getByText('Prescriptions')).toBeTruthy()
    })

    it('displays refill count when there are refillable prescriptions', () => {
      const refillCount = 3
      initializeTestInstance({
        queriesData: [
          {
            queryKey: prescriptionKeys.prescriptions,
            data: getPrescriptionsPayload(refillCount),
          },
        ],
      })
      expect(
        screen.getByRole('link', {
          name: `${refillCount} ready to refill`,
        }),
      ).toBeTruthy()
    })

    it('does not display refill count when there are no refillable prescriptions', () => {
      const refillCount = 0
      initializeTestInstance({
        queriesData: [
          {
            queryKey: prescriptionKeys.prescriptions,
            data: getPrescriptionsPayload(refillCount),
          },
        ],
      })
      expect(
        screen.queryByRole('link', {
          name: `${refillCount} ready to refill`,
        }),
      ).toBeFalsy()
    })
  })

  it('displays error message when one of the API calls fail', async () => {
    when(get as jest.Mock)
      .calledWith('/v0/appointments', expect.anything())
      .mockResolvedValue(getAppointmentsPayload(3, 5))
      .calledWith('/v0/messaging/health/folders')
      .mockResolvedValue(getFoldersPayload(3))
      .calledWith('/v0/health/rx/prescriptions', expect.anything())
      .mockRejectedValue('failure')

    initializeTestInstance()
    await waitFor(() =>
      expect(
        screen.getByText(
          "We can't get some of your information right now. Health activity may not be accurate. Check back later.",
        ),
      ).toBeTruthy(),
    )
  })

  it('displays error message when one of the health features are in downtime', async () => {
    when(get as jest.Mock)
      .calledWith('/v0/appointments', expect.anything())
      .mockResolvedValue(getAppointmentsPayload(3, 5))
      .calledWith('/v0/messaging/health/folders')
      .mockResolvedValue(getFoldersPayload(3))
      .calledWith('/v0/health/rx/prescriptions', expect.anything())
      .mockResolvedValue(getPrescriptionsPayload(3))

    initializeTestInstance({
      preloadedState: {
        errors: {
          downtimeWindowsByFeature: {
            rx_refill: {
              startTime: DateTime.now(),
              endTime: DateTime.now().plus({ minutes: 1 }),
            },
          },
        } as ErrorsState,
      },
    })
    await waitFor(() => expect(screen.queryByText('Loading mobile app activity...')).toBeFalsy())
    await waitFor(() =>
      expect(
        screen.getByText("We're working on the mobile app. Health activity may not be accurate. Check back later."),
      ).toBeTruthy(),
    )
  })

  it("navigates to Medical records screen when 'Medical records' button is pressed", () => {
    initializeTestInstance()
    fireEvent.press(screen.getByRole('link', { name: 'Medical records' }))
    expect(mockNavigationSpy).toHaveBeenCalledWith('MedicalRecordsList')
  })
})
