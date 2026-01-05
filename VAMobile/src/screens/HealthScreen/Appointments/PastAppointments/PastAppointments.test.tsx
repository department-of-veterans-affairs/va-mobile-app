import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'
import { DateTime } from 'luxon'

import { useMaintenanceWindows } from 'api/maintenanceWindows/getMaintenanceWindows'
import { AppointmentStatus, AppointmentStatusConstants, AppointmentsGetData, AppointmentsList } from 'api/types'
import PastAppointments from 'screens/HealthScreen/Appointments/PastAppointments/PastAppointments'
import { DowntimeWindowsByFeatureType } from 'store/slices'
import { RenderParams, context, mockNavProps, render, when } from 'testUtils'
import { getPastAppointmentDateRange } from 'utils/appointments'
import { getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone } from 'utils/formattingUtils'
import { featureEnabled } from 'utils/remoteConfig'
import { defaultAppointment, defaultAppointmentAttributes } from 'utils/tests/appointments'
import { getMaintenanceWindowsPayload } from 'utils/tests/maintenanceWindows'

const mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  const original = jest.requireActual('../../../../utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('../../../../utils/platform', () => {
  const actual = jest.requireActual('../../../../utils/platform')
  return {
    ...actual,
    isAndroid: jest.fn(() => {
      return true
    }),
  }
})

const useMaintenanceWindowsMock = useMaintenanceWindows as jest.Mock
jest.mock('api/maintenanceWindows/getMaintenanceWindows', () => {
  return {
    useMaintenanceWindows: jest.fn().mockReturnValue({ maintenanceWindows: {} }),
  }
})

jest.mock('api/queryClient', () => {
  const original = jest.requireActual('@tanstack/react-query')

  return {
    useQuery: original.useQuery,
  }
})

jest.mock('utils/hooks/offline', () => {
  const original = jest.requireActual('utils/hooks/offline')

  return {
    ...original,
    useOfflineEventQueue: () => jest.fn(),
  }
})

jest.mock('utils/remoteConfig')

