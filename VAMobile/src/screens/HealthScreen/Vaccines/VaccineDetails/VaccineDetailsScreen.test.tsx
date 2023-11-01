import 'react-native'
import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import { initialVaccineState } from 'store/slices'
import VaccineDetailsScreen from './VaccineDetailsScreen'

context('VaccineDetailsScreen', () => {

  const initializeTestInstance = (vId: string = 'N7A6Q5AU6W5C6O4O7QEDZ3SJXM000000', loaded: boolean = true) => {
    const props = mockNavProps(undefined, undefined, { params: { vaccineId: vId } })
    render(<VaccineDetailsScreen {...props} />, {
      preloadedState: {
        vaccine: {
          ...initialVaccineState,
          vaccinesById: {
            N7A6Q5AU6W5C6O4O7QEDZ3SJXM000000: {
              id: 'N7A6Q5AU6W5C6O4O7QEDZ3SJXM000000',
              type: 'immunization',
              attributes: {
                cvxCode: 207,
                date: '2020-12-18T12:24:55Z',
                doseNumber: 'Series 1',
                doseSeries: 1,
                groupName: 'COVID-19',
                reaction: 'Fever',
                manufacturer: 'Janssen',
                note: 'Dose #1 of 2 of COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose vaccine administered.',
                shortDescription: 'COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose',
              },
            },
            NONOTE: {
              id: 'NONOTE',
              type: 'immunization',
              attributes: {
                cvxCode: 207,
                date: '2020-12-18T12:24:55Z',
                doseNumber: null,
                doseSeries: null,
                groupName: 'COVID-19',
                manufacturer: null,
                note: null,
                shortDescription: 'COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose',
              },
            },
            HASLOCATION: {
              id: 'HASLOCATION',
              type: 'immunization',
              attributes: {
                cvxCode: 207,
                date: '2020-12-18T12:24:55Z',
                doseNumber: null,
                doseSeries: null,
                groupName: 'COVID-19',
                manufacturer: null,
                note: null,
                shortDescription: 'COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose',
              },
              relationships: {
                location: {
                  data: {
                    id: 'location1',
                    type: 'location',
                  },
                },
              },
            },
          },
          vaccineLocationsById: {
            HASLOCATION: {
              id: 'location1',
              type: 'location',
              attributes: {
                name: 'facility 1',
                address: {
                  street: '123 abc street',
                  city: 'Tiburon',
                  state: 'CA',
                  zipCode: '94920',
                },
              },
            },
          },
          loading: !loaded,
        },
      },
    })
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByText('December 18, 2020')).toBeTruthy()
    expect(screen.getByText('COVID-19 vaccine')).toBeTruthy()
    expect(screen.getByText('Type and dosage')).toBeTruthy()
    expect(screen.getByText('COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose')).toBeTruthy()
    expect(screen.getByText('Janssen')).toBeTruthy()
    expect(screen.getByText('Series status')).toBeTruthy()
    expect(screen.getByText('Series 1 of 1')).toBeTruthy()
    expect(screen.getByText('Provider')).toBeTruthy()
    expect(screen.getByText('None noted')).toBeTruthy()
    expect(screen.getByText('Reaction')).toBeTruthy()
    expect(screen.getByText('Notes')).toBeTruthy()
    expect(screen.getByText('Dose #1 of 2 of COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose vaccine administered.')).toBeTruthy()
    expect(screen.getByText('We base this information on your current VA health records. If you have any questions, contact your health care team.')).toBeTruthy()
    expect(screen.queryByText('facility 1')).toBeFalsy()
    expect(screen.queryByText('123 abc street')).toBeFalsy()
    expect(screen.queryByText('Tiburon, CA 94920')).toBeFalsy()

    initializeTestInstance('HASLOCATION')
    expect(screen.getByText('facility 1')).toBeTruthy()
    expect(screen.getByText('123 abc street')).toBeTruthy()
    expect(screen.getByText('Tiburon, CA 94920')).toBeTruthy()
  })
})
