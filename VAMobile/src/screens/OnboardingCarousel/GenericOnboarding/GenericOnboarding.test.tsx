import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import GenericOnboarding from './GenericOnboarding'

context('GenericOnboarding', () => {
  const initializeTestInstance = (displayLogo: boolean = false) => {
    render(<GenericOnboarding header={'header'} text={'text'} displayLogo={displayLogo} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: 'header' })).toBeTruthy()
    expect(screen.getByText('text')).toBeTruthy()
  })

  describe('when displayLogo is true', () => {
    it('should display a VAIcon', () => {
      initializeTestInstance(true)
      expect(screen.getByTestId('VAIconOnboardingLogo')).toBeTruthy()
    })
  })
})
