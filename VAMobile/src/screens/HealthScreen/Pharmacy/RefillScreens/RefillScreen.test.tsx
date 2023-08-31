import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { render, context, RenderAPI, waitFor, mockNavProps } from 'testUtils'
import { ReactTestInstance } from 'react-test-renderer'

import { RefillScreen } from './RefillScreen'
import NoRefills from './NoRefills'
import { RootState } from 'store'
import { ErrorsState, initialErrorsState, initialPrescriptionState, PrescriptionState } from 'store/slices'
import { DateTime } from 'luxon'
import { AlertBox, ErrorComponent, VAButton } from 'components'
import { ScreenIDTypesConstants } from 'store/api/types'
import { defaultPrescriptionsList as mockData } from 'utils/tests/prescription'

context('RefillScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (prescriptionState?: Partial<PrescriptionState>, errorState?: Partial<ErrorsState>) => {
    const props = mockNavProps(
      {},
      {
        setOptions: jest.fn(),
        navigate: jest.fn(),
        addListener: jest.fn(),
      },
    )
    const store: Partial<RootState> = {
      prescriptions: {
        ...initialPrescriptionState,
        ...prescriptionState,
      },
      errors: {
        ...initialErrorsState,
        ...errorState,
      },
    }

    component = render(<RefillScreen {...props} />, { preloadedState: store })
    testInstance = component.UNSAFE_root
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
          refillablePrescriptions: [],
        })
      })
      expect(testInstance.findByType(NoRefills)).toBeTruthy()
    })
  })

  describe('if no prescription is selected', () => {
    it('should show alert for no prescription selected', async () => {
      await waitFor(() => {
        initializeTestInstance({
          prescriptionsNeedLoad: false,
          refillablePrescriptions: mockData,
        })
      })

      await waitFor(() => {
        const button = testInstance.findByType(VAButton)
        button.props.onPress()
      })

      const alert = testInstance.findByType(AlertBox)
      expect(alert).toBeTruthy()
      expect(alert.props.title).toEqual('Please select a prescription')
    })
  })

  describe('when there is a downtime message for rx refill', () => {
    it('should show PRESCRIPTION_REFILL_SCREEN_ID downtime message', async () => {
      await waitFor(() => {
        initializeTestInstance(
          {},
          {
            downtimeWindowsByFeature: {
              rx_refill: {
                startTime: DateTime.now().plus({ days: -1 }),
                endTime: DateTime.now().plus({ days: 1 }),
              },
            },
          },
        )
      })

      const error = testInstance.findByType(ErrorComponent)
      expect(error).toBeTruthy()
      expect(error.props.screenID).toEqual(ScreenIDTypesConstants.PRESCRIPTION_REFILL_SCREEN_ID)
    })
  })
})
