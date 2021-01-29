import React from 'react'

import {context, findByTestID, mockNavProps, mockStore, renderWithProviders} from "testUtils"
import { act, ReactTestInstance } from "react-test-renderer"

import ClaimFileUpload from './ClaimFileUpload'
import { AlertBox, ErrorComponent, TextView } from 'components'
import {ClaimEventData} from 'store/api/types'
import { ErrorsState, initialErrorsState, InitialState } from 'store/reducers'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import { CommonErrors } from 'constants/errors'
import { ScreenIDs } from 'constants/screens'

const mockNavigationSpy = jest.fn()
jest.mock('../../../../../utils/hooks', () => {
  const original = jest.requireActual('../../../../../utils/hooks')
  const theme = jest.requireActual('../../../../../styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => {
      return () => mockNavigationSpy
    },
  }
})

context('ClaimFileUpload', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let store: any

  let requests = [
    {
      type: 'still_need_from_you_list',
      date: '2020-07-16',
      status: 'NEEDED',
      uploaded: false,
      uploadsAllowed: true
    }
  ]

  const initializeTestInstance = (requests: ClaimEventData[], currentPhase?: number, errorsState: ErrorsState = initialErrorsState): void => {
    props = mockNavProps(undefined, undefined, { params: { requests, currentPhase }})

    store = mockStore({
      ...InitialState,
      claimsAndAppeals: {
        ...InitialState.claimsAndAppeals,
        claim: {
          ...Claim,
          attributes: {
            ...Claim.attributes,
            waiverSubmitted: false
          }
        }
      },
      errors: errorsState
    })

    act(() => {
      component = renderWithProviders(<ClaimFileUpload {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(requests)
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when number of requests is greater than 1', () => {
    it('should display the text "You have {{number}} file requests from VA"', async () => {
      let updatedRequests = [
        {
          type: 'still_need_from_you_list',
          date: '2020-07-16',
          status: 'NEEDED',
          uploaded: false,
          uploadsAllowed: true
        },
        {
          type: 'still_need_from_you_list',
          date: '2020-07-16',
          status: 'NEEDED',
          uploaded: false,
          uploadsAllowed: true
        }
      ]

      initializeTestInstance(updatedRequests)

      expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('You have 2 file requests from VA')
    })
  })

  describe('when number of requests is equal to 1', () => {
    it('should display the text "You have 1 file request from VA"', async () => {
      expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('You have 1 file request from VA')
    })
  })

  describe('when waiverSubmitted is false', () => {
    describe('when the currentPhase is 3', () => {
      it('should display an AlertBox', async () => {
        initializeTestInstance(requests, 3)
        expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
      })
    })
  })

  describe('on click of the take photos button', () => {
    it('should call useRouteNavigation', async () => {
      findByTestID(testInstance, 'Take photos').props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the select files button', () => {
    it('should call useRouteNavigation', async () => {
      findByTestID(testInstance, 'Select a file').props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: ScreenIDs.CLAIM_FILE_UPLOAD_SCREEN_ID,
        errorType: CommonErrors.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(requests, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: "TEST_SCREEN_ID",
        errorType: CommonErrors.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(requests, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
