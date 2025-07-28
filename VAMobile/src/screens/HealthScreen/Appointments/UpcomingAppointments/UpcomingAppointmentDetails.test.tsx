import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'
import { DateTime } from 'luxon'

import { appointmentsKeys } from 'api/appointments'
import { AppointmentsGetData, AppointmentsList } from 'api/types'
import { TimeFrameTypeConstants } from 'constants/appointments'
import UpcomingAppointmentDetails from 'screens/HealthScreen/Appointments/UpcomingAppointments/UpcomingAppointmentDetails'
import * as api from 'store/api'
import { context, mockNavProps, render, when } from 'testUtils'

const mockShowActionSheetWithOptions = jest.fn()
jest.mock('@expo/react-native-action-sheet', () => {
  const original = jest.requireActual('@expo/react-native-action-sheet')
  return {
    ...original,
    useActionSheet: () => {
      return { showActionSheetWithOptions: mockShowActionSheetWithOptions }
    },
  }
})

let mockLogNonFatalErrorToFirebase: jest.Mock
jest.mock('utils/analytics', () => {
  mockLogNonFatalErrorToFirebase = jest.fn()
  const original = jest.requireActual('utils/analytics')
  return {
    ...original,
    logNonFatalErrorToFirebase: mockLogNonFatalErrorToFirebase,
  }
})

let defaultAppointments: AppointmentsList = []

