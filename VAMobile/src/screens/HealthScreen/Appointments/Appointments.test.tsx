import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { AppointmentsErrorServiceTypesConstants } from 'api/types'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

import Appointments from './Appointments'

jest.mock('utils/remoteConfig')

context('AppointmentsScreen', () => {
  const initializeTestInstance = () => {
    render(<Appointments {...mockNavProps()} />)
  }

  describe('when VaServiceError exists', () => {
    it('should display an alertbox specifying some appointments are not available', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appointments`, expect.anything())
        .mockResolvedValue({
          data: [],
          meta: {
            errors: [{ source: AppointmentsErrorServiceTypesConstants.VA }],
          },
        })
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText(t('appointments.appointmentsStatusSomeUnavailable'))).toBeTruthy())
    })
  })

  describe('when CcServiceError exist', () => {
    it('should display an alertbox specifying some appointments are not available', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appointments`, expect.anything())
        .mockResolvedValue({
          data: [],
          meta: {
            errors: [{ source: AppointmentsErrorServiceTypesConstants.VA }],
          },
        })
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText(t('appointments.appointmentsStatusSomeUnavailable'))).toBeTruthy())
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appointments`, expect.anything())
        .mockRejectedValue({ networkError: true } as api.APIError)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText(t('errors.networkConnection.header'))).toBeTruthy())
    })
  })
})
