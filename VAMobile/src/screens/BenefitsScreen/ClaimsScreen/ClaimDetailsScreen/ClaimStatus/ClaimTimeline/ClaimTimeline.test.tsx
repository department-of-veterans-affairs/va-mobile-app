import React from 'react'

import { context, render, RenderAPI } from 'testUtils'
import { ReactTestInstance } from 'react-test-renderer'
import { claim } from '../../../claimData'
import ClaimPhase from './ClaimPhase'
import { AlertBox } from '../../../../../../components'
import ClaimTimeline from './ClaimTimeline'

context('ClaimTimeline', () => {
  let props: any
  let component: RenderAPI
  let testInstance: ReactTestInstance
  const { attributes } = claim

  const initializeTestInstance = (needItemsFromVeteran: boolean) => {
    const events = needItemsFromVeteran ? attributes.eventsTimeline : attributes.eventsTimeline.filter((it) => it.type != 'still_need_from_you_list')
    props = {
      attributes: { ...claim.attributes, eventsTimeline: events },
    }

    component = render(<ClaimTimeline {...props} />)

    testInstance = component.UNSAFE_root
  }

  // make sure the component works
  describe('initializes with the correct elements', () => {
    it('initializes correctly without alert', async () => {
      initializeTestInstance(false)
      expect(component).toBeTruthy()
      expect(testInstance.findAllByType(ClaimPhase).length).toEqual(5)
      expect(testInstance.findAllByType(AlertBox).length).toEqual(0)
    })
  })

  it('initializes correctly with alert', async () => {
    initializeTestInstance(true)
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(ClaimPhase).length).toEqual(5)
    expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
  })
})
