import React, { RefObject } from 'react'
import { ScrollView } from 'react-native'

import { screen } from '@testing-library/react-native'

import { context, render, when } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

import { claim } from '../../../claimData'
import ClaimTimeline from './ClaimTimeline'

jest.mock('utils/remoteConfig')
when(featureEnabled).calledWith('claimPhaseExpansion').mockReturnValue(true)

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
    expect(screen.getByLabelText('Step 1. Claim received. Complete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 2. Initial review. Complete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 3. Evidence gathering. Current step. Step 1 through 2 complete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 4. Evidence review. Incomplete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 5. Rating. Incomplete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 6. Preparing decision letter. Incomplete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 7. Final review. Incomplete.')).toBeTruthy()
    expect(screen.getByLabelText('Step 8. Claim decided. Incomplete.')).toBeTruthy()
  })
})
