import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import {InitialState} from 'store/reducers'
import ClaimStatus from './ClaimStatus'
import {TextView} from 'components'

context('ClaimStatus', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  let maxEstDate = '2019-12-11'

  const initializeTestInstance = (maxEstDate: string): void => {
    props = mockNavProps({
      claim: {
        id: '600156928',
        type: 'evss_claims',
        attributes: {
          evssId: 600156928,
          dateFiled: '2019-06-06',
          minEstDate: '2019-10-02',
          maxEstDate,
          phaseChangeDate: '2019-06-22',
          open: true,
          waiverSubmitted: false,
          documentsNeeded: true,
          developmentLetterSent: true,
          decisionLetterSent: false,
          phase: 3,
          everPhaseBack: false,
          currentPhaseBack: false,
          requestedDecision: false,
          claimType: 'Compensation',
          updatedAt: '2020-12-07T20:37:12.041Z',
          contentionList: ['Hearing Loss (Increase)', ' ankle strain (related to: PTSD - Combat', 'POW) (New)', ' Diabetes mellitus2 (Secondary)'],
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
      }
    })

    store = mockStore({
      ...InitialState,
    })

    act(() => {
      component = renderWithProviders(<ClaimStatus {...props} />, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance(maxEstDate)
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the maxEstDate does not exist', () => {
    it('should display the text Claim completion dates aren\'t available right now.', async () => {
      initializeTestInstance('')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Claim completion dates aren\'t available right now.')
    })
  })

  describe('when the maxEstDate does exist', () => {
    it('should display the date formatted Month Day, Year', async () => {
      initializeTestInstance(maxEstDate)
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('December 11, 2019')
    })
  })
})
