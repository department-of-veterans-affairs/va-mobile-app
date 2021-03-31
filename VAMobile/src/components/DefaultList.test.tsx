import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import {context, findByTestID, renderWithProviders} from 'testUtils'
import DefaultList from './DefaultList'

context('DefaultList', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    const items = [{ textLines: [{ text: 'line 1 on the first button' }, { text: 'line 2 on the first button' }], testId: 'testid', a11yHintText: 'hinttext' },
      { textLines: [{ text: 'another line' }], a11yHintText: 'hint2', onPress: onPressSpy }]

    act(() => {
      component = renderWithProviders(<DefaultList items={items} />)
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
