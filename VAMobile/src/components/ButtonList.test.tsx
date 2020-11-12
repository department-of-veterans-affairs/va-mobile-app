import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { TestProviders, context, findByTestID } from 'testUtils'
import ButtonList from './ButtonList'
import {TextView} from "./index";

context('ButtonList', () => {
  let component: any
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    const items = [{ textIDs: 'militaryInformation.title', a11yHintID: 'militaryInformation.a11yHint', onPress: onPressSpy }]

    act(() => {
      component = renderer.create(
        <TestProviders>
          <ButtonList items={items} translationNameSpace={'profile'} />
        </TestProviders>,
      )
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should call onPress when one of the buttons has been clicked', async () => {
    findByTestID(testInstance, 'military-information').props.onPress()
    expect(onPressSpy).toBeCalled()
  })

  it('should display raw text', async () => {
    const items = [{ displayReadyStrings: 'my string', a11yHintID: 'militaryInformation.a11yHint', onPress: onPressSpy }]

    act(() => {
      component = renderer.create(
        <TestProviders>
          <ButtonList items={items} />
        </TestProviders>,
      )
    })

    testInstance = component.root

    const texts = testInstance.findAllByType(TextView)
    expect(texts[0].props.children).toEqual('my string')
  })
})
