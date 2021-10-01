import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import { act, ReactTestInstance } from 'react-test-renderer'

import {
  ClaimsAndAppealsState,
  ErrorsState,
  initialAuthorizedServicesState,
  initialClaimsAndAppealsState,
  initialErrorsState,
  initializeErrorsByScreenID,
  InitialState,
} from 'store/reducers'
import ClaimsScreen from './ClaimsScreen'
import { AlertBox, ErrorComponent, LoadingComponent, SegmentedControl, TextView } from 'components'
import ClaimsAndAppealsListView from './ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import NoClaimsAndAppealsAccess from './NoClaimsAndAppealsAccess/NoClaimsAndAppealsAccess'

context('ClaimsScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (loading = false, claimsServiceError = false, appealsServiceError = false, errorsState: ErrorsState = initialErrorsState) => {
    const claimsAndAppeals: ClaimsAndAppealsState = {
      ...initialClaimsAndAppealsState,
      loadingClaimsAndAppeals: loading,
      claimsServiceError,
      appealsServiceError,
    }

    store = mockStore({
      ...InitialState,
      claimsAndAppeals,
      errors: errorsState,
      authorizedServices: {
        ...initialAuthorizedServicesState,
        claims: true,
        appeals: true,
      },
    })

    const props = mockNavProps()

    act(() => {
      component = renderWithProviders(<ClaimsScreen {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when loadingAllClaimsAndAppeals is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(SegmentedControl).length).toEqual(1)
    expect(testInstance.findAllByType(ClaimsAndAppealsListView).length).toEqual(1)
  })

  describe('when claimsServiceError exists but not appealsServiceError', () => {
    it('should display an alertbox specifying claims is unavailable', async () => {
      initializeTestInstance(false, true)
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Claims status is unavailable')
    })
  })

  describe('when appealsServiceError exists but not claimsServiceError', () => {
    it('should display an alertbox specifying appeals is unavailable', async () => {
      initializeTestInstance(false, false, true)
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Appeal status is unavailable')
    })
  })

  describe('when there is both a claimsServiceError and an appealsServiceError', () => {
    it('should display an alert and not display the segmented control or the ClaimsAndAppealsListView component', async () => {
      initializeTestInstance(false, true, true)
      expect(testInstance.findAllByType(SegmentedControl).length).toEqual(0)
      expect(testInstance.findAllByType(ClaimsAndAppealsListView).length).toEqual(0)
      expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Claims and appeal status are unavailable')
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.CLAIMS_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
        feature/1070-downtime-message
      }

      initializeTestInstance(true, false, false, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
        feature/1070-downtime-message
      }

      initializeTestInstance(true, false, false, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })

  describe('when claims service is authorized and appeals service is not authorized', () => {
    it('should not render the NoClaimsAndAppealsAccess component', async () => {
      store = mockStore({
        ...InitialState,
        authorizedServices: {
          ...initialAuthorizedServicesState,
          claims: false,
          appeals: true,
        },
      })

      const props = mockNavProps()

      act(() => {
        component = renderWithProviders(<ClaimsScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(NoClaimsAndAppealsAccess)).toHaveLength(0)
    })
  })

  describe('when claims service is not authorized and appeals service is authorized', () => {
    it('should not render the NoClaimsAndAppealsAccess component', async () => {
      store = mockStore({
        ...InitialState,
        authorizedServices: {
          ...initialAuthorizedServicesState,
          claims: true,
          appeals: false,
        },
      })

      const props = mockNavProps()

      act(() => {
        component = renderWithProviders(<ClaimsScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(NoClaimsAndAppealsAccess)).toHaveLength(0)
    })
  })

  describe('when claims service and appeals service are both not authorized', () => {
    it('should render the NoClaimsAndAppealsAccess component', async () => {
      store = mockStore({
        ...InitialState,
        authorizedServices: {
          ...initialAuthorizedServicesState,
          claims: false,
          appeals: false,
        },
      })

      const props = mockNavProps()

      act(() => {
        component = renderWithProviders(<ClaimsScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(NoClaimsAndAppealsAccess)).toHaveLength(1)
    })
  })
})
