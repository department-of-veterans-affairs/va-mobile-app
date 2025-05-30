import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'
import { DateTime } from 'luxon'

import { AppointmentStatus, AppointmentStatusConstants, AppointmentsGetData, AppointmentsList } from 'api/types'
import { ErrorsState } from 'store/slices'
import { RenderParams, context, mockNavProps, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'
import { defaultAppointment, defaultAppointmentAttributes } from 'utils/tests/appointments'

import PastAppointments from './PastAppointments'

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

jest.mock('utils/remoteConfig')

context('PastAppointments', () => {
  const appointmentData = (
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    isPending = false,
  ): AppointmentsList => {
    return [
      {
        ...defaultAppointment,
        attributes: {
          ...defaultAppointmentAttributes,
          healthcareService: undefined,
          status,
          isPending,
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
})
