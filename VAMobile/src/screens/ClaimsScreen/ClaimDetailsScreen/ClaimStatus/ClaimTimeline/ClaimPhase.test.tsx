import React from 'react'

import { context, renderWithProviders } from "testUtils";
import { act, ReactTestInstance } from "react-test-renderer";
import { claim } from '../../../claimData'
import ClaimTimeline from "./ClaimTimeline";
import ClaimPhase from "./ClaimPhase";
import PhaseIndicator from "./PhaseIndicator";
import { VAIcon } from "../../../../../components";


/**
 * Tests needed:
 * phase is less than, equal to, and greater than current
 * if less than or equal ->
 *  - there should be an arrow icon
 *  - it should start with expanded == false
 *  - activating the icon press should make expanded == true and there should be a text field with details visible
 *
 *  documents needed from vet should test for 0 and greater than 0
 */
context('ClaimPhase', () => {
  let props: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = ( phase: number, current: number, shouldNeedDocs: boolean ) => {
    // filter test data to remove docs needed from vets if we are testing for no docs needed
    const events = shouldNeedDocs ? claim.attributes.eventsTimeline : claim.attributes.eventsTimeline.filter(it => it.type != 'still_need_from_you_list')
    props = {
      phase,
      current,
      attributes: {...claim.attributes, eventsTimeline: events}
    }

    act(() => {
      component = renderWithProviders(<ClaimPhase {...props} />)
    })

    testInstance = component.root
  }

  // make sure the component works
  it('initializes correctly', async () => {
    await initializeTestInstance(1,1, false)
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(PhaseIndicator).length).toEqual(1)
  })

  // make sure it has the expandable arrow and that it works
  describe('when phase is less than current', () => {
    beforeEach(() => {
      initializeTestInstance(1, 2, false)
    })

    it('should render with an icon',  async () => {
      const icon = testInstance.findAllByType(VAIcon)[1]
      expect(icon).toBeTruthy()
      expect(icon.props.name).toEqual('ArrowDown')
    })

    it('should start not expanded, then expand, then go back to not expanded', async () => {
      const icon = testInstance.findAllByType(VAIcon)[1]

    })
  })



})
