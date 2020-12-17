import React from 'react'

import { context, renderWithProviders } from "testUtils";
import { act, ReactTestInstance } from "react-test-renderer";
import { claim } from '../../../claimData'
import ClaimPhase from "./ClaimPhase";
import PhaseIndicator from "./PhaseIndicator";
import { AlertBox, TextView, VAIcon } from "../../../../../components";
import { Pressable } from "react-native";
import ClaimTimeline from "./ClaimTimeline";

context('ClaimTimeline', () => {
  let props: any
  let component: any
  let testInstance: ReactTestInstance
  const {attributes} = claim

  const initializeTestInstance = ( needItemsFromVeteran: boolean ) => {
    const events = needItemsFromVeteran ? attributes.eventsTimeline : attributes.eventsTimeline.filter(it => it.type != 'still_need_from_you_list')
    props = {
      attributes: {...claim.attributes, eventsTimeline: events}
    }

    act(() => {
      component = renderWithProviders(<ClaimTimeline {...props} />)
    })

    testInstance = component.root
  }

  // make sure the component works
  describe('initializes with the correct elements', () => {
    it('initializes correctly without alert', async () => {
      await initializeTestInstance(false)
      expect(component).toBeTruthy()
      expect(testInstance.findAllByType(ClaimPhase).length).toEqual(5)
      expect(testInstance.findAllByType(AlertBox).length).toEqual(0)
    })
  })

  it('initializes correctly with alert', async () => {
    await initializeTestInstance(true)
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(ClaimPhase).length).toEqual(5)
    expect(testInstance.findAllByType(AlertBox).length).toEqual(1)
  })
})
