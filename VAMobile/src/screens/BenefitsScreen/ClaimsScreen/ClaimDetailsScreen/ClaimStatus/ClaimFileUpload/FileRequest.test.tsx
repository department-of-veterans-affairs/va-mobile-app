import React from 'react'
import { context, fireEvent, mockNavProps, render, screen } from 'testUtils'

import FileRequest from './FileRequest'
import { ClaimEventData } from 'store/api/types'
import { ErrorsState, initialErrorsState, initializeErrorsByScreenID, InitialState } from 'store/slices'
import { claim as Claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { when } from 'jest-when'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('FileRequest', () => {
  let props: any
  let mockNavigateToFileRequestdetailsSpy: jest.Mock

  let requests = [
    {
      type: 'still_need_from_you_list',
      date: '2020-07-16',
      status: 'NEEDED',
      uploaded: false,
      uploadsAllowed: true,
      displayName: 'Request 1',
    },
  ]

  const initializeTestInstance = (requests: ClaimEventData[], currentPhase?: number, errorsState: ErrorsState = initialErrorsState): void => {
    props = mockNavProps(undefined, undefined, { params: { requests, currentPhase } })
    mockNavigateToFileRequestdetailsSpy = jest.fn()
    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('FileRequestDetails', { request: requests[0] })
      .mockReturnValue(mockNavigateToFileRequestdetailsSpy)

    render(<FileRequest {...props} />, {
      preloadedState: {
        ...InitialState,
        claimsAndAppeals: {
          ...InitialState.claimsAndAppeals,
          claim: {
            ...Claim,
            attributes: {
              ...Claim.attributes,
              waiverSubmitted: false,
              eventsTimeline: requests,
            },
          },
        },
        errors: errorsState,
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance(requests)
  })

  describe('when number of requests is greater than 1', () => {
    it('should display the text "You have {{number}} file requests from VA"', async () => {
      let updatedRequests = [
        {
          type: 'still_need_from_you_list',
          date: '2020-07-16',
          status: 'NEEDED',
          uploaded: false,
          uploadsAllowed: true,
        },
        {
          type: 'still_need_from_you_list',
          date: '2020-07-16',
          status: 'NEEDED',
          uploaded: false,
          uploadsAllowed: true,
        },
      ]

      initializeTestInstance(updatedRequests)
      expect(screen.getByText('You have 2 file requests from VA')).toBeTruthy()
    })
  })

  describe('when number of requests is equal to 1', () => {
    it('should display the text "You have 1 file request from VA"', async () => {
      expect(screen.getByText('You have 1 file request from VA')).toBeTruthy()
    })

    it('should have we sent you a letter text section', async () => {
      expect(
        screen.getByText(
          "We sent you a letter in the mail asking for more evidence to support your claim. We'll wait 30 days for your evidence before we begin evaluating your claim.",
        ),
      ).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.CLAIM_FILE_UPLOAD_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(requests, undefined, errorState)
      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })

    describe('on click of a file request', () => {
      it('should navigate to file request details page', async () => {
        fireEvent.press(screen.getByRole('button', { name: 'Request 1' }))
        expect(mockNavigateToFileRequestdetailsSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when waiverSubmitted is false', () => {
    describe('when the currentPhase is 3', () => {
      it('should display evaluation section', async () => {
        initializeTestInstance(requests, 3)
        expect(screen.getByText('Ask for your claim evaluation')).toBeTruthy()
        expect(screen.getByText('Please review the evaluation details if you are ready for us to begin evaluating your claim')).toBeTruthy()
      })
    })
  })

  describe('request timeline', () => {
    describe('when a request type is received_from_you_list', () => {
      it('should set fileUploaded to true for FileRequestNumberIndicator', async () => {
        let updatedRequests = [
          {
            type: 'still_need_from_you_list',
            date: '2020-07-16',
            status: 'NEEDED',
            uploaded: false,
            uploadsAllowed: true,
            displayName: 'Request 1',
          },
          {
            type: 'received_from_you_list',
            date: '2020-07-16',
            status: 'INITIAL_REVIEW_COMPLETE',
            uploaded: false,
            uploadsAllowed: true,
            displayName: 'Request 2',
          },
        ]

        initializeTestInstance(updatedRequests)
        expect(screen.getByText('You have 1 file request from VA')).toBeTruthy()
      })
    })
  })
})
