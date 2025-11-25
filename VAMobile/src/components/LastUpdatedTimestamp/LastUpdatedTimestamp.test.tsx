import React from 'react'

import LastUpdatedTimestamp from 'components/LastUpdatedTimestamp/LastUpdatedTimestamp'
import { context, render, screen } from 'testUtils'

context('LastUpdatedTimestamp', () => {
  const initializeTestInstance = (datetime?: number) => {
    render(<LastUpdatedTimestamp datetime={datetime} />)
  }

  it('should render formatted date time', () => {
    const now = Date.now()
    initializeTestInstance(now)
    expect(screen.getByTestId('last-updated-timestamp')).toBeTruthy()
  })

  it('should not render anything if no date time is provided', () => {
    initializeTestInstance()
    expect(screen.queryByTestId('last-updated-timestamp')).toBeFalsy()
  })
})
