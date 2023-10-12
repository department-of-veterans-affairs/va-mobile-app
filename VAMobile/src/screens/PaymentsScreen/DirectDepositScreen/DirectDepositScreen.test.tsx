import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { Pressable } from 'react-native'
import { context, waitFor, render, RenderAPI, mockNavProps } from 'testUtils'

import {
  DirectDepositState,
  ErrorsState,
  initialAuthState,
  initialErrorsState,
  initializeErrorsByScreenID,
  initialMilitaryServiceState,
} from 'store/slices'
import { ServiceData } from 'store/api/types'
import DirectDepositScreen from './index'
import { ErrorComponent, LoadingComponent, TextView } from 'components'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const authorizedMilitaryState = {
  militaryService: {
    ...initialMilitaryServiceState,
    serviceHistory: [{} as ServiceData],
  },
}

context('DirectDepositScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let mockNavigateToSpy: jest.Mock

  const initializeTestInstance = (loading = false, errorsState: ErrorsState = initialErrorsState) => {
    const directDeposit: DirectDepositState = {
      loading,
      saving: false,
      paymentAccount: {
        accountNumber: '******1234',
        accountType: 'Savings',
        financialInstitutionName: 'BoA',
        financialInstitutionRoutingNumber: '12341234123',
      },
      bankInfoUpdated: false,
      invalidRoutingNumberError: false,
    }
    mockNavigateToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(mockNavigateToSpy)

    component = render(<DirectDepositScreen {...mockNavProps()} />, {
      preloadedState: {
        auth: { ...initialAuthState },
        directDeposit,
        errors: errorsState,
        ...authorizedMilitaryState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      await waitFor(() => {
        initializeTestInstance(true)
        expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
      })
    })
  })

  describe('when there is bank data', () => {
    it('should display the button with the given bank data', async () => {
      await waitFor(() => {
        expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('Account')
        expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('BoA')
        expect(testInstance.findAllByType(TextView)[7].props.children).toEqual('******1234')
        expect(testInstance.findAllByType(TextView)[8].props.children).toEqual('Savings account')
      })
    })
  })

  describe('when there is no bank data', () => {
    it('should render the button with the text Add your bank account information', async () => {
      component = render(<DirectDepositScreen {...mockNavProps()} />, {
        preloadedState: {
          auth: { ...initialAuthState },
          ...authorizedMilitaryState,
        },
      })

      testInstance = component.UNSAFE_root
      await waitFor(() => {
        expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('Add your bank account information')
      })

      component = render(<DirectDepositScreen {...mockNavProps()} />, {
        preloadedState: {
          auth: { ...initialAuthState },
          ...authorizedMilitaryState,
        },
      })

      testInstance = component.UNSAFE_root
      await waitFor(() => {
        expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('Add your bank account information')
      })
    })
  })

  describe('when bank info is clicked', () => {
    it('should call navigation navigate', async () => {
      await waitFor(() => {
        testInstance.findAllByType(Pressable)[0].props.onPress()
        expect(mockNavigationSpy).toBeCalledWith('EditDirectDeposit', { displayTitle: 'Edit account' })
        expect(mockNavigateToSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      await waitFor(() => {
        initializeTestInstance(false, errorState)
        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
      })
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      await waitFor(() => {
        initializeTestInstance(false, errorState)
        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
      })
    })
  })
})
