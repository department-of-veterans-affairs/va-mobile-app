import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { render, context, RenderAPI, waitFor, mockNavProps } from 'testUtils'

import * as api from 'store/api'
import RefillTrackingDetails from './RefillTrackingDetails'
import {ReactTestInstance} from 'react-test-renderer'
import { ErrorsState, initialErrorsState } from 'store/slices'
import { RootState } from 'store'
import { ErrorComponent, TextView } from 'components'
import {
  defaultPrescriptionsList as mockData,
  emptyStatePrescriptionList as emptyMockData,
  emptyStateTrackingInfoList as emptyTrackingMockData,
} from 'utils/tests/prescription'
import { DateTime } from 'luxon'
import { ScreenIDTypesConstants } from 'store/api/types'
import { when } from 'jest-when'
import { PrescriptionData } from 'store/api'

context('RefillTrackingDetails', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (errorState?: Partial<ErrorsState>, paramPrescription?: PrescriptionData) => {
    const props = mockNavProps({}, {
      setOptions: jest.fn(),
      navigate: jest.fn()
    }, { params: { prescription:  paramPrescription ? paramPrescription : mockData[0] } })
    const store: Partial<RootState> = {
      errors: {
        ...initialErrorsState,
        ...errorState,
      }
    }

    component = render(<RefillTrackingDetails {...props} />, {preloadedState: store})
    testInstance = component.container
  }

  it('initializes correctly', async () => {
    await waitFor(() => {
      initializeTestInstance()
    })
    expect(component).toBeTruthy()
  })

  describe('when there is no data provided', () => {
    it('should show None Noted for applicable properties', async () => {
      when(api.get as jest.Mock)
      .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
      .mockResolvedValue({ data: emptyTrackingMockData[0] })

      await waitFor(() => {
        initializeTestInstance(undefined, emptyMockData[0] as PrescriptionData)
      })

      const texts = testInstance.findAllByType(TextView)

      // Header
      expect(texts[0].props.children).toEqual('ALLOPURINOL 100MG TAB')
      expect(texts[1].props.children).toEqual('Rx #: None noted')

      // Disclaimer
      expect(texts[2].props.children).toEqual('We share tracking information here for up to 15 days, even if you\'ve received your prescription.')

      // Tracking information Card
      expect(texts[3].props.children).toEqual('Tracking number')
      expect(texts[4].props.children).toEqual('None noted')
      expect(texts[5].props.children).toEqual('Delivery service: None noted')
      expect(texts[6].props.children).toEqual('Date shipped: None noted')

      // Other prescriptions
      expect(texts[7].props.children).toEqual('Other prescriptions in this package:')
      expect(texts[8].props.children).toEqual('There are no other prescriptions in this package.')
    })
  })

  describe('when there is a downtime message for rx refill', () => {
    it('should show PRESCRIPTION_SCREEN downtime message', async () => {
      await waitFor(() => {
        initializeTestInstance( {
          downtimeWindowsByFeature: {
            rx_refill: {
              featureName: 'VA Prescriptions',
              startTime: DateTime.now().plus({ days: -1 }),
              endTime: DateTime.now().plus({ days: 1 }),
            }
          }
        })
      })

      const error = testInstance.findByType(ErrorComponent)
      expect(error).toBeTruthy()
      expect(error.props.screenID).toEqual(ScreenIDTypesConstants.PRESCRIPTION_SCREEN_ID)
    })
  })

  describe('when there is an error', () => {
    it('should show PRESCRIPTION_TRACKING_DETAILS_SCREEN_ID error', async () => {
      when(api.get as jest.Mock)
      .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
      .mockRejectedValue({ networkError: 500})
      await waitFor(() => {
        initializeTestInstance()
      })

      const error = testInstance.findByType(ErrorComponent)
      expect(error).toBeTruthy()
      expect(error.props.screenID).toEqual(ScreenIDTypesConstants.PRESCRIPTION_TRACKING_DETAILS_SCREEN_ID)
    })
  })
})
