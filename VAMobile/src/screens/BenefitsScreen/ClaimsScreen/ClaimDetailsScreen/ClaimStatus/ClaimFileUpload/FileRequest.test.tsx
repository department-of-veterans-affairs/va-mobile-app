import React from 'react'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { ClaimEventData } from 'api/types/ClaimsAndAppealsData'
import { claim as Claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import * as api from 'store/api'
import { QueriesData, context, fireEvent, mockNavProps, render, screen, waitFor, when } from 'testUtils'

import FileRequest from './FileRequest'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const request = [
  {
    type: 'still_need_from_you_list',
    date: '2020-07-16',
    status: 'NEEDED',
    uploaded: false,
    uploadsAllowed: true,
    displayName: 'Request 1',
  },
]
when(api.get as jest.Mock)
  .calledWith(`/v0/claim/600156928`, {}, expect.anything())
  .mockResolvedValue({
    data: {
      ...Claim,
      id: '600156928',
      attributes: {
        ...Claim.attributes,
        waiverSubmitted: false,
        eventsTimeline: request,
      },
    },
  })

context('FileRequest', () => {
  const renderWithData = (requests: ClaimEventData[]): void => {
    const queriesData: QueriesData = [
      {
        queryKey: [claimsAndAppealsKeys.claim, '600156928'],
        data: {
          ...Claim,
          attributes: {
            ...Claim.attributes,
            waiverSubmitted: false,
            eventsTimeline: requests,
          },
        },
      },
    ]

    const props = mockNavProps(undefined, undefined, { params: { claimID: '600156928' } })

    render(<FileRequest {...props} />, { queriesData })
  }

  describe('when number of requests is greater than 1', () => {
    it('should display the text "You have {{number}} file requests from VA"', async () => {
      const updatedRequests = [
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

      renderWithData(updatedRequests)
      expect(screen.getByText('You have 2 file requests from VA')).toBeTruthy()
    })
  })

  describe('when number of requests is equal to 1', () => {
    it('should display the text "You have 1 file request from VA"', async () => {
      renderWithData(request)
      expect(screen.getByText('You have 1 file request from VA')).toBeTruthy()
    })

    it('should have we sent you a letter text section', async () => {
      renderWithData(request)
      expect(
        screen.getByText(
          "We sent you a letter in the mail asking for more evidence to support your claim. We'll wait 30 days for your evidence before we begin evaluating your claim.",
        ),
      ).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/600156928`, {}, expect.anything())
        .mockRejectedValue('Error')

      renderWithData(request)
      await waitFor(() =>
        expect(screen.getByRole('header', { name: "The VA mobile app isn't working right now" })).toBeTruthy(),
      )
    })

    describe('on click of a file request', () => {
      it('should navigate to file request details page', async () => {
        renderWithData(request)
        fireEvent.press(screen.getByRole('button', { name: 'Request 1' }))
        expect(mockNavigationSpy).toHaveBeenCalledWith('FileRequestDetails', {
          claimID: '600156928',
          request: request[0],
        })
      })
    })
  })

  describe('when waiverSubmitted is false', () => {
    describe('when the currentPhase is 3', () => {
      it('should display evaluation section', async () => {
        renderWithData(request)
        expect(screen.getByText('Ask for your claim evaluation')).toBeTruthy()
        expect(
          screen.getByText(
            'Please review the evaluation details if you are ready for us to begin evaluating your claim',
          ),
        ).toBeTruthy()
      })
    })
  })

  describe('request timeline', () => {
    describe('when a request type is received_from_you_list', () => {
      it('should set fileUploaded to true for FileRequestNumberIndicator', async () => {
        const updatedRequests = [
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
        renderWithData(updatedRequests)
        expect(screen.getByText('You have 1 file request from VA')).toBeTruthy()
      })
    })
  })
})
