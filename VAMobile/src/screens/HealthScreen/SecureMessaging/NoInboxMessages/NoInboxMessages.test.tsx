import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders} from 'testUtils'
import NoInboxMessages from './NoInboxMessages'
import { TextView } from 'components'

context('NoInboxMessages', () => {
  let component: any
  let store: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = () => {
    act(() => {
      component = renderWithProviders(
        <NoInboxMessages />, store
      )
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should render text fields correctly', async () => {
    const texts = testInstance.findAllByType(TextView)
    expect(texts[0].props.children).toBe('You don\'t have any messages in your Inbox')
    expect(texts[1].props.children).toBe('Compose a message to ask non-urgent (non-emergency) health related questions, send updates, manage appointments, and request referrals and medication refills from your VA health care team.')
  })
})
