import React from 'react'
import { screen, fireEvent } from '@testing-library/react-native'
import { DateTime } from 'luxon'

import { render, context, waitFor, mockNavProps } from 'testUtils'
import { RefillScreen } from './RefillScreen'
import { RootState } from 'store'
import { ErrorsState, initialErrorsState, initialPrescriptionState, PrescriptionState } from 'store/slices'
import { defaultPrescriptionsList as mockData } from 'utils/tests/prescription'

context('RefillScreen', () => {
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
    render(<RefillScreen {...props} />, { preloadedState: store })
  }

  describe('no there are no refillable prescriptions', () => {
    it('should show NoRefills component', async () => {
      await waitFor(() => {
        initializeTestInstance({
          refillablePrescriptions: [],
        })
      })
      expect(screen.getByText('You have no prescriptions for refill')).toBeTruthy()
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
      fireEvent.press(screen.getByText('Request refills'))
      expect(screen.getByText('Please select a prescription')).toBeTruthy()
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
      expect(screen.getByText("The VA mobile app isn't working right now")).toBeTruthy()
    })
  })
})
