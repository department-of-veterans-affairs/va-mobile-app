import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { TouchableWithoutFeedback } from 'react-native'
import { ReactTestInstance } from 'react-test-renderer'
import Mock = jest.Mock

import { context, render, RenderAPI, waitFor } from 'testUtils'
import SaveButton from './SaveButton'

context('SaveButton', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onSaveSpy: Mock

  beforeEach(() => {
    onSaveSpy = jest.fn(() => {})

    component = render(<SaveButton onSave={onSaveSpy} disabled={false} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the onSave is clicked', () => {
    it('should call the onSave function', async () => {
      await waitFor(() => {
        testInstance.findByType(TouchableWithoutFeedback).props.onPress()
        expect(onSaveSpy).toBeCalled()
      })
    })
  })
})
