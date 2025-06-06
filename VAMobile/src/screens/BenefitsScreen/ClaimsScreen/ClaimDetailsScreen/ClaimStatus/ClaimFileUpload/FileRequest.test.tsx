import React from 'react'

import { t } from 'i18next'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals'
import { ClaimEventData } from 'api/types'
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
      const updatedRequests: ClaimEventData[] = [
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

      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/600156928`, {})
        .mockResolvedValue({
          data: {
            ...Claim,
            id: '600156928',
            attributes: {
              ...Claim.attributes,
              waiverSubmitted: false,
              eventsTimeline: updatedRequests,
            },
          },
        })

      renderWithData(updatedRequests)
      await waitFor(() =>
        expect(screen.getByText(t('claimPhase.youHaveFileRequestVA_plural', { count: 2 }))).toBeTruthy(),
      )
    })
  })

  describe('when number of requests is equal to 1', () => {
    it('display correctly', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/600156928`, {})
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
      renderWithData(request)
      await waitFor(() => expect(screen.getByText(t('claimPhase.youHaveFileRequestVA', { count: 1 }))).toBeTruthy())
      await waitFor(() => expect(screen.getByText(t('fileRequest.weSentYouALaterText'))).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Ask for your claim evaluation')).toBeTruthy())
      await waitFor(() => expect(screen.getByText(t('fileRequest.askForYourClaimEvaluationBody'))).toBeTruthy())
      await waitFor(() => fireEvent.press(screen.getByRole('link', { name: 'Request 1' })))
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('FileRequestDetails', {
          claimID: '600156928',
          request: request[0],
        }),
      )
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claim/600156928`, {})
        .mockRejectedValue({ networkError: true } as api.APIError)

      renderWithData(request)
      await waitFor(() =>
        expect(screen.getByRole('header', { name: t('errors.networkConnection.header') })).toBeTruthy(),
      )
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
        when(api.get as jest.Mock)
          .calledWith(`/v0/claim/600156928`, {})
          .mockResolvedValue({
            data: {
              ...Claim,
              id: '600156928',
              attributes: {
                ...Claim.attributes,
                waiverSubmitted: false,
                eventsTimeline: updatedRequests,
              },
            },
          })

        renderWithData(updatedRequests)
        await waitFor(() => expect(screen.getByText(t('claimPhase.youHaveFileRequestVA', { count: 1 }))).toBeTruthy())
      })
    })
  })
})
