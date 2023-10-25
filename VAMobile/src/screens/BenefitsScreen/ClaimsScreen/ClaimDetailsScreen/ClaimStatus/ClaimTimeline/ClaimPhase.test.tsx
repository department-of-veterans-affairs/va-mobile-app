import React from 'react'

import { context, render } from 'testUtils'
import { screen, fireEvent } from '@testing-library/react-native'
import { claim } from '../../../claimData'
import ClaimPhase from './ClaimPhase'
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

context('ClaimPhase', () => {
  let props: any
  let mockNavigateToClaimFileUploadSpy: jest.Mock

  const initializeTestInstance = (phase: number, current: number) => {
    mockNavigateToClaimFileUploadSpy = jest.fn()
    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('FileRequest', { claimID: undefined })
      .mockReturnValue(mockNavigateToClaimFileUploadSpy)
    props = {
      phase,
      current,
      attributes: claim.attributes,
    }

    render(<ClaimPhase {...props} />)
  }

  it('initializes correctly', async () => {
    initializeTestInstance(1, 1)
    expect(screen.getByTestId('Step 1 of 5. current. Claim received June 6, 2019')).toBeTruthy()
    expect(screen.getByRole('tab')).toBeTruthy()
  })

  describe('when phase is less than current', () => {
    it('should render text details after pressing icon', async () => {
      initializeTestInstance(1, 2)
      fireEvent.press(screen.getAllByRole('tab')[0])
      expect(screen.getByText('Thank you. VA received your claim')).toBeTruthy()
    })
  })

  describe('when phase is equal to current', () => {
    it('should render text details after pressing icon', async () => {
      initializeTestInstance(2, 2)
      fireEvent.press(screen.getAllByRole('tab')[0])
      expect(screen.getByText('Your claim has been assigned to a reviewer who is determining if additional information is needed.')).toBeTruthy()
    })
  })

  describe('when phase is 3', () => {
    describe('if there are files that can be uploaded', () => {
      beforeEach(async () => {
        claim.attributes.decisionLetterSent = false
        claim.attributes.open = true
        claim.attributes.documentsNeeded = true
        claim.attributes.eventsTimeline = [
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
        initializeTestInstance(3, 2)
      })

      it('should display the view file requests va button', async () => {
        expect(screen.getByText('You have 2 file requests from VA')).toBeTruthy()
        expect(screen.getByText('Review file requests')).toBeTruthy()
        fireEvent.press(screen.getByText('Review file requests'))
        expect(mockNavigateToClaimFileUploadSpy).toHaveBeenCalled()
      })

      describe('when number of requests is equal to 1', () => {
        it('should display the text "You have 1 file request from VA"', async () => {
          claim.attributes.eventsTimeline = [
            {
              type: 'still_need_from_you_list',
              date: '2020-07-16',
              status: 'NEEDED',
              uploaded: false,
              uploadsAllowed: true,
            },
          ]
          initializeTestInstance(3, 2)
          expect(screen.getByText('You have 1 file request from VA')).toBeTruthy()
        })
      })
    })
  })
})
