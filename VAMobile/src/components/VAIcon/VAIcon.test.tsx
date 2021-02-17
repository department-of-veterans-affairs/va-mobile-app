import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockStore, renderWithProviders } from 'testUtils'
import Appointments_Selected from 'images/navIcon/appointments_selected.svg'
import VAIcon from './VAIcon'
import {InitialState} from 'store/reducers'

jest.mock('../../utils/hooks', ()=> {
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
  let component: any
  let testInstance: ReactTestInstance
  let store = mockStore({
    ...InitialState,
    accessibility: {
      fontScale: 2
    }
  })

  beforeEach(() => {
    act(() => {
      component = renderWithProviders(<VAIcon name={'Home'} fill="#fff" />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('optional parameters', () => {
    it('should get passed to svg component', async () => {
      act(() => {
        component = renderWithProviders(<VAIcon name={'Home'} testID={'myId'} height={1} width={2} />, store)
      })

      testInstance = component.root
      const icon: ReactTestInstance = testInstance.findByType(Appointments_Selected)
      expect(icon).toBeTruthy()
      expect(icon.props).toEqual(Object.assign({},{
        height: 3,
        width: 6,
      }))
    })
  })
})
