import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { TestProviders, context, findByTestID } from 'testUtils'
import List from './List'
import TextView from './TextView'

context('List', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    const items = [{ content: <TextView>Hello</TextView>, a11yHintText: 'military hint', onPress: onPressSpy, testId: 'military-information'}]

    act(() => {
      component = renderer.create(
        <TestProviders>
          <List items={items} />
        </TestProviders>,
      )
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onPress when one of the buttons has been clicked', async () => {
    expect(findByTestID(testInstance, 'military-information').props.onPress())
    expect(onPressSpy).toBeCalled()
  })
})
