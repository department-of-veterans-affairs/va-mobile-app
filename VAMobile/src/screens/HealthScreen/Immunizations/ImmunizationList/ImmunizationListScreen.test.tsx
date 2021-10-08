import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, findByTypeWithText, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import {initialAuthState, initialErrorsState, initialImmunizationState, initialSecureMessagingState} from 'store'
import { LoadingComponent, TextView, MessagesCountTag } from 'components'
import ImmunizationListScreen from './ImmunizationListScreen'

context('ImmunizationListScreen', () => {
  let component: any
  let props: any
  let store: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (loaded: boolean = true) => {
    props = mockNavProps()

    store = mockStore({
      auth: { ...initialAuthState },
      immunization: {
        ...initialImmunizationState,
        immunizations: [
          {
            id: 'abc',
            vaccineCode:'COVID-19 vaccine',
            recorded: '2021-09-25',
            primarySource: true,
            lotNumber: '205A21A',
            expirationDate: '2030-09-25',
            manufacturer: {
              active: true,
              name: 'Pfizer'
            },
            location: {
              id: '1',
              name: 'Cheyenne VA Medical Center',
              address: {
                type: 'both',
                city: 'Cheyenne',
                state: 'WY',
                postalCode: '82001-5356',
                country: 'US'
              }
            },
            reaction: [{
              date: '2021-09-25',
              reported: true,
              detail: {
                display: 'Lethargy'
              }
            }],
            doseQuantity: {
              text: '0.3ML'
            },
            notes: [],
            protocolApplied: {
              series: 'series x',
              targetDisease: 'COVID-19',
              doseNumber: '2',
              seriesDoses: '2'
            }
          },
          {
            id: 'abc',
            vaccineCode:'Influenza vaccine',
            recorded: '2021-09-25',
            primarySource: true,
            lotNumber: '205A21A',
            expirationDate: '2030-09-25',
            manufacturer: {
              active: true,
              name: 'Pfizer'
            },
            location: {
              id: '1',
              name: 'Cheyenne VA Medical Center',
              address: {
                type: 'both',
                city: 'Cheyenne',
                state: 'WY',
                postalCode: '82001-5356',
                country: 'US'
              }
            },
            reaction: [{
              date: '2021-09-25',
              reported: true,
              detail: {
                display: 'Lethargy'
              }
            }],
            doseQuantity: {
              text: '0.3ML'
            },
            notes: [],
            protocolApplied: {
              series: 'series x',
              targetDisease: 'Influenza',
              doseNumber: '2',
              seriesDoses: '2'
            }
          },
        ],
        loading: !loaded,
      },
      errors: initialErrorsState,
    })

    act(() => {
      component = renderWithProviders(<ImmunizationListScreen {...props} />, store)
    })

    testInstance = component.root
  }
  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(false)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when showing the list', () => {
    it('should show the correct list items', async () => {
      initializeTestInstance()
      expect(findByTypeWithText(testInstance, TextView, 'COVID-19 vaccine')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'Influenza vaccine')).toBeTruthy()
    })
  })
})
