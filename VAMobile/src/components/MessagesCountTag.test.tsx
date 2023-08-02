import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, findByTestID, render, RenderAPI, waitFor } from 'testUtils'
import MessagesCountTag from './MessagesCountTag'
import TextView from './TextView'

context('MessagesCountTag', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<MessagesCountTag unread={2} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should render unread as 2', async () => {
    const texts = testInstance.findAllByType(TextView)
    expect(texts.length).toBe(1)
    expect(texts[0].props.children).toBe(2)
  })
})
