import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { render, context, RenderAPI, waitFor, mockNavProps, findByTypeWithText } from 'testUtils'

import PrescriptionDetails from './PrescriptionDetails'
import { ReactTestInstance } from 'react-test-renderer'
import { initialAuthState } from 'store/slices'
import { initialPrescriptionState } from 'store/slices/prescriptionSlice'
import { ClickForActionLink, TextView } from 'components'

context('PrescriptionDetails', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = () => {
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
              },
            },
          },
        },
      },
    })
    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('when showing prescription details data', () => {
    it('should show prescription fields', async () => {
      expect(findByTypeWithText(testInstance, TextView, 'Instructions')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Refills left')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Last fill date')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Quantity')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Expires on')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Ordered on')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'VA facility')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Rx #')).toBeTruthy()

      expect(testInstance.findAllByType(ClickForActionLink)).toHaveLength(2)
    })
  })
})
