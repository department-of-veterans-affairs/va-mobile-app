import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.

import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders, mockStore } from 'testUtils'
import BasicError from "./BasicError";
import Mock = jest.Mock;
import {Pressable} from "react-native";

context('BasicError', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  let onTryAgainSpy: Mock

  beforeEach(() => {
    store = mockStore({})
    onTryAgainSpy = jest.fn(() => {})

    act(() => {
      component = renderWithProviders(
        <BasicError onTryAgain={onTryAgainSpy} messageText={'message body'} />,
        store
      )
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the try again button is clicked', () => {
    it('should call the onTryAgain function', async () => {
      testInstance.findByType(Pressable).props.onPress()
      expect(onTryAgainSpy).toBeCalled()
    })
  })
})
