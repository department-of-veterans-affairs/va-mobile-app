import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { TouchableWithoutFeedback } from 'react-native'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { TestProviders, context } from 'testUtils'
import BackButton from './BackButton'

context('BackButton', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    act(() => {
      component = renderer.create(
        <TestProviders>
          <BackButton onPress={onPressSpy} canGoBack={true} i18nId={'back'} />
        </TestProviders>,
      )
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when canGoBack is false', () => {
    it('should return null', async () => {
      act(() => {
        component = renderer.create(
          <TestProviders>
            <BackButton onPress={onPressSpy} canGoBack={false} i18nId={'back'} />
          </TestProviders>,
        )
      })

      testInstance = component.root
      expect(component.toJSON()).toBeFalsy()
    })
  })

  describe('when the onPress is clicked', () => {
    it('should call the onPress function', async () => {
      testInstance.findByType(TouchableWithoutFeedback).props.onPress()
      expect(onPressSpy).toBeCalled()
    })
  })
})
