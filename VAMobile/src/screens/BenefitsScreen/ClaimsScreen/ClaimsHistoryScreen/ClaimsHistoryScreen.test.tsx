import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, mockNavProps, render, RenderAPI, waitFor, when } from 'testUtils'
import { ReactTestInstance } from 'react-test-renderer'
import { SegmentedControl } from '@department-of-veterans-affairs/mobile-component-library'

import {
  ClaimsAndAppealsState,
  ErrorsState,
  initialClaimsAndAppealsState,
  initialErrorsState,
  initializeErrorsByScreenID,
  InitialState,
} from 'store/slices'
import ClaimsHistoryScreen from './ClaimsHistoryScreen'
import { AlertBox, ErrorComponent, LoadingComponent, TextView } from 'components'
import ClaimsAndAppealsListView from '../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import * as api from 'store/api'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import NoClaimsAndAppealsAccess from '../NoClaimsAndAppealsAccess/NoClaimsAndAppealsAccess'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { ClaimsAndAppealsGetDataMeta } from 'store/api'
import { cleanup } from '@testing-library/react-native'

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

const closedClaimsAndAppealsList: api.ClaimsAndAppealsList = [
  {
    id: '2',
    type: 'appeal',
    attributes: {
      subtype: 'supplementalClaim',
      completed: true,
      decisionLetterSent: true,
      dateFiled: '2020-10-22',
      updatedAt: '2020-10-28',
      displayTitle: 'supplemental claim for disability compensation',
    },
  },
  {
    id: '3',
    type: 'claim',
    attributes: {
      subtype: 'Disability',
      completed: true,
      decisionLetterSent: true,
      dateFiled: '2020-11-13',
      updatedAt: '2020-11-30',
      displayTitle: 'Disability',
    },
  },
  {
    id: '5',
    type: 'claim',
    attributes: {
      subtype: 'Compensation',
      completed: true,
      decisionLetterSent: true,
      dateFiled: '2020-06-11',
      updatedAt: '2020-12-07',
      displayTitle: 'Disability',
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
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (loading = false, claimsServiceError = false, appealsServiceError = false, errorsState: ErrorsState = initialErrorsState) => {
    const claimsAndAppeals: ClaimsAndAppealsState = {
      ...initialClaimsAndAppealsState,
      loadingClaimsAndAppeals: loading,
      claimsServiceError,
      appealsServiceError,
    }

    const preloadedState = {
      ...InitialState,
      personalInformation: {
        ...InitialState.personalInformation,
        needsDataLoad: false,
      },
      claimsAndAppeals,
      errors: errorsState,
    }

    const props = mockNavProps()

    component = render(<ClaimsHistoryScreen {...props} />, {
      preloadedState,
    })

    testInstance = component.UNSAFE_root
  }

  afterEach(cleanup)

  describe('when loadingAllClaimsAndAppeals is set to true', () => {
    it('should show loading screen', async () => {
      await waitFor(() => {
        initializeTestInstance()
        expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
      })

      expect(await component.UNSAFE_queryByType(LoadingComponent)).toBeNull()
    })
  })

  it('initializes correctly', async () => {
    initializeTestInstance()
    await waitFor(() => {
      expect(component).toBeTruthy()
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

      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Claims status is unavailable')
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

      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Appeal status is unavailable')
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
      expect(testInstance.findAllByType(SegmentedControl).length).toEqual(0)
      expect(testInstance.findAllByType(ClaimsAndAppealsListView).length).toEqual(0)
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Claims and appeal status are unavailable')
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const props = mockNavProps()
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.CLAIMS_HISTORY_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }
      component = render(<ClaimsHistoryScreen {...props} />, {
        preloadedState: {
          ...InitialState,
          errors: errorState,
          personalInformation: {
            ...InitialState.personalInformation,
            needsDataLoad: false,
          },
        },
      })
      testInstance = component.UNSAFE_root
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const props = mockNavProps()
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      component = render(<ClaimsHistoryScreen {...props} />, {
        preloadedState: {
          ...InitialState,
          errors: errorState,
          personalInformation: {
            ...InitialState.personalInformation,
            needsDataLoad: false,
          },
        },
      })

      testInstance = component.UNSAFE_root
      await waitFor(() => {
        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
      })
    })
  })

  describe('when claims service is authorized and appeals service is not authorized', () => {
    it('should not render the NoClaimsAndAppealsAccess component', async () => {
      const props = mockNavProps()

      component = render(<ClaimsHistoryScreen {...props} />, {
        preloadedState: {
          ...InitialState,
        },
      })

      testInstance = component.UNSAFE_root

      await waitFor(() => {
        expect(testInstance.findAllByType(NoClaimsAndAppealsAccess)).toHaveLength(0)
      })
    })
  })

  describe('when claims service is not authorized and appeals service is authorized', () => {
    it('should not render the NoClaimsAndAppealsAccess component', async () => {
      const props = mockNavProps()

      component = render(<ClaimsHistoryScreen {...props} />, {
        preloadedState: {
          ...InitialState,
        },
      })

      testInstance = component.UNSAFE_root

      await waitFor(() => {
        expect(testInstance.findAllByType(NoClaimsAndAppealsAccess)).toHaveLength(0)
      })
    })
  })

  describe('when claims service and appeals service are both not authorized', () => {
    it('should render the NoClaimsAndAppealsAccess component', async () => {
      const props = mockNavProps()

      await waitFor(() => {
        component = render(<ClaimsHistoryScreen {...props} />, {
          preloadedState: {
            ...InitialState,
          },
        })
      })

      testInstance = component.UNSAFE_root

      expect(testInstance.findAllByType(NoClaimsAndAppealsAccess)).toHaveLength(1)
    })
  })
})
