import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import AlertBox from './AlertBox'

context('AlertBox', () => {
  let component: any
  let testInstance: RenderAPI

  beforeEach(() => {
    component = render(<AlertBox border="warning" text={'My warning'} title={'Warning title'} />)

    testInstance = component
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
