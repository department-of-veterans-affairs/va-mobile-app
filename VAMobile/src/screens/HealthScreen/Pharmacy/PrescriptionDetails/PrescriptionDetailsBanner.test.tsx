import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { render, context, RenderAPI } from 'testUtils'
import { ReactTestInstance } from 'react-test-renderer'

import PrescriptionsDetailsBanner from './PrescriptionsDetailsBanner'
import { CollapsibleAlert } from 'components'

context('PrescriptionsDetailsBanner', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = () => {
    component = render(<PrescriptionsDetailsBanner />)
    testInstance = component.UNSAFE_root
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(component).toBeTruthy()
  })

  it('should display banner', async () => {
    initializeTestInstance()

    const collapsibleAlert = testInstance.findAllByType(CollapsibleAlert)
    expect(collapsibleAlert.length).toBe(1)
  })
})
