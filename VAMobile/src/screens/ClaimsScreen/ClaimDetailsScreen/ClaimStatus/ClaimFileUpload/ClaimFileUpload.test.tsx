import React from 'react'

import {context, findByTestID, mockNavProps, mockStore, renderWithProviders} from "testUtils"
import { act, ReactTestInstance } from "react-test-renderer"

import ClaimFileUpload from './ClaimFileUpload'
import { AlertBox, ErrorComponent, TextView, VAButton } from 'components'
import { ClaimEventData } from 'store/api/types'
import { ErrorsState, initialErrorsState, initializeErrorsByScreenID, InitialState } from 'store/reducers'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

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
            waiverSubmitted: false,
            eventsTimeline: requests
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

  describe('on click of the take or select photos button', () => {
    it('should call useRouteNavigation', async () => {
      findByTestID(testInstance, 'Take or select photos').props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the select files button', () => {
    it('should call useRouteNavigation', async () => {
      findByTestID(testInstance, 'Select a file').props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when the request hasn\'t had files uploaded', () => {
    it('should display the select a file and take or select photos buttons', async () => {
      const buttons = testInstance.findAllByType(VAButton)
      expect(buttons.length).toEqual(3)
      expect(buttons[0].props.label).toEqual('Select a file')
      expect(buttons[1].props.label).toEqual('Take or select photos')
    })
  })

  describe('when the request has had files uploaded', () => {
    it('should display the uploaded date', async () => {
      let updatedRequests = [
        {
          type: 'still_need_from_you_list',
          trackedItemId: 255451,
          description: 'Final Attempt Letter',
          displayName: 'Request 9',
          overdue: false,
          status: 'NEEDED',
          uploaded: true,
          uploadsAllowed: true,
          openedDate: null,
          requestedDate: '2019-07-09',
          receivedDate: null,
          closedDate: '2019-07-19',
          suspenseDate: null,
          documents: [],
          uploadDate: '2021-01-30',
          date: '2019-07-19',
        }
      ]

      initializeTestInstance(updatedRequests)
      expect(testInstance.findAllByType(TextView)[8].props.children).toEqual('Uploaded 01/30/21')
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.CLAIM_FILE_UPLOAD_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        errorsByScreenID,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(requests, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        errorsByScreenID,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(requests, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
