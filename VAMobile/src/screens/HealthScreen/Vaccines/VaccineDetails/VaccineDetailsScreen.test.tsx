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
              reaction: "Fever",
              manufacturer: null,
              note: "Dose #1 of 2 of COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose vaccine administered.",
              shortDescription: "COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose"
            }
          },
          NONOTE: {
            id: "NONOTE",
            type: "immunization",
            attributes: {
              cvxCode: 207,
              date: "2020-12-18T12:24:55Z",
              doseNumber: null,
              doseSeries: null,
              groupName: "COVID-19",
              manufacturer: null,
              note: null,
              shortDescription: "COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose"
            }
          },
          HASLOCATION: {
            id: "HASLOCATION",
            type: "immunization",
            attributes: {
              cvxCode: 207,
              date: "2020-12-18T12:24:55Z",
              doseNumber: null,
              doseSeries: null,
              groupName: "COVID-19",
              manufacturer: null,
              note: null,
              shortDescription: "COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose"
            },
            relationships: {
              location: {
                data: {
                  id: "location1",
                  type: "location"
                },
              }
            }
          },
        },
        vaccineLocationsById: {
          HASLOCATION: {
            id: "location1",
            type: "location",
            attributes: {
              name: "facility 1",
              address: {
                street: "123 abc street",
                city: "Tiburon",
                state: "CA",
                zipCode: "94920"
              }
            }
          }
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

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(component).toBeTruthy()
  })

  describe('when showing the vaccine', () => {
    it('should show fields from the vaccine data', async () => {
      initializeTestInstance()
      expect(findByTypeWithText(testInstance, TextView, 'COVID-19 vaccine')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Fever')).toBeTruthy()
    })

    it('should show show location data', async () => {
      initializeTestInstance('HASLOCATION')
      expect(findByTypeWithText(testInstance, TextView, 'facility 1')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, '123 abc street')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Tiburon, CA 94920')).toBeTruthy()
    })
  })
})
