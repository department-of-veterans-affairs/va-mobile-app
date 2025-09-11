import React from 'react'

import { screen } from '@testing-library/react-native'

import TravelPayClaimsFilter, { SortOption } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilter'
import { context, render } from 'testUtils'

context('TravelPayClaimsFilterGroup', () => {
  it('renders the correct elements', () => {
    render(
      <TravelPayClaimsFilter
        claims={[]}
        filter={new Set()}
        setFilter={jest.fn()}
        sortBy={SortOption.Recent}
        setSortBy={jest.fn()}
      />,
    )

    expect(screen.getByTestId('travelPayClaimsFilterModalContainer')).toBeTruthy()
    expect(screen.getByTestId('clearFiltersButton')).toBeTruthy()
  })
})