context('PastAppointments', () => {
  const mockStartDateUTC = DateTime.utc().minus({ days: 7 }).toISO()
  const mockDateAndTime =
    getFormattedDateWithWeekdayForTimeZone(mockStartDateUTC, 'America/Los_Angeles') +
    ' ' +
    getFormattedTimeForTimeZone(mockStartDateUTC, 'America/Los_Angeles')

  const appointmentData = (
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    isPending = false,
    startDateUtc: string = mockStartDateUTC,
  ): AppointmentsList => {
    const startDateLocal = DateTime.fromISO(startDateUtc).toLocal().toISO() || ''

    return [
      {
        ...defaultAppointment,
        attributes: {
          ...defaultAppointmentAttributes,
          healthcareService: undefined,
          status,
          isPending,
          startDateUtc: startDateUtc,
          startDateLocal: startDateLocal,
          travelPayClaim: {
            metadata: {
              status: 200,
              message: 'Data retrieved successfully',
              success: true,
            },
            claim: undefined,
          },
        },
      },
    ]
  }

  const mockFeatureEnabled = featureEnabled as jest.Mock

  const initializeTestInstance = (
    appointmentsData?: AppointmentsGetData,
    loading = false,
    travelPaySMOCEnabled = false,
    options?: RenderParams,
    maintenanceWindows?: { maintenanceWindows: DowntimeWindowsByFeatureType },
  ) => {
    when(mockFeatureEnabled).calledWith('travelPaySMOC').mockReturnValue(travelPaySMOCEnabled)
    const props = mockNavProps()
    useMaintenanceWindowsMock.mockReturnValue(
      maintenanceWindows || getMaintenanceWindowsPayload(['travel_pay_features']),
    )

    render(
      <PastAppointments
        {...props}
        appointmentsData={appointmentsData}
        dateRange={getPastAppointmentDateRange()}
        page={1}
        setPage={jest.fn()}
        loading={loading}
      />,
      { ...options },
    )
  }

  it('initializes correctly', () => {
    initializeTestInstance({ data: appointmentData() })

    expect(screen.getByText(t('pastAppointments.selectAPastDateRange'))).toBeTruthy()
    expect(screen.getByText(t('reset'))).toBeTruthy()
    expect(screen.getByText(t('datePicker.from'))).toBeTruthy()
    expect(screen.getByText(t('datePicker.to'))).toBeTruthy()
    expect(screen.getByRole('button', { name: t('apply') })).toBeTruthy()
    expect(screen.getByTestId(`${mockDateAndTime} Confirmed At VA Long Beach Healthcare System`)).toBeTruthy()
  })

  describe('when loading is set to true', () => {
    it('shows loading screen', () => {
      initializeTestInstance(undefined, true)
      expect(screen.getByText(t('appointments.loadingAppointments'))).toBeTruthy()
    })
  })

  describe('when a appointment is clicked', () => {
    it('calls useRouteNavigation', () => {
      initializeTestInstance({ data: appointmentData() })
      fireEvent.press(screen.getByTestId(`${mockDateAndTime} Confirmed At VA Long Beach Healthcare System`))
      expect(mockNavigationSpy).toHaveBeenCalledWith('PastAppointmentDetails', {
        appointment: appointmentData()[0],
      })
    })
  })

  describe('when the status is CANCELLED', () => {
    it('renders the "Canceled" label', () => {
      initializeTestInstance({ data: appointmentData(AppointmentStatusConstants.CANCELLED) })
      expect(screen.getByText(t('appointments.canceled'))).toBeTruthy()
    })
  })

  describe('when the status is CANCELLED and isPending is true', () => {
    it('renders the "Canceled" label', () => {
      initializeTestInstance({ data: appointmentData(AppointmentStatusConstants.CANCELLED, true) })
      expect(screen.getByText(t('appointments.canceled'))).toBeTruthy()
    })
  })

  describe('when the status is SUBMITTED and isPending is true', () => {
    it('renders the "Pending" label', () => {
      initializeTestInstance({ data: appointmentData(AppointmentStatusConstants.SUBMITTED, true) })
      expect(screen.getByText(t('appointments.pending'))).toBeTruthy()
    })
  })

  describe('when there are no appointments', () => {
    it('renders NoAppointments', () => {
      initializeTestInstance()
      expect(screen.getByText(t('noAppointments.youDontHave'))).toBeTruthy()
    })
  })

  describe('when travel pay is in downtime', () => {
    it('shows downtime alert when feature flag is enabled', () => {
      initializeTestInstance({ data: appointmentData() }, false, true)
      expect(screen.getByText(t('travelPay.downtime.apptsTitle'))).toBeTruthy()
      // Verify that the rest of the component is still rendered
      expect(screen.getByText(t('pastAppointments.selectAPastDateRange'))).toBeTruthy()
      expect(screen.getByText(t('reset'))).toBeTruthy()
      expect(screen.getByText(t('datePicker.from'))).toBeTruthy()
      expect(screen.getByText(t('datePicker.to'))).toBeTruthy()
      expect(screen.getByTestId(`${mockDateAndTime} Confirmed At VA Long Beach Healthcare System`)).toBeTruthy()
    })

    it('does not show downtime alert when feature flag is not enabled', () => {
      initializeTestInstance({ data: appointmentData() }, false, false)
      expect(screen.queryByText(t('travelPay.downtime.apptsTitle'))).toBeNull()
      // Verify that the rest of the component is still rendered
      expect(screen.getByText(t('pastAppointments.selectAPastDateRange'))).toBeTruthy()
      expect(screen.getByText(t('reset'))).toBeTruthy()
      expect(screen.getByText(t('datePicker.from'))).toBeTruthy()
      expect(screen.getByText(t('datePicker.to'))).toBeTruthy()
      expect(screen.getByTestId(`${mockDateAndTime} Confirmed At VA Long Beach Healthcare System`)).toBeTruthy()
    })
  })

  describe('appointment travel pay eligibility and tag display', () => {
    it('should show travel pay tag and hide confirmed tag for eligible appointments', () => {
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      const isoString = threeDaysAgo.toISOString()

      initializeTestInstance(
        { data: appointmentData(AppointmentStatusConstants.BOOKED, false, isoString) },
        false,
        true,
        undefined,
        { maintenanceWindows: { travel_pay_features: undefined } },
      )

      expect(screen.queryByText(t('appointments.confirmed'))).toBeFalsy() // Confirmed tag should not be present
      expect(screen.getByText(t('travelPay.daysToFile', { count: 27, days: 27 }))).toBeTruthy() // Travel pay tag should be present
    })

    it('should show confirmed tag when travel pay is not eligible due to old date', () => {
      const oldDate = DateTime.utc().minus({ days: 31 }).toISO() // Date more than 30 days ago to make travel pay ineligible

      initializeTestInstance({ data: appointmentData(AppointmentStatusConstants.BOOKED, false, oldDate) }, false, true)

      expect(screen.getByText(t('appointments.confirmed'))).toBeTruthy() // Confirmed tag should be present
      expect(screen.queryByText(t('travelPay.daysToFile', { count: 27, days: 27 }))).toBeFalsy() // Travel pay tag should not be present
    })

    it('should show confirmed tag when travel pay metadata is missing', () => {
      const threeDaysAgo = DateTime.utc().minus({ days: 3 })
      const isoString = threeDaysAgo.toISO()
      const localIsoString = threeDaysAgo.toLocal().toISO()

      const appointmentWithNoMetadata = [
        {
          ...defaultAppointment,
          attributes: {
            ...defaultAppointmentAttributes,
            healthcareService: undefined,
            status: AppointmentStatusConstants.BOOKED,
            isPending: false,
            startDateUtc: isoString,
            startDateLocal: localIsoString,
            travelPayClaim: undefined, // No metadata
            travelPayEligible: false,
          },
        },
      ]

      initializeTestInstance({ data: appointmentWithNoMetadata }, false, true)

      expect(screen.getByText(t('appointments.confirmed'))).toBeTruthy() // Confirmed tag should be present
      expect(screen.queryByText(t('travelPay.daysToFile', { count: 27, days: 27 }))).toBeFalsy() // Travel pay tag should not be present
    })

    it.each([
      { status: 400, message: 'Bad request' },
      { status: 500, message: 'Internal server error' },
    ])('should show confirmed tag when travel pay metadata status is $status', ({ status, message }) => {
      const threeDaysAgo = DateTime.utc().minus({ days: 3 })
      const isoString = threeDaysAgo.toISO()
      const localIsoString = threeDaysAgo.toLocal().toISO()

      const appointmentWithErrorMetadata = [
        {
          ...defaultAppointment,
          attributes: {
            ...defaultAppointmentAttributes,
            healthcareService: undefined,
            status: AppointmentStatusConstants.BOOKED,
            isPending: false,
            startDateUtc: isoString,
            startDateLocal: localIsoString,
            travelPayClaim: {
              metadata: {
                status,
                message,
                success: false,
              },
              claim: undefined,
            },
            travelPayEligible: false,
          },
        },
      ]

      initializeTestInstance({ data: appointmentWithErrorMetadata }, false, true)

      expect(screen.getByText(t('appointments.confirmed'))).toBeTruthy() // Confirmed tag should be present
      expect(screen.queryByText(t('travelPay.daysToFile', { count: 27, days: 27 }))).toBeFalsy() // Travel pay tag should not be present
    })
  })
})
