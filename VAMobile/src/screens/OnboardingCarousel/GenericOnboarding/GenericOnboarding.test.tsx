import 'react-native'
import React from 'react'

import { context, render } from 'testUtils'
import GenericOnboarding from './GenericOnboarding'
import { screen } from '@testing-library/react-native'

context('GenericOnboarding', () => {
  const initializeTestInstance = (displayLogo: boolean = false) => {
    render(<GenericOnboarding header={'header'} text={'text'} displayLogo={displayLogo} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(screen.getByText('header')).toBeTruthy()
    expect(screen.getByText('text')).toBeTruthy()
  })

  describe('when displayLogo is true', () => {
    it('should display a VAIcon', async () => {
      initializeTestInstance(true)
      expect(screen.getByTestId('VAIconOnboardingLogo')).toBeTruthy()
    })
  })
})
