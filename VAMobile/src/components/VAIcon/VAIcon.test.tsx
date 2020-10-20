import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'

import { TestProviders, context } from 'testUtils'
import Appointments_Selected from 'images/navIcon/appointments_selected.svg'
import VAIcon from './VAIcon'

jest.mock('../../utils/common', () => ({
  useFontScale: () => {
    return (value: number) => {
      return 3 * value
    }
  },
}))

context('VAIconTests', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    act(() => {
      component = renderer.create(
        <TestProviders>
          <VAIcon name={'Home'} fill="#fff" />
        </TestProviders>,
      )
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('optional parameters', () => {
    it('should get passed to svg component', async () => {
      act(() => {
        component = renderer.create(
          <TestProviders>
            <VAIcon name={'Home'} testID={'myId'} height={1} width={2} />
          </TestProviders>,
        )
      })

      testInstance = component.root
      const icon: ReactTestInstance = testInstance.findByType(Appointments_Selected)
      expect(icon).toBeTruthy()
      expect(icon.props).toEqual({
        height: 3,
        testID: 'myId',
        width: 6,
      })
    })
  })
})
