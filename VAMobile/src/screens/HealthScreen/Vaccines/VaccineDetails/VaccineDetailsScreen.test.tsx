import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, findByTypeWithText, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import { initialAuthState, initialErrorsState, initialVaccineState, initialSecureMessagingState } from 'store'
import { TextView } from 'components'
import VaccineDetailsScreen from './VaccineDetailsScreen'

context('VaccineDetailsScreen', () => {
  let component: any
  let props: any
  let store: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (vId: string = 'N7A6Q5AU6W5C6O4O7QEDZ3SJXM000000', loaded: boolean = true) => {
    props = mockNavProps(undefined, undefined, { params: { vaccineId: vId } })

    store = mockStore({
      auth: { ...initialAuthState },
      vaccine: {
        ...initialVaccineState,
        vaccinesById: {
          N7A6Q5AU6W5C6O4O7QEDZ3SJXM000000: {
            id: "N7A6Q5AU6W5C6O4O7QEDZ3SJXM000000",
            type: "immunization",
            attributes: {
              cvxCode: 207,
              date: "2020-12-18T12:24:55Z",
              doseNumber: "Series 1",
              doseSeries: 1,
              groupName: "COVID-19",
              manufacturer: null,
              note: "Dose #1 of 2 of COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose vaccine administered.",
              shortDescription: "COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose"
            }
          },
          NOSERIES: {
            id: "NOSERIES",
            type: "immunization",
            attributes: {
              cvxCode: 207,
              date: "2020-12-18T12:24:55Z",
              doseNumber: null,
              doseSeries: null,
              groupName: "COVID-19",
              manufacturer: null,
              note: "Dose #1 of 2 of COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose vaccine administered.",
              shortDescription: "COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose"
            }
          },
        },
        loading: !loaded,
      },
      errors: initialErrorsState,
    })

    act(() => {
      component = renderWithProviders(<VaccineDetailsScreen {...props} />, store)
    })

    testInstance = component.root
  }
  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when showing the vaccine', () => {
    it('should show fields from the vaccine data', async () => {
      initializeTestInstance()
      expect(findByTypeWithText(testInstance, TextView, 'COVID-19 vaccine')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose')).toBeTruthy()
    })

    it('should show a placeholder if there is no series info', async () => {
      initializeTestInstance('NOSERIES')
      expect(findByTypeWithText(testInstance, TextView, 'COVID-19 vaccine')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Unavailable')).toBeTruthy()
    })
  })
})
