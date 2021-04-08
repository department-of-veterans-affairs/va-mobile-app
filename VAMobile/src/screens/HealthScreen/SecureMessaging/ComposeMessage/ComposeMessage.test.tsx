import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders} from 'testUtils'
import ComposeMessage from './ComposeMessage'
import {Pressable, TouchableWithoutFeedback} from 'react-native'
import {TextView} from '../../../../components'

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

context('ComposeMessage', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    act(() => {
      component = renderWithProviders(<ComposeMessage/>)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of the crisis line banner', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findByType(TouchableWithoutFeedback).props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the collapsible view', () => {
    it('should display the when will i get a reply children text', async () => {
      testInstance.findByType(Pressable).props.onPress()
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('It can take up to three business days to receive a response from a member of your health care team or the administrative VA staff member you contacted.')
    })
  })
})
