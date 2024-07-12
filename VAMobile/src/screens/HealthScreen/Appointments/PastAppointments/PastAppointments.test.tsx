import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { AppointmentStatus, AppointmentStatusConstants, AppointmentsGetData, AppointmentsList } from 'api/types'
import { context, mockNavProps, render } from 'testUtils'
import { defaultAppoinment, defaultAppointmentAttributes } from 'utils/tests/appointments'

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

context('PastAppointments', () => {
  const appointmentData = (
    status: AppointmentStatus = AppointmentStatusConstants.BOOKED,
    isPending = false,
  ): AppointmentsList => {
    return [
      {
        ...defaultAppoinment,
        attributes: {
          ...defaultAppointmentAttributes,
          healthcareService: undefined,
          status,
          isPending,
        },
      },
    ]
  }

  const initializeTestInstance = (appointmentsData?: AppointmentsGetData, loading = false) => {
    const props = mockNavProps()

    render(
      <PastAppointments
        {...props}
        appointmentsData={appointmentsData}
        page={1}
        setPage={jest.fn()}
        loading={loading}
      />,
    )
  }

  it('initializes correctly', () => {
    initializeTestInstance({ data: appointmentData() })
    expect(screen.getByText('Select a date range')).toBeTruthy()
    expect(screen.getAllByText('Past 3 months')).toBeTruthy()
    expect(
      screen.getByTestId('Saturday, February 6, 2021 11:53 AM PST Confirmed At VA Long Beach Healthcare System'),
    ).toBeTruthy()
  })

  describe('when loading is set to true', () => {
    it('shows loading screen', () => {
      initializeTestInstance(undefined, true)
      expect(screen.getByText('Loading your appointments...')).toBeTruthy()
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
      expect(screen.getByText('Canceled')).toBeTruthy()
    })
  })

  describe('when the status is CANCELLED and isPending is true', () => {
    it('renders the "Canceled" label', () => {
      initializeTestInstance({ data: appointmentData(AppointmentStatusConstants.CANCELLED, true) })
      expect(screen.getByText('Canceled')).toBeTruthy()
    })
  })

  describe('when the status is SUBMITTED and isPending is true', () => {
    it('renders the "Pending" label', () => {
      initializeTestInstance({ data: appointmentData(AppointmentStatusConstants.SUBMITTED, true) })
      expect(screen.getByText('Pending')).toBeTruthy()
    })
  })

  describe('when there are no appointments', () => {
    it('renders NoAppointments', () => {
      initializeTestInstance()
      expect(screen.getByText('You don’t have any appointments')).toBeTruthy()
    })
  })
})
