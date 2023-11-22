import React from 'react'
import { context, render, screen } from 'testUtils'
import VAIcon from './VAIcon'
import { InitialState } from 'store/slices'

jest.mock('../../utils/hooks', () => {
  let original = jest.requireActual('../../utils/hooks')
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
      render(<VAIcon name={'HomeSelected'} testID={'myId'} height={1} width={2} />, {
        preloadedState: {
          ...InitialState,
          accessibility: {
            fontScale: 2,
            isVoiceOverTalkBackRunning: false,
            isFocus: true,
          },
        },
      })

      expect(screen.getByTestId('myId')).toBeTruthy()
      expect(screen.UNSAFE_getByProps({
        height: 3,
        width: 6,
      })).toBeTruthy()
    })
  })
})
