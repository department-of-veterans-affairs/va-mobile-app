import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { render, context, RenderAPI, waitFor, mockNavProps } from 'testUtils'
import { ReactTestInstance } from 'react-test-renderer'

import { RefillScreen } from './RefillScreen'
import NoRefills from './NoRefills'
import { RootState } from 'store'
import { initialPrescriptionState, PrescriptionState } from 'store/slices'

context('RefillScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (prescriptionState?: Partial<PrescriptionState>) => {
    const props = mockNavProps({}, {
      setOptions: jest.fn(),
      navigate: jest.fn()
    })
    const store: Partial<RootState> = {
      prescriptions: {
        ...initialPrescriptionState,
        ...prescriptionState,
      }
    }

    component = render(<RefillScreen {...props} />, {preloadedState: store})
    testInstance = component.container
  }

  it('initializes correctly', async () => {
    await waitFor(() => {
      initializeTestInstance()
    })
    expect(component).toBeTruthy()
  })

  describe('no there are no refillable prescriptions', () => {
    it('should show NoRefills component', async () => {
      await waitFor(() => {
        initializeTestInstance({
          refillablePrescriptions: []
        })
      })
      expect(testInstance.findByType(NoRefills)).toBeTruthy()
    })
  })
})