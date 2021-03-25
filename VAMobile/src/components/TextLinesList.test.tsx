import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { TestProviders, context, findByTestID } from 'testUtils'
import TextLinesList from "./TextLinesList";

context('TextLinesList', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    const items = [{ textLines: 'one line', testId: 'testid', a11yHintText: 'hinttext' },
      { textLines: 'another line', a11yHintText: 'hint2', onPress: onPressSpy }]

    act(() => {
      component = renderer.create(
        <TestProviders>
          <TextLinesList items={items} />
        </TestProviders>,
      )
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
