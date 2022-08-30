import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { render, context, RenderAPI, waitFor, mockNavProps, findByTypeWithText } from 'testUtils'

import PrescriptionDetails from './PrescriptionDetails'
import { ReactTestInstance } from 'react-test-renderer'
import { initialAuthState } from 'store/slices'
import { initialPrescriptionState } from 'store/slices/prescriptionSlice'
import { ClickForActionLink, TextView } from 'components'
import { PrescriptionAttributeData } from 'store/api'

context('PrescriptionDetails', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (mockAttributeData: Partial<PrescriptionAttributeData> = {} ) => {
    const props = mockNavProps(undefined, undefined, { params: { prescriptionId: '13650544' } })

    component = render(<PrescriptionDetails {...props} />, {
      preloadedState: {
        auth: { ...initialAuthState },
        prescriptions: {
          ...initialPrescriptionState,
          prescriptionsById: {
            '13650544': {
              type: 'Prescription',
              id: '13650544',
              attributes: {
                refillStatus: 'active',
                refillSubmitDate: '2022-10-28T04:00:00.000Z',
                refillDate: '2022-10-28T04:00:00.000Z',
                refillRemaining: 5,
                facilityName: 'DAYT29',
                isRefillable: false,
                isTrackable: false,
                orderedDate: '2022-10-28T04:00:00.000Z',
                quantity: 10,
                expirationDate: '2022-10-28T04:00:00.000Z',
                prescriptionNumber: '2719536',
                prescriptionName: 'SOMATROPIN 5MG INJ (VI)',
                instructions: 'TAKE 1 TABLET WITH FOOD 3 TIMES A DAY',
                dispensedDate: '2022-10-28T04:00:00.000Z',
                stationNumber: '989',
                ...mockAttributeData,
              },
            },
          },
        },
      },
    })
    testInstance = component.container
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('when showing prescription details data', () => {
    it('should show prescription fields', async () => {
      initializeTestInstance()
      expect(findByTypeWithText(testInstance, TextView, 'Instructions')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Refills left')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Last fill date')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Quantity')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Expires on')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Ordered on')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'VA facility')).toBeTruthy()

      expect(testInstance.findAllByType(ClickForActionLink)).toHaveLength(2)
    })
  })

  describe('when there is no data provided', () => {
    it('should show None Noted for applicable properties', async () => {
      initializeTestInstance({
        instructions: '',
        refillRemaining: undefined,
        quantity: undefined,
        refillDate: null,
        expirationDate: null,
        orderedDate: null,
        facilityName: '',
        prescriptionNumber: '',
      })
      const texts = testInstance.findAllByType(TextView)

      expect(texts[2].props.children).toEqual('Rx #: None noted')
      expect(texts[3].props.children).toEqual('Instructions')
      expect(texts[4].props.children).toEqual('None noted')
      expect(texts[5].props.children).toEqual('Refills left')
      expect(texts[6].props.children).toEqual('None noted')
      expect(texts[7].props.children).toEqual('Last fill date')
      expect(texts[8].props.children).toEqual('None noted')
      expect(texts[9].props.children).toEqual('Quantity')
      expect(texts[10].props.children).toEqual('None noted')
      expect(texts[11].props.children).toEqual('Expires on')
      expect(texts[12].props.children).toEqual('None noted')
      expect(texts[13].props.children).toEqual('Ordered on')
      expect(texts[14].props.children).toEqual('None noted')
      expect(texts[15].props.children).toEqual('VA facility')
      expect(texts[16].props.children).toEqual('None noted')
    })
  })
})
