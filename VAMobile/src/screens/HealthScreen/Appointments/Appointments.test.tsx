import React from 'react'

import { screen } from '@testing-library/react-native'

import { AppointmentsErrorServiceTypesConstants } from 'api/types'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

import Appointments from './Appointments'

jest.mock('../../../api/authorizedServices/getAuthorizedServices', () => {
  const original = jest.requireActual('../../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest.fn().mockReturnValue({
      status: 'success',
      data: {
        appeals: true,
        appointments: true,
        claims: true,
        decisionLetters: true,
        directDepositBenefits: true,
        directDepositBenefitsUpdate: true,
        disabilityRating: true,
        genderIdentity: true,
        lettersAndDocuments: true,
        militaryServiceHistory: true,
        paymentHistory: true,
        preferredName: true,
        prescriptions: true,
        scheduleAppointments: true,
        secureMessaging: true,
        userProfileUpdate: true,
      },
    }),
  }
})

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
      await waitFor(() => expect(screen.getByText("We can't load some of your VA appointments")).toBeTruthy())
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
      await waitFor(() => expect(screen.getByText("We can't load some of your VA appointments")).toBeTruthy())
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/appointments`, expect.anything())
        .mockRejectedValue({ networkError: true } as api.APIError)
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText("The VA mobile app isn't working right now")).toBeTruthy())
    })
  })
})
