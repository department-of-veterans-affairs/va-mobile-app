import React from 'react'

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
    }

    render(<ClaimTimeline {...props} />)
  }

  it('initializes correctly', () => {
    initializeTestInstance(false)
    expect(screen.queryByText('You have 2 file requests from VA')).toBeFalsy()
    expect(screen.getByTestId('Step 1 of 5. completed. Claim received June 6, 2019')).toBeTruthy()
    expect(screen.getByTestId('Step 2 of 5. completed. Initial review June 6, 2019')).toBeTruthy()
    expect(
      screen.getByTestId('Step 3 of 5. current. Evidence gathering, review, and decision July 16, 2020'),
    ).toBeTruthy()
    expect(screen.getByTestId('Step 4 of 5.  Preparation for notification')).toBeTruthy()
    expect(screen.getByTestId('Step 5 of 5.  Complete')).toBeTruthy()

    initializeTestInstance(true)
    expect(screen.getAllByText('You have 2 file requests from VA')).toBeTruthy()
  })
})
