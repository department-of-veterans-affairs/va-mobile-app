import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { render, context, RenderAPI, waitFor, mockNavProps } from 'testUtils'

import * as api from 'store/api'
import RefillTrackingDetails from './RefillTrackingDetails'
import { ReactTestInstance } from 'react-test-renderer'
import { ErrorsState, initialErrorsState } from 'store/slices'
import { RootState } from 'store'
import { ErrorComponent, TextView } from 'components'
import {
  defaultPrescriptionsList as mockData,
  emptyStatePrescriptionList as emptyMockData,
  emptyStateTrackingInfoList as emptyTrackingMockData,
  multipleTrackingInfoList as multipleTrackingInfoData,
} from 'utils/tests/prescription'
import { DateTime } from 'luxon'
import { ScreenIDTypesConstants } from 'store/api/types'
import { when } from 'jest-when'
import { PrescriptionData } from 'store/api'

context('RefillTrackingDetails', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (errorState?: Partial<ErrorsState>, paramPrescription?: PrescriptionData) => {
    const props = mockNavProps(
      {},
      {
        setOptions: jest.fn(),
        navigate: jest.fn(),
        addListener: jest.fn(),
      },
      { params: { prescription: paramPrescription ? paramPrescription : mockData[0] } },
    )
    const store: Partial<RootState> = {
      errors: {
        ...initialErrorsState,
        ...errorState,
      },
    }

    component = render(<RefillTrackingDetails {...props} />, { preloadedState: store })
    testInstance = component.UNSAFE_root
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
        .mockResolvedValue({ data: emptyTrackingMockData })

      await waitFor(() => {
        initializeTestInstance(undefined, emptyMockData[0] as PrescriptionData)
      })

      const texts = testInstance.findAllByType(TextView)

      // Header
      expect(texts[2].props.children).toEqual('ALLOPURINOL 100MG TAB')
      expect(texts[3].props.children).toEqual('Rx #: None noted')

      // Disclaimer
      expect(texts[4].props.children).toEqual("We share tracking information here for up to 15 days, even if you've received your prescription.")

      // Tracking Information
      expect(texts[6].props.children).toEqual('Tracking number')
      expect(texts[7].props.children).toEqual('None noted')
      expect(texts[8].props.children).toEqual('Delivery service: None noted')
      expect(texts[9].props.children).toEqual('Date shipped: None noted')

      // Other prescriptions
      expect(texts[10].props.children).toEqual('Other prescriptions in this package:')
      expect(texts[11].props.children).toEqual('There are no other prescriptions in this package.')
    })
  })

  describe('when there are one tracking for a prescription', () => {
    it('should show tracking information', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
        .mockResolvedValue({ data: [multipleTrackingInfoData[0]] })

      await waitFor(() => {
        initializeTestInstance(undefined, mockData[0] as PrescriptionData)
      })

      const texts = testInstance.findAllByType(TextView)

      // Header
      expect(texts[2].props.children).toEqual('ALLOPURINOL 100MG TAB')
      expect(texts[3].props.children).toEqual('Rx #: 3636691')

      // Disclaimer
      expect(texts[4].props.children).toEqual("We share tracking information here for up to 15 days, even if you've received your prescription.")

      // Tracking Information
      expect(texts[6].props.children).toEqual('Tracking number')
      expect(texts[7].props.children).toEqual('7534533636856')
      expect(texts[8].props.children).toEqual('Delivery service: DHL')
      expect(texts[9].props.children).toEqual('Date shipped: 06/14/2022')
      // Other Prescriptions
      expect(texts[10].props.children).toEqual('Other prescriptions in this package:')
      expect(texts[11].props.children).toEqual('LAMIVUDINE 10MG TAB')
      expect(texts[12].props.children).toEqual('Rx #: 2336800')
      expect(texts[13].props.children).toEqual('ZIDOVUDINE 1MG CAP')
      expect(texts[14].props.children).toEqual('Rx #: None noted')
    })
  })

  describe('when there are multiple tracking for a prescription', () => {
    it('should show information for each tracking with "x of total" header ', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/health/rx/prescriptions/20004342/tracking`)
        .mockResolvedValue({ data: multipleTrackingInfoData })

      await waitFor(() => {
        initializeTestInstance(undefined, mockData[0] as PrescriptionData)
      })

      const texts = testInstance.findAllByType(TextView)

      // Header
      expect(texts[2].props.children).toEqual('ALLOPURINOL 100MG TAB')
      expect(texts[3].props.children).toEqual('Rx #: 3636691')

      // Disclaimer
      expect(texts[4].props.children).toEqual("We share tracking information here for up to 15 days, even if you've received your prescription.")

      // Tracking Information #1
      expect(texts[6].props.children).toEqual('Package 1 of 2')
      expect(texts[7].props.children).toEqual('Tracking number')
      expect(texts[8].props.children).toEqual('7534533636856')
      expect(texts[9].props.children).toEqual('Delivery service: DHL')
      expect(texts[10].props.children).toEqual('Date shipped: 06/14/2022')
      // Other Prescriptions
      expect(texts[11].props.children).toEqual('Other prescriptions in this package:')
      expect(texts[12].props.children).toEqual('LAMIVUDINE 10MG TAB')
      expect(texts[13].props.children).toEqual('Rx #: 2336800')
      expect(texts[14].props.children).toEqual('ZIDOVUDINE 1MG CAP')
      expect(texts[15].props.children).toEqual('Rx #: None noted')

      // Tracking Information #2
      expect(texts[16].props.children).toEqual('Package 2 of 2')
      expect(texts[17].props.children).toEqual('Tracking number')
      expect(texts[18].props.children).toEqual('5634533636812')
      expect(texts[19].props.children).toEqual('Delivery service: USPS')
      expect(texts[20].props.children).toEqual('Date shipped: 06/28/2022')
      // Other Prescriptions
      expect(texts[21].props.children).toEqual('Other prescriptions in this package:')
      expect(texts[22].props.children).toEqual('AMLODIPINE BESYLATE 10MG TAB')
      expect(texts[23].props.children).toEqual('Rx #: 3636711A')
      expect(texts[24].props.children).toEqual('ZIDOVUDINE 1MG CAP')
      expect(texts[25].props.children).toEqual('Rx #: 4636722C')
    })
  })

  describe('when there is a downtime message for rx refill', () => {
    it('should show PRESCRIPTION_SCREEN downtime message', async () => {
      await waitFor(() => {
        initializeTestInstance({
          downtimeWindowsByFeature: {
            rx_refill: {
              startTime: DateTime.now().plus({ days: -1 }),
              endTime: DateTime.now().plus({ days: 1 }),
            },
          },
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
        .mockRejectedValue({ networkError: 500 })
      await waitFor(() => {
        initializeTestInstance()
      })

      const error = testInstance.findByType(ErrorComponent)
      expect(error).toBeTruthy()
      expect(error.props.screenID).toEqual(ScreenIDTypesConstants.PRESCRIPTION_TRACKING_DETAILS_SCREEN_ID)
    })
  })
})
