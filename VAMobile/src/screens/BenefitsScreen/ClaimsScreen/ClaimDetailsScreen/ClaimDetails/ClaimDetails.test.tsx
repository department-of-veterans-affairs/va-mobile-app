import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import ClaimDetails from './ClaimDetails'

context('ClaimDetails', () => {
  beforeEach(() => {
    const props = mockNavProps({
      claim: {
        id: '600156928',
        type: 'evss_claims',
        attributes: {
          dateFiled: '2019-06-06',
          minEstDate: '2019-10-02',
          maxEstDate: '2019-12-11',
          phaseChangeDate: '2019-06-22',
          open: true,
          waiverSubmitted: false,
          documentsNeeded: true,
          developmentLetterSent: true,
          decisionLetterSent: true,
          phase: 3,
          everPhaseBack: false,
          currentPhaseBack: false,
          requestedDecision: false,
          claimType: 'Compensation',
          updatedAt: '2020-12-07T20:37:12.041Z',
          contentionList: ['Hearing Loss (Increase)'],
          vaRepresentative: 'AMERICAN LEGION',
          eventsTimeline: [
            {
              type: 'never_received_from_you_list',
              trackedItemId: 255455,
              description: 'New &amp; material evidence needed - denied SC previously (PTSD)',
              displayName: 'Request 42',
              overdue: false,
              status: 'NO_LONGER_REQUIRED',
              uploaded: false,
              uploadsAllowed: false,
              openedDate: undefined,
              requestedDate: '2019-07-09',
              receivedDate: undefined,
              closedDate: '2019-08-08',
              suspenseDate: undefined,
              documents: [],
              uploadDate: '2019-08-08',
              date: '2019-08-08',
            },
          ],
        },
      },
    })

    render(<ClaimDetails {...props} />)
  })

  it('renders claim details', () => {
    expect(screen.getByText('Claim type')).toBeTruthy()
    expect(screen.getByText('Compensation')).toBeTruthy()
    expect(screen.getByText("What you've claimed")).toBeTruthy()
    expect(screen.getByText('Hearing Loss (Increase)')).toBeTruthy()
    expect(screen.getByText('Date received')).toBeTruthy()
    expect(screen.getByText('June 06, 2019')).toBeTruthy()
    expect(screen.getByText('Your representative for VA claims')).toBeTruthy()
    expect(screen.getByText('AMERICAN LEGION')).toBeTruthy()
  })
})
