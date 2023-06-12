import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import Mock = jest.Mock
import { Pressable } from 'react-native'

import { context, render, RenderAPI } from 'testUtils'
import TextView from './TextView'
import LabelTag from './LabelTag'

context('LabelTag', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})
    component = render(<LabelTag text={'Read'} labelType={'tagGreen'} onPress={onPressSpy} />)
    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it("should render text as 'Read'", async () => {
    const texts = testInstance.findAllByType(TextView)
    expect(texts.length).toBe(1)
    expect(texts[0].props.children).toBe('Read')
  })

  it('should call the press action if it exists', async () => {
    testInstance.findByType(Pressable).props.onPress()
    expect(onPressSpy).toBeCalled()
  })
})
