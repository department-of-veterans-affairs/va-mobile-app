import 'react-native'
import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, render, RenderAPI, waitFor, when } from 'testUtils'

import * as api from 'store/api'
import { InitialState, initialClaimsAndAppealsState, ErrorsState, initialErrorsState, initializeErrorsByScreenID } from 'store/slices'
import ClaimDetailsScreen from './ClaimDetailsScreen'
import { ErrorComponent, LoadingComponent, SegmentedControl } from 'components'
import ClaimStatus from './ClaimStatus/ClaimStatus'
import ClaimDetails from './ClaimDetails/ClaimDetails'
import { claim } from '../claimData'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { StackNavigationOptions } from '@react-navigation/stack'

jest.mock('@react-navigation/native', () => {
  let actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useNavigation: () => ({
      setOptions: jest.fn(),
      goBack: jest.fn(),
    }),
  }
})

context('ClaimDetailsScreen', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance
  let navHeaderSpy: any
  let goBack: jest.Mock
  let abortLoadSpy: jest.Mock

  const initializeTestInstance = (loadingClaim = false, errorsState: ErrorsState = initialErrorsState) => {
    goBack = jest.fn()
    abortLoadSpy = jest.fn()
    props = mockNavProps(
      undefined,
      {
        navigate: jest.fn(),
        addListener: jest.fn(),
        setOptions: (options: Partial<StackNavigationOptions>) => {
          navHeaderSpy = {
            back: options.headerLeft ? options.headerLeft({}) : undefined,
          }
        },
        goBack,
      },
      { params: { claimID: '0', claimType: 'ACTIVE' } },
    )

    component = render(<ClaimDetailsScreen {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...initialClaimsAndAppealsState,
          loadingClaim,
          claim: claim,
          cancelLoadingDetailScreen: {
            abort: abortLoadSpy,
          },
        },
        errors: errorsState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  it('should initialize', async () => {
    await waitFor(() => {
      initializeTestInstance()
      expect(component).toBeTruthy()
    })
  })

  describe('when loadingClaim is set to true', () => {
    it('should show loading screen', async () => {
      when(api.get as jest.Mock)

      await waitFor(() => {
        initializeTestInstance(false)
        expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
      })
    })
  })

  describe('when the selected tab is status', () => {
    it('should display the ClaimStatus component', async () => {
      await waitFor(() => {
        when(api.get as jest.Mock)
          .calledWith(`/v0/claim/0`, {}, expect.anything())
          .mockResolvedValue({ data: claim })
        initializeTestInstance()
      })

      await waitFor(() => {
        testInstance.findByType(SegmentedControl).props.onChange('Status')
      })
      expect(testInstance.findAllByType(ClaimStatus).length).toEqual(1)
    })
  })

  describe('when the selected tab is status', () => {
    it('should display the ClaimDetails component', async () => {
      await waitFor(() => {
        when(api.get as jest.Mock)
          .calledWith(`/v0/claim/0`, {}, expect.anything())
          .mockResolvedValue({ data: claim })
        initializeTestInstance()
      })

      await waitFor(() => {
        testInstance.findByType(SegmentedControl).props.onChange('Details')
      })
      fireEvent.press(screen.getByText('Details'))
      expect(testInstance.findAllByType(ClaimDetails).length).toEqual(1)
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/0`, {}, expect.anything())
        .mockRejectedValue({ networkError: true } as api.APIError)

      await waitFor(() => {
        initializeTestInstance(false)
      })

      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.CIVIL_SERVICE_LETTER_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

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
