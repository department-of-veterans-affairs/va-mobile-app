import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import NoDisabilityRatings from './NoDisabilityRatings'

context('NoDisabilityRatings', () => {
  it('should render text fields correctly', () => {
    render(<NoDisabilityRatings />)
    expect(
      screen.getByRole('header', { name: 'You do not have a VA combined disability rating on record.' }),
    ).toBeTruthy()
    expect(
      screen.getByText(
        "This tool doesn't include ratings for any disability claims that are still in process. You can check the status of pending claims with the claims status tool.",
      ),
    ).toBeTruthy()
  })
})
