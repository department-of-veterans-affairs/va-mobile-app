import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import {context, findByTestID, renderWithProviders} from 'testUtils'
import SimpleList from './SimpleList'
import DefaultList from "./DefaultList";

context('SimpleList', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    const items = [{ text: 'one line', testId: 'testid', a11yHintText: 'hinttext' },
      { text: 'another line', a11yHintText: 'hint2', onPress: onPressSpy }]

    act(() => {
      component = renderWithProviders(<SimpleList items={items} />)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onPress when one of the buttons has been clicked', async () => {
    expect(findByTestID(testInstance, 'another-line').props.onPress())
    expect(onPressSpy).toBeCalled()
  })
})
