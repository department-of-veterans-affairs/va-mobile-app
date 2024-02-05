import React from 'react'

import { context, render, screen } from 'testUtils'

import VAImage from './VAImage'

jest.mock('../../utils/platform', () => ({
  isIOS: jest.fn(() => false),
}))

context('VAIconTests', () => {
  beforeEach(() => {
    render(<VAImage name={'PaperCheck'} a11yLabel={'testId'} marginX={10} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByLabelText('testId')).toBeTruthy()
    expect(screen.getByRole('image')).toBeTruthy()
  })
})
