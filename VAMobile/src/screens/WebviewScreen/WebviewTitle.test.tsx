import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance, act } from 'react-test-renderer'
import { context, render, RenderAPI } from 'testUtils'

import WebviewTitle from './WebviewTitle'
import { TextView } from 'components'

context('WebviewTitle', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<WebviewTitle title={'my title'} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should have the correct title', async () => {
    expect(testInstance.findByType(TextView).props.children).toEqual('my title')
  })
})