context('UpcomingAppointmentDetails', () => {
  const initializeTestInstance = (appointments: AppointmentsList, upcomingAppointmentsCount = 0) => {
    const request = {
      appointment: '',
      vetextID: '442;3240628.12',
    }
    const props = mockNavProps(undefined, { goBack: jest.fn() }, { params: request })

    when(api.get as jest.Mock)
      .calledWith('/v0/appointments', expect.anything())
      .mockResolvedValue({ data: appointments, meta: { upcomingAppointmentsCount } })

    return render(<UpcomingAppointmentDetails {...props} />)
  }

  describe('when cancelling an upcoming appointment', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      defaultAppointments = [
        {
          id: '40977d8c1f4f0ed3f692403bed8d69cd4c8e47d44087c2cec9fbff842b82185d',
          type: 'appointment',
          attributes: {
            appointmentType: 'COMMUNITY_CARE',
            cancelId: '123',
            comment: '',
            healthcareProvider: 'GUARINO, ANTHONY',
            healthcareService: undefined,
            location: {
              name: '',
            },
            minutesDuration: 60,
            phoneOnly: false,
            startDateLocal: DateTime.now().plus({ minutes: 45 }).toString(),
            startDateUtc: DateTime.utc().plus({ minutes: 45 }).toISO(),
            status: 'SUBMITTED',
            statusDetail: null,
            timeZone: 'America/Denver',
            vetextId: '442;3240628.12',
            reason: null,
            isCovidVaccine: false,
            isPending: true,
            proposedTimes: [
              {
                date: '05/16/2024',
                time: 'AM',
              },
            ],
            typeOfCare: 'Podiatry',
            patientPhoneNumber: '724-316-5274',
            patientEmail: 'christopher.ray3@va.gov',
            bestTimeToCall: ['Afternoon', 'Evening'],
            friendlyLocationName: 'Denver VA Medical Center',
            serviceCategoryName: null,
            travelPayEligible: false,
          },
        },
        {
          id: '8a48e2fe7956f4d30179cddf3f3d00ac',
          type: 'appointment',
          attributes: {
            appointmentType: 'COMMUNITY_CARE',
            comment: 'instructions to veteran.  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx123',
            healthcareProvider: 'Vilanisi Reddy',
            healthcareService: 'Outpatient Clinic',
            location: {
              name: 'Outpatient Clinic',
            },
            minutesDuration: 60,
            phoneOnly: false,
            startDateLocal: DateTime.now().plus({ minutes: 45 }).toString(),
            startDateUtc: DateTime.utc().plus({ minutes: 45 }).toISO(),
            status: 'BOOKED',
            statusDetail: null,
            timeZone: 'America/Los_Angeles',
            vetextId: '',
            reason: 'Test',
            isCovidVaccine: false,
            typeOfCare: 'Podiatry',
            serviceCategoryName: null,
            isPending: false,
            travelPayEligible: false,
          },
        },
      ]
    })

    it('should update appointment on success', async () => {
      when(api.put as jest.Mock)
        .calledWith('/v0/appointments/cancel/123', expect.anything())
        .mockResolvedValueOnce('success')
      const { queryClient } = initializeTestInstance(defaultAppointments)

      // Press cancel request button
      await waitFor(() => {
        fireEvent.press(screen.getByTestId(t('cancelRequest')))
      })

      // Action sheet to confirm cancelling opens
      expect(mockShowActionSheetWithOptions).toHaveBeenCalled()
      const actionSheetCall = mockShowActionSheetWithOptions.mock.calls[0]
      const [actionSheetConfig, actionSheetSelect] = actionSheetCall

      // Mock pressing confirm cancel button
      actionSheetSelect(actionSheetConfig.destructiveButtonIndex)

      await waitFor(() => expect(api.put).toHaveBeenCalledWith('/v0/appointments/cancel/123'))

      // validate updated state post cancellation
      const updatedAppointments = queryClient.getQueryData([
        appointmentsKeys.appointments,
        TimeFrameTypeConstants.UPCOMING,
      ]) as AppointmentsGetData

      expect(updatedAppointments.data[0].attributes.status).toEqual('CANCELLED')
      expect(updatedAppointments.data[0].attributes.cancelId).toEqual('123')
      expect(updatedAppointments.meta?.upcomingAppointmentsCount).toEqual(0)
    })
    it('should update upcoming appointments count on success', async () => {
      when(api.put as jest.Mock)
        .calledWith('/v0/appointments/cancel/123', expect.anything())
        .mockResolvedValueOnce('success')
      const { queryClient } = initializeTestInstance(defaultAppointments, 2)

      // Press cancel request button
      await waitFor(() => {
        fireEvent.press(screen.getByTestId(t('cancelRequest')))
      })

      // Action sheet to confirm cancelling opens
      expect(mockShowActionSheetWithOptions).toHaveBeenCalled()
      const actionSheetCall = mockShowActionSheetWithOptions.mock.calls[0]
      const [actionSheetConfig, actionSheetSelect] = actionSheetCall

      // Mock pressing confirm cancel button
      actionSheetSelect(actionSheetConfig.destructiveButtonIndex)

      await waitFor(() => expect(api.put).toHaveBeenCalledWith('/v0/appointments/cancel/123'))

      // validate updated state post cancellation
      const updatedAppointments = queryClient.getQueryData([
        appointmentsKeys.appointments,
        TimeFrameTypeConstants.UPCOMING,
      ]) as AppointmentsGetData

      expect(updatedAppointments.data[0].attributes.status).toEqual('CANCELLED')
      expect(updatedAppointments.data[0].attributes.cancelId).toEqual('123')
      expect(updatedAppointments.meta?.upcomingAppointmentsCount).toEqual(1)
    })
    it('should not update upcoming appointments count on success based on default date range', async () => {
      when(api.put as jest.Mock)
        .calledWith('/v0/appointments/cancel/123', expect.anything())
        .mockResolvedValueOnce('success')
      // start date is outside default date range
      defaultAppointments[0].attributes.startDateUtc = DateTime.utc().plus({ days: 31 }).toISO()
      const { queryClient } = initializeTestInstance(defaultAppointments, 2)

      // Press cancel request button
      await waitFor(() => {
        fireEvent.press(screen.getByTestId(t('cancelRequest')))
      })

      // Action sheet to confirm cancelling opens
      expect(mockShowActionSheetWithOptions).toHaveBeenCalled()
      const actionSheetCall = mockShowActionSheetWithOptions.mock.calls[0]
      const [actionSheetConfig, actionSheetSelect] = actionSheetCall

      // Mock pressing confirm cancel button
      actionSheetSelect(actionSheetConfig.destructiveButtonIndex)

      await waitFor(() => expect(api.put).toHaveBeenCalledWith('/v0/appointments/cancel/123'))

      // validate updated state post cancellation
      const updatedAppointments = queryClient.getQueryData([
        appointmentsKeys.appointments,
        TimeFrameTypeConstants.UPCOMING,
      ]) as AppointmentsGetData

      expect(updatedAppointments.data[0].attributes.status).toEqual('CANCELLED')
      expect(updatedAppointments.data[0].attributes.cancelId).toEqual('123')
      expect(updatedAppointments.meta?.upcomingAppointmentsCount).toEqual(2)
    })

    it('should log an error on failure', async () => {
      initializeTestInstance(defaultAppointments)
      when(api.put as jest.Mock)
        .calledWith('/v0/appointments/cancel/123')
        .mockRejectedValueOnce({
          status: 400,
          networkError: true,
        })
      // Press cancel request button
      await waitFor(() => {
        fireEvent.press(screen.getByTestId(t('cancelRequest')))
      })

      // Action sheet to confirm cancelling opens
      expect(mockShowActionSheetWithOptions).toHaveBeenCalled()
      const actionSheetCall = mockShowActionSheetWithOptions.mock.calls[0]
      const [actionSheetConfig, actionSheetSelect] = actionSheetCall

      // Mock pressing confirm cancel button
      actionSheetSelect(actionSheetConfig.destructiveButtonIndex)

      // Validate the cancel request has been made and the error has been logged
      await waitFor(() => expect(api.put).toHaveBeenCalledWith('/v0/appointments/cancel/123'))
      expect(mockLogNonFatalErrorToFirebase).toHaveBeenCalled()
    })
  })
})
