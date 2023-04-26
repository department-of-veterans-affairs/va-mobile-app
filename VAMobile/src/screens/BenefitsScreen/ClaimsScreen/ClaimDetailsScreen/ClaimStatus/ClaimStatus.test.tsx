import 'react-native'
import { Linking, Pressable } from 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, findByTestID, mockNavProps, render, RenderAPI } from 'testUtils'
import { ClaimType } from '../../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { InitialState } from 'store/slices'
import { TextView } from 'components'
import { claim } from '../../claimData'
import ClaimStatus from './ClaimStatus'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('ClaimStatus', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance
  let mockNavigateToConsolidatedClaimsNoteSpy: jest.Mock
  let mockNavigateToWhatDoIDoIfDisagreementSpy: jest.Mock

  const maxEstDate = '2019-12-11'

  const initializeTestInstance = (maxEstDate: string, claimType: ClaimType): void => {
    mockNavigateToConsolidatedClaimsNoteSpy = jest.fn()
    mockNavigateToWhatDoIDoIfDisagreementSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(() => {}).mockReturnValueOnce(mockNavigateToConsolidatedClaimsNoteSpy).mockReturnValueOnce(mockNavigateToWhatDoIDoIfDisagreementSpy)
    props = mockNavProps({
      claim: { ...claim, attributes: { ...claim.attributes, maxEstDate: maxEstDate } },
      claimType,
    })
    component = render(<ClaimStatus {...props} />, {
      preloadedState: {
        ...InitialState,
      },
    })

    testInstance = component.container
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
        testInstance.findAllByType(Pressable)[4].props.onPress()
        expect(mockNavigationSpy).toHaveBeenNthCalledWith(1, 'ConsolidatedClaimsNote')
        expect(mockNavigateToConsolidatedClaimsNoteSpy).toHaveBeenCalled()
      })
    })

    describe('on click of What should I do if I disagree with VA’s decision on my disability claim? list item', () => {
      it('should call useRouteNavigation', async () => {
        testInstance.findAllByType(Pressable)[5].props.onPress()
        expect(mockNavigationSpy).toHaveBeenNthCalledWith(2, 'WhatDoIDoIfDisagreement')
        expect(mockNavigateToWhatDoIDoIfDisagreementSpy).toHaveBeenCalled()
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
      testInstance.findByProps({accessibilityLabel: '8 0 0 8 2 7 1 0 0 0'}).props.onPress()
      expect(Linking.openURL).toHaveBeenCalled()
    })
  })
})
