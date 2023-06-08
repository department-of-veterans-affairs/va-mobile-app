import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import * as api from 'store/api'
import { context, findByTypeWithText, mockNavProps, render, RenderAPI, when } from 'testUtils'
import { initialAuthState, initialErrorsState, initialVaccineState } from 'store/slices'
import { LoadingComponent, TextView } from 'components'
import VaccineListScreen from './VaccineListScreen'
import { waitFor } from '@testing-library/react-native'

context('VaccineListScreen', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  const vaccineData: api.VaccineList = [
    {
      id: 'I2-A7XD2XUPAZQ5H4Y5D6HJ352GEQ000000',
      type: 'immunization',
      attributes: {
        cvxCode: 140,
        date: '2009-03-19T12:24:55Z',
        doseNumber: 'Booster',
        doseSeries: 1,
        groupName: 'FLU',
        manufacturer: null,
        note: 'Dose #45 of 101 of Influenza  seasonal  injectable  preservative free vaccine administered.',
        shortDescription: 'Influenza  seasonal  injectable  preservative free',
      },
    },
    {
      id: 'I2-N7A6Q5AU6W5C6O4O7QEDZ3SJXM000000',
      type: 'immunization',
      attributes: {
        cvxCode: 207,
        date: '2020-12-18T12:24:55Z',
        doseNumber: null,
        doseSeries: null,
        groupName: 'COVID-19',
        manufacturer: null,
        note: 'Dose #1 of 2 of COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose vaccine administered.',
        shortDescription: 'COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose',
      },
    },
  ]

  const initializeTestInstance = (loaded: boolean = true, noVaccines: boolean = false) => {
    props = mockNavProps()

    component = render(<VaccineListScreen {...props} />, {
      preloadedState: {
        auth: { ...initialAuthState },
        vaccine: {
          ...initialVaccineState,
          loading: !loaded,
        },
        errors: initialErrorsState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  it('initializes correctly', async () => {
    await waitFor(() => {
      initializeTestInstance()
      expect(component).toBeTruthy()
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      await waitFor(() => {
        initializeTestInstance(false)
        expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
      })
    })
  })

  describe('when showing the list', () => {
    it('should show the correct list items', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v1/health/immunizations', expect.anything())
        .mockResolvedValue({ data: vaccineData })

      await waitFor(() => {
        initializeTestInstance()
      })

      expect(findByTypeWithText(testInstance, TextView, 'COVID-19 vaccine')).toBeTruthy()
      expect(findByTypeWithText(testInstance, TextView, 'FLU vaccine')).toBeTruthy()
    })
  })

  describe('when there are no vaccines', () => {
    it('should show no Vaccine Records', async () => {
      when(api.get as jest.Mock)
        .calledWith('/v1/health/immunizations', expect.anything())
        .mockResolvedValue({ data: [] })

      await waitFor(() => {
        initializeTestInstance(true, true)
      })

      expect(findByTypeWithText(testInstance, TextView, "We couldn't find information about your V\ufeffA vaccines")).toBeTruthy()
    })
  })
})
