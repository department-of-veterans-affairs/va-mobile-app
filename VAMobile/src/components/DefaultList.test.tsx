import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import Mock = jest.Mock
import { context, findByTestID, render, RenderAPI, waitFor } from 'testUtils'
import DefaultList from './DefaultList'

context('DefaultList', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    const items = [
      { textLines: [{ text: 'line 1 on the first button' }, { text: 'line 2 on the first button' }], testId: 'testid', a11yHintText: 'hinttext' },
      { textLines: [{ text: 'another line' }], a11yHintText: 'hint2', onPress: onPressSpy },
    ]

    component = render(<DefaultList items={items} />)

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
