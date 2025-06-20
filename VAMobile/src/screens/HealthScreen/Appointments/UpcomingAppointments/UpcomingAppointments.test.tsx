import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { AppointmentStatusConstants, AppointmentsGetData, AppointmentsList } from 'api/types'
import { context, mockNavProps, render } from 'testUtils'
import { defaultAppointment } from 'utils/tests/appointments'

import UpcomingAppointments from './UpcomingAppointments'

const mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  const original = jest.requireActual('../../../../utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('UpcomingAppointments', () => {
  const appointmentData: AppointmentsList = [
    {
      ...defaultAppointment,
      attributes: {
        ...defaultAppointment.attributes,
        healthcareService: undefined,
      },
    },
  ]

  const initializeTestInstance = (appointmentsData?: AppointmentsGetData, loading = false) => {
    const props = mockNavProps()

    render(
      <UpcomingAppointments
        {...props}
        appointmentsData={appointmentsData}
        page={1}
        setPage={jest.fn()}
        loading={loading}
      />,
    )
  }

  describe('when loading is set to true', () => {
    it('shows loading screen and no appointments screen', () => {
      initializeTestInstance(undefined, true)
      expect(screen.getByText(t('appointments.loadingAppointments'))).toBeTruthy()
    })
  })

  describe('when no appointments', () => {
    it('shows no appointments screen', () => {
      initializeTestInstance(undefined)
      expect(screen.getByText(t('noAppointments.youDontHave'))).toBeTruthy()
    })
  })

  describe('on appointment press', () => {
    it('calls useRouteNavigation', async () => {
      initializeTestInstance({ data: appointmentData })
      fireEvent.press(
        screen.getByTestId('Saturday, February 6, 2021 11:53 AM PST Confirmed At VA Long Beach Healthcare System'),
      )
      expect(mockNavigationSpy).toHaveBeenCalledWith('UpcomingAppointmentDetails', {
        appointment: appointmentData[0],
        page: 1,
      })
    })
  })

  describe('when the status is CANCELLED', () => {
    it('renders "Canceled" label', async () => {
      appointmentData[0].attributes.status = 'CANCELLED'
      initializeTestInstance({ data: appointmentData })
      expect(screen.getByText(t('appointments.canceled'))).toBeTruthy()
    })
  })

  describe('when the status is CANCELLED and isPending is true', () => {
    it('renders "Canceled" label', async () => {
      appointmentData[0].attributes.status = AppointmentStatusConstants.CANCELLED
      appointmentData[0].attributes.isPending = true
      initializeTestInstance({ data: appointmentData })
      expect(screen.getByText(t('appointments.canceled'))).toBeTruthy()
    })
  })

  describe('when the status is SUBMITTED and isPending is true', () => {
    it('renders "Pending" label', async () => {
      appointmentData[0].attributes.status = AppointmentStatusConstants.SUBMITTED
      appointmentData[0].attributes.isPending = true
      initializeTestInstance({ data: appointmentData })
      expect(screen.getByText(t('appointments.pending'))).toBeTruthy()
    })
  })
})
