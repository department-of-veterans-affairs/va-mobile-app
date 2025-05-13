import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { AppointmentsErrorServiceTypesConstants } from 'api/types'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

import Appointments from './Appointments'

const mockNavigationSpy = jest.fn()

jest.mock('utils/remoteConfig')

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useBeforeNavBackListener: jest.fn(),
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('AppointmentsScreen', () => {
  const mockFeatureEnabled = featureEnabled as jest.Mock
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

  describe('when startScheduling is true', () => {
    when(mockFeatureEnabled).calledWith('startScheduling').mockReturnValue(true)
    it('should show the Start Scheduling link', async () => {
      initializeTestInstance()
      expect(screen.getByText(t('appointments.startScheduling'))).toBeTruthy()
    })

    it('should be a clickable webview that navigates to the scheduling weblink flow', async () => {
      initializeTestInstance()
      fireEvent.press(screen.getByRole('link', { name: t('appointments.startScheduling') }))
      const expectNavArgs = {
        url: 'https://va.gov/my-health/appointments/schedule/type-of-care',
        displayTitle: t('webview.vagov'),
        loadingMessage: t('webview.appointments.loading'),
        useSSO: true,
      }
      expect(mockNavigationSpy).toHaveBeenCalledWith('Webview', expectNavArgs)
    })
  })
})
