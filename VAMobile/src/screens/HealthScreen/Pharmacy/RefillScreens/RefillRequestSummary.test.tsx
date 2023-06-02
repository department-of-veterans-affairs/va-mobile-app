import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { render, context, RenderAPI, waitFor, findByTypeWithText, mockNavProps } from 'testUtils'

import RefillRequestSummary from './RefillRequestSummary'
import { ReactTestInstance } from 'react-test-renderer'
import { initialPrescriptionState, PrescriptionState } from 'store/slices'
import { RootState } from 'store'
import { RefillRequestSummaryItems } from 'store/api'
import { TextView, VAButton } from 'components'
import { defaultPrescriptionsList as mockData } from 'utils/tests/prescription'

context('RefillRequestSummary', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = (prescriptionState?: Partial<PrescriptionState>) => {
    const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn(), addListener: jest.fn() })
    const store: Partial<RootState> = {
      prescriptions: {
        ...initialPrescriptionState,
        ...prescriptionState,
      },
    }
    component = render(<RefillRequestSummary {...props} />, { preloadedState: store })
    testInstance = component.UNSAFE_root
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('when all request submit successfully', () => {
    it('should display successful summary', async () => {
      await waitFor(() => {
        initializeTestInstance({
          refillRequestSummaryItems: [
            {
              data: mockData[0],
              submitted: true,
            },
          ] as RefillRequestSummaryItems,
        })
      })

      const textView = testInstance.findAllByType(TextView)
      // Alert
      expect(textView[2].props.children).toEqual('We got your refill requests')

      // Summary
      expect(textView[3].props.children).toEqual('Refill request summary')
      expect(textView[4].props.children).toEqual('ALLOPURINOL 100MG TAB')
      expect(textView[5].props.children).toEqual('Rx #: 3636691')

      // Whats next
      expect(textView[6].props.children).toEqual('What’s next')
      expect(textView[7].props.children).toEqual("We're reviewing your refill request. Once approved, the VA pharmacy will process your refill.")
      expect(textView[8].props.children).toEqual('If you have questions about the status of your refill, contact your provider or local VA pharmacy.')
      // Buttons
      const vaButtons = testInstance.findAllByType(VAButton)
      expect(vaButtons.length).toEqual(1) // should only be one button 'Go to all pending refills'
      expect(testInstance.findByType(VAButton).props.label).toEqual('Go to all pending refills')
    })
  })

  describe('when all request failed', () => {
    it('should display fail summary', async () => {
      await waitFor(() => {
        initializeTestInstance({
          refillRequestSummaryItems: [
            {
              data: mockData[0],
              submitted: false,
            },
          ] as RefillRequestSummaryItems,
        })
      })

      const textView = testInstance.findAllByType(TextView)
      // Alert
      expect(textView[2].props.children).toEqual("We didn't get 1 refill requests")
      expect(textView[3].props.children).toEqual("We're sorry. Something went wrong on our end. Try again or contact your local VA pharmacy.")

      // Buttons
      const vaButtons = testInstance.findAllByType(VAButton)
      expect(vaButtons.length).toEqual(1) // should only be one button 'Try again'
      expect(vaButtons[0].props.label).toEqual('Try again')

      // Summary
      expect(textView[5].props.children).toEqual('Refill request summary')
      expect(textView[6].props.children).toEqual('ALLOPURINOL 100MG TAB')
      expect(textView[7].props.children).toEqual('Rx #: 3636691')

      // Whats next should not show
      expect(findByTypeWithText(testInstance, TextView, 'What’s next')).toBeFalsy()
    })
  })

  describe('when some request succeed and some failed', () => {
    it('should display mix summary', async () => {
      await waitFor(() => {
        initializeTestInstance({
          refillRequestSummaryItems: [
            {
              data: mockData[0],
              submitted: true,
            },
            {
              data: mockData[1],
              submitted: false,
            },
          ] as RefillRequestSummaryItems,
        })
      })

      // Buttons
      const vaButtons = testInstance.findAllByType(VAButton)
      expect(vaButtons.length).toEqual(2) // should only two buttons 'Try again' and 'Go to all pending refills'
      expect(vaButtons[0].props.label).toEqual('Try again')
      expect(vaButtons[1].props.label).toEqual('Go to all pending refills')

      const textView = testInstance.findAllByType(TextView)
      // Alert
      expect(textView[2].props.children).toEqual("We didn't get 1 refill requests")
      expect(textView[3].props.children).toEqual("We're sorry. Something went wrong on our end. Try again or contact your local VA pharmacy.")

      // Summary
      expect(textView[5].props.children).toEqual('Refill request summary')
      expect(textView[6].props.children).toEqual('ALLOPURINOL 100MG TAB')
      expect(textView[7].props.children).toEqual('Rx #: 3636691')
      expect(textView[8].props.children).toEqual('AMLODIPINE BESYLATE 10MG TAB')
      expect(textView[9].props.children).toEqual('Rx #: 3636711A')

      // Whats next
      expect(textView[10].props.children).toEqual('What’s next')
      expect(textView[11].props.children).toEqual("We're reviewing your refill request. Once approved, the VA pharmacy will process your refill.")
      expect(textView[12].props.children).toEqual('If you have questions about the status of your refill, contact your provider or local VA pharmacy.')
    })
  })
})
