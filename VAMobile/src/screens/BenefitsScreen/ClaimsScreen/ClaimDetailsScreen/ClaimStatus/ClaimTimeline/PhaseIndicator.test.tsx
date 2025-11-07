import React from 'react'

import { screen } from '@testing-library/react-native'

import PhaseIndicator from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimTimeline/PhaseIndicator'
import { context, render } from 'testUtils'

context('PhaseIndicator', () => {
  const initializeTextInstance = (phase: number, current: number) => {
    render(<PhaseIndicator phase={phase} current={current} />)
  }
  it('initializes correctly', () => {
    initializeTextInstance(1, 1)
    expect(screen.getByText('1')).toBeTruthy()
    initializeTextInstance(1, 2)
    expect(screen.queryByText('1')).toBeFalsy()
    initializeTextInstance(2, 1)
    expect(screen.getByText('2')).toBeTruthy()
  })
})
