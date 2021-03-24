import 'react-native'
import { Linking, Pressable } from 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, findByTestID, mockNavProps, mockStore, renderWithProviders } from 'testUtils'

import { ClaimType } from '../../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { InitialState } from 'store/reducers'
import { TextView } from 'components'
import { claim } from '../../claimData'
import ClaimStatus from './ClaimStatus'

const mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  const original = jest.requireActual('../../../../utils/hooks')
  const theme = jest.requireActual('../../../../styles/themes/standardTheme').default
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

context('ClaimStatus', () => {
  let store: any
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  const maxEstDate = '2019-12-11'

  const initializeTestInstance = (maxEstDate: string, claimType: ClaimType): void => {
    props = mockNavProps({
      claim: { ...claim, attributes: { ...claim.attributes, maxEstDate: maxEstDate } },
      claimType,
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
    describe('on click of Find out why we sometimes combine claims. list item', () => {
      it('should call useRouteNavigation', async () => {
        testInstance.findAllByType(Pressable)[5].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })

    describe('on click of What should I do if I disagree with VA’s decision on my disability claim? list item', () => {
      it('should call useRouteNavigation', async () => {
        testInstance.findAllByType(Pressable)[6].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when the claimType is CLOSED', () => {
    it('should display text detailing decision packet information', async () => {
      initializeTestInstance('', 'CLOSED')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('A decision packet has been mailed to you. Typically, decision notices are received within 10 days, but this is dependent upon U.S. Postal Service timeframes.')
    })

    it('should display the date for the event in the events timeline where the type is "completed"', async () => {
      initializeTestInstance('', 'CLOSED')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('Your claim was closed on January 31, 2019')
    })
  })

  describe('on click of the call click for action link', () => {
    it('should call Linking openURL', async () => {
      findByTestID(testInstance, '800-827-1000').props.onPress()
      expect(Linking.openURL).toHaveBeenCalled()
    })
  })
})
