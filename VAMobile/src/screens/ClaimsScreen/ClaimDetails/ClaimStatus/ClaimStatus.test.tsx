import 'react-native'
import React from 'react'
import {Linking, Pressable} from 'react-native'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import {context, findByTestID, mockNavProps, mockStore, renderWithProviders} from 'testUtils'

import { InitialState } from 'store/reducers'
import ClaimStatus from './ClaimStatus'
import { TextView } from 'components'
import { ClaimType } from '../../ClaimsAndAppealsListView/ClaimsAndAppealsListView'

let mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  let original = jest.requireActual("../../../../utils/hooks")
  let theme = jest.requireActual("../../../../styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => { return () => mockNavigationSpy},
  }
})

context('ClaimStatus', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  let maxEstDate = '2019-12-11'

  const initializeTestInstance = (maxEstDate: string, claimType: ClaimType): void => {
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
      },
      claimType
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
    initializeTestInstance(maxEstDate, 'ACTIVE')
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the claimType is ACTIVE', () => {
    describe('when the maxEstDate does not exist', () => {
      it('should display the text Claim completion dates aren\'t available right now.', async () => {
        initializeTestInstance('', 'ACTIVE')
        expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Claim completion dates aren\'t available right now.')
      })
    })

    describe('when the maxEstDate does exist', () => {
      it('should display the date formatted Month Day, Year', async () => {
        initializeTestInstance(maxEstDate, 'ACTIVE')
        expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('December 11, 2019')
      })
    })

    describe('on click of Find out why we sometimes combine claims. list item', () => {
      it('should call useRouteNavigation', async () => {
        testInstance.findAllByType(Pressable)[0].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })

    describe('on click of What should I do if I disagree with your decision on my VA disability claim? list item', () => {
      it('should call useRouteNavigation', async () => {
        testInstance.findAllByType(Pressable)[1].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when the claimType is CLOSED', () => {
    it('should Need help? as the first TextView', async () => {
      initializeTestInstance('', 'CLOSED')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Need help?')
    })
  })

  describe('on click of the call click for action link', () => {
    it('should call Linking openURL', async () => {
      findByTestID(testInstance, '800-827-1000').props.onPress()
      expect(Linking.openURL).toHaveBeenCalled()
    })
  })
})
