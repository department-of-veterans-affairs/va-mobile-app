import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { TouchableWithoutFeedback } from 'react-native'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { TestProviders, context } from 'testUtils'
import SaveButton from './SaveButton'

context('SaveButton', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onSaveSpy: Mock

  beforeEach(() => {
    onSaveSpy = jest.fn(() => {})

    act(() => {
      component = renderer.create(
        <TestProviders>
          <SaveButton onSave={onSaveSpy} disabled={false} />
        </TestProviders>,
      )
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the onSave is clicked', () => {
    it('should call the onSave function', async () => {
      testInstance.findByType(TouchableWithoutFeedback).props.onPress()
      expect(onSaveSpy).toBeCalled()
    })
  })
})
