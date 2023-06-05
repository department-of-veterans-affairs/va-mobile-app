import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import Mock = jest.Mock

import { context, findByTestID, render, RenderAPI, waitFor } from 'testUtils'
import List from './List'
import TextView from './TextView'

context('List', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    const items = [{ content: <TextView>Hello</TextView>, a11yHintText: 'military hint', onPress: onPressSpy, testId: 'military-information' }]

    component = render(<List items={items} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onPress when one of the buttons has been clicked', async () => {
    await waitFor(() => {
      expect(findByTestID(testInstance, 'military-information').props.onPress())
      expect(onPressSpy).toBeCalled()
    })
  })
})
