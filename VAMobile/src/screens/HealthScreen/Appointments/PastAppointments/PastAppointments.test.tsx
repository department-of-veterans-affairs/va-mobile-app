import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'
import { DateTime } from 'luxon'

import { AppointmentStatus, AppointmentStatusConstants, AppointmentsGetData, AppointmentsList } from 'api/types'
import PastAppointments from 'screens/HealthScreen/Appointments/PastAppointments/PastAppointments'
import { ErrorsState } from 'store/slices'
import { RenderParams, context, mockNavProps, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'
import { defaultAppointment, defaultAppointmentAttributes } from 'utils/tests/appointments'

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
  const appointmentData = (
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    isPending = false,
    startDateUtc?: string,
  ): AppointmentsList => {
    return [
      {
        ...defaultAppointment,
        attributes: {
          ...defaultAppointmentAttributes,
          healthcareService: undefined,
          status,
          isPending,
          startDateUtc: startDateUtc || defaultAppointmentAttributes.startDateUtc,
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
  ) => {
    when(mockFeatureEnabled).calledWith('travelPaySMOC').mockReturnValue(travelPaySMOCEnabled)
    const props = mockNavProps()

    render(
      <PastAppointments
        {...props}
        appointmentsData={appointmentsData}
        page={1}
        setPage={jest.fn()}
        loading={loading}
      />,
      { ...options },
    )
  }

  it('initializes correctly', () => {
    initializeTestInstance({ data: appointmentData() })
    expect(screen.getByText(t('pastAppointments.selectADateRange'))).toBeTruthy()
    expect(screen.getAllByText(t('pastAppointments.pastThreeMonths'))).toBeTruthy()
    expect(
      screen.getByTestId('Saturday, February 6, 2021 11:53 AM PST Confirmed At VA Long Beach Healthcare System'),
    ).toBeTruthy()
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
      fireEvent.press(
        screen.getByTestId('Saturday, February 6, 2021 11:53 AM PST Confirmed At VA Long Beach Healthcare System'),
      )
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
      initializeTestInstance({ data: appointmentData() }, false, true, {
        preloadedState: {
          errors: {
            downtimeWindowsByFeature: {
              travel_pay_features: {
                startTime: DateTime.now(),
                endTime: DateTime.now().plus({ hours: 1 }),
              },
            },
          } as ErrorsState,
        },
      })
      expect(screen.getByText(t('travelPay.downtime.apptsTitle'))).toBeTruthy()
      // Verify that the rest of the component is still rendered
      expect(screen.getByText(t('pastAppointments.selectADateRange'))).toBeTruthy()
      expect(screen.getAllByText(t('pastAppointments.pastThreeMonths'))).toBeTruthy()
      expect(
        screen.getByTestId('Saturday, February 6, 2021 11:53 AM PST Confirmed At VA Long Beach Healthcare System'),
      ).toBeTruthy()
    })

    it('does not show downtime alert when feature flag is not enabled', () => {
      initializeTestInstance({ data: appointmentData() }, false, false, {
        preloadedState: {
          errors: {
            downtimeWindowsByFeature: {
              travel_pay_features: {
                startTime: DateTime.now(),
                endTime: DateTime.now().plus({ hours: 1 }),
              },
            },
          } as ErrorsState,
        },
      })
      expect(screen.queryByText(t('travelPay.downtime.apptsTitle'))).toBeNull()
      // Verify that the rest of the component is still rendered
      expect(screen.getByText(t('pastAppointments.selectADateRange'))).toBeTruthy()
      expect(screen.getAllByText(t('pastAppointments.pastThreeMonths'))).toBeTruthy()
      expect(
        screen.getByTestId('Saturday, February 6, 2021 11:53 AM PST Confirmed At VA Long Beach Healthcare System'),
      ).toBeTruthy()
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
      )

      expect(screen.queryByText(t('appointments.confirmed'))).toBeFalsy() // Confirmed tag should not be present
      expect(screen.getByText(t('travelPay.daysToFile', { count: 27, days: 27 }))).toBeTruthy() // Travel pay tag should be present
    })

    it('should show confirmed tag when travel pay is not eligible due to old date', () => {
      const oldDate = '2023-12-01T00:00:00Z' // Date more than 30 days ago to make travel pay ineligible

      initializeTestInstance({ data: appointmentData(AppointmentStatusConstants.BOOKED, false, oldDate) }, false, true)

      expect(screen.getByText(t('appointments.confirmed'))).toBeTruthy() // Confirmed tag should be present
      expect(screen.queryByText(t('travelPay.daysToFile', { count: 27, days: 27 }))).toBeFalsy() // Travel pay tag should not be present
    })

    it('should show confirmed tag when travel pay metadata is missing', () => {
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      const isoString = threeDaysAgo.toISOString()

      const appointmentWithNoMetadata = [
        {
          ...defaultAppointment,
          attributes: {
            ...defaultAppointmentAttributes,
            healthcareService: undefined,
            status: AppointmentStatusConstants.BOOKED,
            isPending: false,
            startDateUtc: isoString,
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
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      const isoString = threeDaysAgo.toISOString()

      const appointmentWithErrorMetadata = [
        {
          ...defaultAppointment,
          attributes: {
            ...defaultAppointmentAttributes,
            healthcareService: undefined,
            status: AppointmentStatusConstants.BOOKED,
            isPending: false,
            startDateUtc: isoString,
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
