import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import NoInboxMessages from './NoInboxMessages'
import { TextView } from 'components'

context('NoInboxMessages', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = () => {
    component = render(<NoInboxMessages />)

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should render text fields correctly', async () => {
    const texts = testInstance.findAllByType(TextView)
    expect(texts[0].props.children).toBe("You don't have any messages in your inbox")
    expect(texts[1].props.children).toBe('Waiting for a reply from your care team? It may take up to 3 business days to get a reply.')
  })
})
