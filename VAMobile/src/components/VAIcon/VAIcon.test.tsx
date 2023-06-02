import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI, waitFor } from 'testUtils'
import HomeSelected from './navIcon/homeSelected.svg'
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
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<VAIcon name={'HomeSelected'} fill="#fff" />, {
      preloadedState: {
        ...InitialState,
        accessibility: {
          fontScale: 2,
          isVoiceOverTalkBackRunning: false,
          isFocus: true,
        },
      },
    })

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('optional parameters', () => {
    it('should get passed to svg component', async () => {
      component = render(<VAIcon name={'HomeSelected'} testID={'myId'} height={1} width={2} />, {
        preloadedState: {
          ...InitialState,
          accessibility: {
            fontScale: 2,
            isVoiceOverTalkBackRunning: false,
            isFocus: true,
          },
        },
      })

      testInstance = component.UNSAFE_root
      const icon: ReactTestInstance = testInstance.findByType(HomeSelected)
      expect(icon).toBeTruthy()
      expect(icon.props).toEqual(
        Object.assign(
          {},
          {
            height: 3,
            width: 6,
          },
        ),
      )
    })
  })
})
