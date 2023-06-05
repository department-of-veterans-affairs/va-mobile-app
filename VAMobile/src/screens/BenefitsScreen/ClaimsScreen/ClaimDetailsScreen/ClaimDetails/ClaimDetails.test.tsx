import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, render } from 'testUtils'

import ClaimDetails from './ClaimDetails'
import { TextView } from 'components'
import { RenderAPI } from '@testing-library/react-native'

context('ClaimDetails', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  let contentionList = ['Hearing Loss (Increase)']

  const initializeTestInstance = (contentionList: Array<string>): void => {
    props = mockNavProps({
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
          contentionList,
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

    component = render(<ClaimDetails {...props} />)

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance(contentionList)
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the contention list has items', () => {
    it('will display the header "What you\'ve claimed"', async () => {
      const textViews = testInstance.findAllByType(TextView)
      expect(textViews.length).toEqual(8)

      expect(textViews[2].props.children).toEqual("What you've claimed")
    })
  })
})
