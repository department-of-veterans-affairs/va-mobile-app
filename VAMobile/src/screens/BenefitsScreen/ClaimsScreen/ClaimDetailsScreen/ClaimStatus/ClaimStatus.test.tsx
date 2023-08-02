import 'react-native'
import { Linking, Pressable } from 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'

import { context, mockNavProps, render, RenderAPI } from 'testUtils'
import { ClaimType } from '../../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { InitialState } from 'store/slices'
import { TextView } from 'components'
import { claim } from '../../claimData'
import ClaimStatus from './ClaimStatus'

const mockNavigationResultSpy = jest.fn()
const mockNavigationSpy = jest.fn(() => mockNavigationResultSpy)
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('ClaimStatus', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const maxEstDate = '2019-12-11'

  const initializeTestInstance = (maxEstDate: string, claimType: ClaimType): void => {
    props = mockNavProps({
      claim: { ...claim, attributes: { ...claim.attributes, maxEstDate: maxEstDate } },
      claimType,
    })
    component = render(<ClaimStatus {...props} />, {
      preloadedState: {
        ...InitialState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    jest.clearAllMocks()
    initializeTestInstance(maxEstDate, 'ACTIVE')
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the claimType is ACTIVE', () => {
    describe('on click of Find out why we sometimes combine claims. list item', () => {
      it('should call useRouteNavigation', async () => {
        testInstance.findAllByType(Pressable)[4].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalledWith('ConsolidatedClaimsNote')
        expect(mockNavigationResultSpy).toHaveBeenCalledWith()
      })
    })

    describe('on click of What should I do if I disagree with VA’s decision on my disability claim? list item', () => {
      it('should call useRouteNavigation', async () => {
        testInstance.findAllByType(Pressable)[5].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalledWith('WhatDoIDoIfDisagreement', { claimID: '600156928', claimStep: 3, claimType: 'Compensation' })
        expect(mockNavigationResultSpy).toHaveBeenCalledWith()
      })
    })
  })

  describe('when the claimType is CLOSED', () => {
    it('should display text detailing decision packet information', async () => {
      initializeTestInstance('', 'CLOSED')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual(
        'We mailed you a decision letter. It should arrive within 10 days after the date we decided your claim. It can sometimes take longer.',
      )
    })

    it('should display the date for the event in the events timeline where the type is "completed"', async () => {
      initializeTestInstance('', 'CLOSED')
      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('We decided your claim on January 31, 2019')
    })
  })

  describe('on click of the call click for action link', () => {
    it('should call Linking openURL', async () => {
      testInstance.findByProps({ accessibilityLabel: '8 0 0 8 2 7 1 0 0 0' }).props.onPress()
      expect(Linking.openURL).toHaveBeenCalled()
    })
  })
})
