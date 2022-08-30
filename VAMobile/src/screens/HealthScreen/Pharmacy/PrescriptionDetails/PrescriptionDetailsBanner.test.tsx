import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { render, context, RenderAPI } from 'testUtils'
import { ReactTestInstance } from 'react-test-renderer'

import PrescriptionsDetailsBanner from './PrescriptionsDetailsBanner'
import { RefillStatus, RefillStatusConstants } from 'store/api/types'
import { CollapsibleAlert } from 'components'

context('PrescriptionsDetailsBanner', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (status: RefillStatus = RefillStatusConstants.TRANSFERRED) => {
    component =  render((<PrescriptionsDetailsBanner status={status} />))
    testInstance = component.container
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(component).toBeTruthy()
  })

  describe('when status is not RefillStatusConstants.TRANSFERRED', () => {
    it('should not display banner', async () => {
      initializeTestInstance(RefillStatusConstants.ACTIVE)

      const collapsibleAlert = testInstance.findAllByType(CollapsibleAlert)
      expect(collapsibleAlert.length).toBe(0)
    })
  })

  describe('when status is RefillStatusConstants.TRANSFERRED', () => {
    it('should display banner', async () => {
      initializeTestInstance()

      const collapsibleAlert = testInstance.findAllByType(CollapsibleAlert)
      expect(collapsibleAlert.length).toBe(1)
    })
  })

})
