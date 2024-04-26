import React from 'react'

import { screen } from '@testing-library/react-native'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { ClaimsAndAppealsGetDataMetaError, ClaimsAndAppealsListPayload } from 'api/types'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { CommonErrorTypesConstants } from 'constants/errors'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, waitFor, when } from 'testUtils'

import ClaimsHistoryScreen from './ClaimsHistoryScreen'

jest.mock('../../../../api/authorizedServices/getAuthorizedServices', () => {
  const original = jest.requireActual('../../../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest
      .fn()
      .mockReturnValue({
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
      })
      .mockReturnValueOnce({
        status: 'success',
        data: {
          appeals: false,
          appointments: true,
          claims: false,
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
      })
      .mockReturnValueOnce({
        status: 'success',
        data: {
          appeals: false,
          appointments: true,
          claims: false,
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

const mockPayload: ClaimsAndAppealsListPayload = {
  data: [
    {
      id: '0',
      type: 'appeal',
      attributes: {
        subtype: 'supplementalClaim',
        completed: false,
        decisionLetterSent: false,
        dateFiled: '2020-10-22',
        updatedAt: '2020-10-28',
        displayTitle: 'supplemental claim for disability compensation',
      },
    },
    {
      id: '2',
      type: 'claim',
      attributes: {
        subtype: 'Compensation',
        completed: false,
        decisionLetterSent: false,
        dateFiled: '2020-10-22',
        updatedAt: '2020-10-30',
        displayTitle: 'Compensation',
      },
    },
  ],
  meta: {
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalEntries: 3,
    },
  },
}

context('ClaimsHistoryScreen', () => {
  const initializeTestInstance = (errors?: Array<ClaimsAndAppealsGetDataMetaError>) => {
    const queryPayload = mockPayload
    queryPayload.meta.errors = errors
    const queriesData: QueriesData = [
      {
        queryKey: [claimsAndAppealsKeys.claimsAndAppeals, 'ACTIVE', '1'],
        data: queryPayload,
      },
    ]
    render(<ClaimsHistoryScreen {...mockNavProps()} />, { queriesData })
  }

  describe('when claims service and appeals service are both not authorized', () => {
    it('should render the NoClaimsAndAppealsAccess component', async () => {
      await waitFor(() => {
        initializeTestInstance()
      })
      expect(screen.getByText("We can't find any claims information for you")).toBeTruthy()
    })
  })

  describe('when loadingAllClaimsAndAppeals is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance()
      expect(screen.getByText('Loading your claims and appeals...')).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, {
          showCompleted: 'false',
          'page[size]': DEFAULT_PAGE_SIZE.toString(),
          'page[number]': '1',
        })
        .mockRejectedValue({ error: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR })
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText("The VA mobile app isn't working right now")).toBeTruthy())
    })
  })

  describe('when claimsServiceError exists but not appealsServiceError', () => {
    it('should display an alertbox specifying claims is unavailable', async () => {
      const error = [
        {
          service: 'claims',
        },
      ]
      const payload = mockPayload
      payload.meta.errors = error
      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, {
          showCompleted: 'false',
          'page[size]': '10',
          'page[number]': '1',
        })
        .mockResolvedValue(payload)
      initializeTestInstance(error)
      await waitFor(() => expect(screen.getByText('Claims status is unavailable')).toBeTruthy())
    })
  })

  describe('when appealsServiceError exists but not claimsServiceError', () => {
    it('should display an alertbox specifying appeals is unavailable', async () => {
      const error = [
        {
          service: 'appeals',
        },
      ]
      const payload = mockPayload
      payload.meta.errors = error
      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, {
          showCompleted: 'false',
          'page[size]': '10',
          'page[number]': '1',
        })
        .mockResolvedValue(payload)
      initializeTestInstance(error)
      await waitFor(() => expect(screen.getByText('Appeal status is unavailable')).toBeTruthy())
    })
  })

  describe('when there is both a claimsServiceError and an appealsServiceError', () => {
    it('should display an alert and not display the segmented control or the ClaimsAndAppealsListView component', async () => {
      const error = [
        {
          service: 'claims',
        },
        {
          service: 'appeals',
        },
      ]
      const payload = mockPayload
      payload.meta.errors = error
      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, {
          showCompleted: 'false',
          'page[size]': '10',
          'page[number]': '1',
        })
        .mockResolvedValue(payload)
      initializeTestInstance(error)
      await waitFor(() => expect(screen.getByText('Claims and appeal status are unavailable')).toBeTruthy())
      await waitFor(() => expect(screen.queryByText('Active')).toBeFalsy())
      await waitFor(() => expect(screen.queryByText('Closed')).toBeFalsy())
    })
  })
})
