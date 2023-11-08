import 'react-native'
import React from 'react'

import { context, mockNavProps, render, waitFor, when } from 'testUtils'
import { screen } from '@testing-library/react-native'
import * as api from 'store/api'
import Appointments from './Appointments'
import { InitialState } from 'store/slices'
import { AppointmentsErrorServiceTypesConstants } from 'store/api/types'

jest.mock('../../../api/authorizedServices/getAuthorizedServices', () => {
  let original = jest.requireActual('../../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest.fn().mockReturnValue({
      status: "success",
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
        userProfileUpdate: true
      }
    }).mockReturnValueOnce({
      status: "success",
      data: {
        appeals: true,
        appointments: false,
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
        scheduleAppointments: false,
        secureMessaging: true,
        userProfileUpdate: true
      }
    })
  }
})

jest.mock('utils/remoteConfig')

context('AppointmentsScreen', () => {
  const initializeTestInstance = () => {

    render(<Appointments {...mockNavProps()} />, {
      preloadedState: {
        ...InitialState,
      },
    })
  }

  describe('when appointments is not authorized', () => {
    it('should display the NoMatchInRecords component', async () => {
      await waitFor(() => {
        initializeTestInstance()
      })
      expect(screen.getByText("You don’t have any appointments")).toBeTruthy()
    })
  })

  describe('when VaServiceError exists', () => {
    it('should display an alertbox specifying some appointments are not available', async () => {
      await waitFor(() => {
        when(api.get as jest.Mock)
          .calledWith(`/v0/appointments`, expect.anything())
          .mockResolvedValue({
            data: [],
            meta: {
              errors: [{ source: AppointmentsErrorServiceTypesConstants.VA }],
            },
          })
        initializeTestInstance()
      })
      expect(screen.getByText("We can't load some of your VA appointments")).toBeTruthy()
    })
  })

  describe('when CcServiceError exist', () => {
    it('should display an alertbox specifying some appointments are not available', async () => {
      await waitFor(() => {
        when(api.get as jest.Mock)
          .calledWith(`/v0/appointments`, expect.anything())
          .mockResolvedValue({
            data: [],
            meta: {
              errors: [{ source: AppointmentsErrorServiceTypesConstants.COMMUNITY_CARE }],
            },
          })
        initializeTestInstance()
      })
      expect(screen.getByText("We can't load some of your VA appointments")).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      await waitFor(() => {
        when(api.get as jest.Mock)
          .calledWith(`/v0/appointments`, expect.anything())
          .mockRejectedValue({ networkError: true } as api.APIError)
        initializeTestInstance()
      })
      expect(screen.getByText("We're having trouble getting your appointments. Refresh this screen or try again later.")).toBeTruthy()
    })
  })
})
