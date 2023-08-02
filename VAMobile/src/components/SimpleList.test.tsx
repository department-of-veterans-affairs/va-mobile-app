import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, findByTestID, render, RenderAPI, waitFor } from 'testUtils'
import SimpleList from './SimpleList'

context('SimpleList', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    const items = [
      { text: 'one line', testId: 'testid', a11yHintText: 'hinttext' },
      { text: 'another line', a11yHintText: 'hint2', onPress: onPressSpy },
    ]

    component = render(<SimpleList items={items} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onPress when one of the buttons has been clicked', async () => {
    await waitFor(() => {
      expect(findByTestID(testInstance, 'another-line').props.onPress())
      expect(onPressSpy).toBeCalled()
    })
  })
})
