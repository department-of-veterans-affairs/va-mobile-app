import 'react-native'
import React from 'react'

import { context, mockNavProps, render, waitFor, when } from 'testUtils'
import { screen } from '@testing-library/react-native'
import ClaimsHistoryScreen from './ClaimsHistoryScreen'
import * as api from 'store/api'
import { CommonErrorTypesConstants } from 'constants/errors'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { ClaimsAndAppealsGetDataMeta } from 'store/api'

jest.mock('../../../../api/authorizedServices/getAuthorizedServices', () => {
  let original = jest.requireActual('../../../../api/authorizedServices/getAuthorizedServices')
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
        userProfileUpdate: true
      }
    })
  }
})

const activeClaimsAndAppealsList: api.ClaimsAndAppealsList = [
  {
    id: '1',
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
    id: '0',
    type: 'claim',
    attributes: {
      subtype: 'Disability',
      completed: false,
      decisionLetterSent: false,
      dateFiled: '2020-11-13',
      updatedAt: '2020-11-30',
      displayTitle: 'Disability',
    },
  },
  {
    id: '4',
    type: 'claim',
    attributes: {
      subtype: 'Compensation',
      completed: false,
      decisionLetterSent: false,
      dateFiled: '2020-06-11',
      updatedAt: '2020-12-07',
      displayTitle: 'Compensation',
    },
  },
]

const mockPagination: ClaimsAndAppealsGetDataMeta = {
  dataFromStore: false,

  pagination: {
    currentPage: 1,
    perPage: 10,
    totalEntries: 3,
  },
}

const mockPaginationClaimsServiceError: ClaimsAndAppealsGetDataMeta = {
  ...mockPagination,
  errors: [
    {
      service: 'claims',
    },
  ],
}

const mockPaginationAppealsServiceError: ClaimsAndAppealsGetDataMeta = {
  ...mockPagination,
  errors: [
    {
      service: 'appeals',
    },
  ],
}

const mockPaginationAppealsClaimsServiceError: ClaimsAndAppealsGetDataMeta = {
  ...mockPagination,
  errors: [
    {
      service: 'claims',
    },
    {
      service: 'appeals',
    },
  ],
}

context('ClaimsHistoryScreen', () => {
  const initializeTestInstance = () => {
    render(<ClaimsHistoryScreen {...mockNavProps()} />)
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
      await waitFor(() => {
        when(api.get as jest.Mock)
          .calledWith(`/v0/claims-and-appeals-overview`, { showCompleted: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1' })
          .mockResolvedValue({ error: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR })
        initializeTestInstance()
      })
      expect(screen.getByText("We're sorry. Something went wrong on our end. Try again later.")).toBeTruthy()
    })
  })

  describe('when claimsServiceError exists but not appealsServiceError', () => {
    it('should display an alertbox specifying claims is unavailable', async () => {
      await waitFor(() => {
        when(api.get as jest.Mock)
          .calledWith(`/v0/claims-and-appeals-overview`, { showCompleted: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1' })
          .mockResolvedValue({ data: activeClaimsAndAppealsList, meta: mockPaginationClaimsServiceError })
        initializeTestInstance()
      })
      expect(screen.getByText('Claims status is unavailable')).toBeTruthy()
    })
  })

  describe('when appealsServiceError exists but not claimsServiceError', () => {
    it('should display an alertbox specifying appeals is unavailable', async () => {
      await waitFor(() => {
        when(api.get as jest.Mock)
          .calledWith(`/v0/claims-and-appeals-overview`, { showCompleted: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1' })
          .mockResolvedValue({ data: activeClaimsAndAppealsList, meta: mockPaginationAppealsServiceError })
        initializeTestInstance()
      })
      expect(screen.getByText('Appeal status is unavailable')).toBeTruthy()
    })
  })

  describe('when there is both a claimsServiceError and an appealsServiceError', () => {
    it('should display an alert and not display the segmented control or the ClaimsAndAppealsListView component', async () => {
      await waitFor(() => {
        when(api.get as jest.Mock)
          .calledWith(`/v0/claims-and-appeals-overview`, { showCompleted: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1' })
          .mockResolvedValue({ data: activeClaimsAndAppealsList, meta: mockPaginationAppealsClaimsServiceError })
        initializeTestInstance()
      })
      expect(screen.getByText('Claims and appeal status are unavailable')).toBeTruthy()
      expect(screen.queryByText('Active')).toBeFalsy()
      expect(screen.queryByText('Closed')).toBeFalsy()
    })
  })
})
