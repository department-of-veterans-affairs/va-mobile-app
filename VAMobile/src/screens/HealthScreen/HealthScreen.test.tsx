import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { when } from 'jest-when'
import { DateTime } from 'luxon'

import { appointmentsKeys } from 'api/appointments'
import { prescriptionKeys } from 'api/prescriptions'
import { secureMessagingKeys } from 'api/secureMessaging'
import { DEFAULT_UPCOMING_DAYS_LIMIT, TimeFrameTypeConstants } from 'constants/appointments'
import { get } from 'store/api'
import { ErrorsState } from 'store/slices'
import { RenderParams, context, mockNavProps, render } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'
import { getAppointmentsPayload, getFoldersPayload, getPrescriptionsPayload } from 'utils/tests/personalization'

import { HealthScreen } from './HealthScreen'

const mockNavigationSpy = jest.fn()

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
            data: getAppointmentsPayload(upcomingAppointmentsCount),
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
            data: getAppointmentsPayload(upcomingAppointmentsCount),
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
      when(mockFeatureEnabled).calledWith('prescriptions').mockReturnValue(true)
      initializeTestInstance()
      fireEvent.press(screen.getByText('Prescriptions'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('PrescriptionHistory')
    })

    it('is not displayed if feature toggle is disabled', () => {
      when(mockFeatureEnabled).calledWith('prescriptions').mockReturnValue(false)
      initializeTestInstance()
      expect(screen.getByText('Appointments')).toBeTruthy()
      expect(screen.getByText('Messages')).toBeTruthy()
      expect(screen.queryByText('Prescriptions')).toBeFalsy()
      expect(screen.getByText('V\ufeffA vaccine records')).toBeTruthy()
    })

    it('is displayed if feature toggle is enabled', () => {
      when(mockFeatureEnabled).calledWith('prescriptions').mockReturnValue(true)
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
      .mockResolvedValue(getAppointmentsPayload(3))
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
      .mockResolvedValue(getAppointmentsPayload(3))
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

  it("navigates to Vaccines screen when 'VA vaccine records' button is pressed", () => {
    initializeTestInstance()
    fireEvent.press(screen.getByRole('link', { name: 'V\ufeffA vaccine records' }))
    expect(mockNavigationSpy).toHaveBeenCalledWith('VaccineList')
  })
})
