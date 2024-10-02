import React, { RefObject } from 'react'
import { ScrollView } from 'react-native'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import { claim } from '../../../claimData'
import ClaimTimeline from './ClaimTimeline'

context('ClaimTimeline', () => {
  const { attributes, id } = claim

  const initializeTestInstance = (needItemsFromVeteran: boolean) => {
    const events = needItemsFromVeteran
      ? attributes.eventsTimeline
      : attributes.eventsTimeline.filter((it) => it.type !== 'still_need_from_you_list')
    const props = {
      attributes: { ...claim.attributes, eventsTimeline: events },
      claimID: id,
      scrollIsEnabled: false,
      scrollViewRef: {} as RefObject<ScrollView>,
    }

    render(<ClaimTimeline {...props} />)
  }

  it('shows full list of steps', () => {
    initializeTestInstance(false)
    expect(screen.queryByText('You have 2 file requests from VA')).toBeFalsy()
    expect(screen.getByLabelText('Step 1 of 8. Claim received. Complete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 2 of 8. Initial review. Complete.')).toBeTruthy()
    expect(
      screen.getByLabelText('Step 3 of 8. Evidence gathering. Current step. Step 1 through 2 complete.'),
    ).toBeTruthy()
    expect(screen.getByLabelText('Step 4 of 8. Evidence review. Incomplete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 5 of 8. Rating. Incomplete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 6 of 8. Preparing decision letter. Incomplete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 7 of 8. Final review. Incomplete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 8 of 8. Claim decided. Incomplete.')).toBeTruthy()
  })
})
