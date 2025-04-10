import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { context, render } from 'testUtils'

import NoDisabilityRatings from './NoDisabilityRatings'

context('NoDisabilityRatings', () => {
  it('should render text fields correctly', () => {
    render(<NoDisabilityRatings />)
    expect(screen.getByRole('header', { name: t('disabilityRating.noDisabilityRatings.title') })).toBeTruthy()
    expect(screen.getByText(t('disabilityRating.noDisabilityRatings.body'))).toBeTruthy()
  })
})
