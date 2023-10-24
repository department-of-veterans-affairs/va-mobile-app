import React from 'react'

import { context, render } from 'testUtils'
import { screen } from '@testing-library/react-native'
import PhaseIndicator from './PhaseIndicator'

context('PhaseIndicator', () => {
  const initializeTextInstance = (phase: number, current: number) => {
    render(<PhaseIndicator phase={phase} current={current} />)
  }
  it('initializes correctly', async () => {
    initializeTextInstance(1, 1)
    expect(screen.getByText('1')).toBeTruthy()
    initializeTextInstance(1, 2)
    expect(screen.queryByText('1')).toBeFalsy()
    initializeTextInstance(2, 1)
    expect(screen.getByText('2')).toBeTruthy()
  })
})
