import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import NoDisabilityRatings from 'screens/BenefitsScreen/DisabilityRatingsScreen/NoDisabilityRatings/NoDisabilityRatings'
import { context, render } from 'testUtils'

context('NoDisabilityRatings', () => {
  it('should render text fields correctly', () => {
    render(<NoDisabilityRatings />)
    expect(screen.getByRole('header', { name: t('disabilityRating.noDisabilityRatings.title') })).toBeTruthy()
    expect(screen.getByText(t('disabilityRating.noDisabilityRatings.body'))).toBeTruthy()
  })
})
