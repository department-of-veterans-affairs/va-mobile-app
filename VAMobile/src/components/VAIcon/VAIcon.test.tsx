import React from 'react'

import { context, render, screen } from 'testUtils'

import VAIcon from './VAIcon'

jest.mock('../../utils/hooks', () => {
  const original = jest.requireActual('../../utils/hooks')
  return {
    ...original,
    useFontScale: () => {
      return (value: number) => {
        return 3 * value
      }
    },
  }
})

context('VAIconTests', () => {
  describe('optional parameters', () => {
    it('should get passed to svg component', () => {
      render(<VAIcon name={'Chat'} testID={'myId'} height={1} width={2} />)

      expect(screen.getByTestId('myId')).toBeTruthy()
    })
  })
})
