import React from 'react'

import { screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { Vaccine } from 'api/types'
import VaccineDetailsScreen from 'screens/HealthScreen/Vaccines/VaccineDetails/VaccineDetailsScreen'
import { context, mockNavProps, render } from 'testUtils'

context('VaccineDetailsScreen', () => {
  const defaultVaccine = {
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
  }

  const location = {
    data: {
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
  }

  const hasLocationVaccine = {
    id: 'HASLOCATION',
    type: 'immunization',
    attributes: {
      cvxCode: 207,
      date: '2020-12-18T12:24:55Z',
      doseNumber: null,
      doseSeries: null,
      groupName: 'COVID-19',
      location: 'facility 1',
      manufacturer: null,
      note: null,
      shortDescription: 'COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose',
    },
    relationships: {
      location: location,
    },
  }

  const nullLocationVaccine = {
    id: 'NULLLOCATION',
    type: 'immunization',
    attributes: {
      cvxCode: 207,
      date: '2020-12-18T12:24:55Z',
      doseNumber: null,
      doseSeries: null,
      groupName: 'COVID-19',
      location: null,
      manufacturer: null,
      note: null,
      shortDescription: 'COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose',
    },
  }

  const missingDataVaccine = {
    id: 'HASLOCATION',
    type: 'immunization',
    attributes: {
      cvxCode: 207,
      date: '',
      doseNumber: null,
      doseSeries: null,
      groupName: null,
      location: 'facility 1',
      manufacturer: null,
      note: null,
      shortDescription: 'COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose',
    },
  }

  const initializeTestInstance = (vaccine: Vaccine = defaultVaccine) => {
    const props = mockNavProps(undefined, undefined, { params: { vaccine: vaccine } })
    render(<VaccineDetailsScreen {...props} />)
  }

  it('initializes correctly for default vaccine', () => {
    initializeTestInstance()
    expect(screen.getByText('December 18, 2020')).toBeTruthy()
    expect(screen.getByRole('header', { name: 'COVID-19 vaccine' })).toBeTruthy()
    expect(screen.getByText('Type and dosage')).toBeTruthy()
    expect(screen.getByText('COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose')).toBeTruthy()
    expect(screen.getByText('Janssen')).toBeTruthy()
    expect(screen.getByText('Series status')).toBeTruthy()
    expect(screen.getByText('Series 1 of 1')).toBeTruthy()
    expect(screen.getByText('Provider')).toBeTruthy()
    expect(screen.getByText('None noted')).toBeTruthy()
    expect(screen.getByText('Reactions')).toBeTruthy()
    expect(screen.getByText('Notes')).toBeTruthy()
    expect(
      screen.getByText('Dose #1 of 2 of COVID-19, mRNA, LNP-S, PF, 100 mcg/ 0.5 mL dose vaccine administered.'),
    ).toBeTruthy()
    expect(screen.getByText(t('health.details.weBaseThis'))).toBeTruthy()
    expect(screen.queryByText('facility 1')).toBeFalsy()
  })

  it('initializes correctly for has location vaccine', () => {
    initializeTestInstance(hasLocationVaccine)
    expect(screen.getByText('facility 1')).toBeTruthy()
  })

  it('should not display location when location is null', () => {
    initializeTestInstance(nullLocationVaccine)
    expect(screen.getByRole('header', { name: 'COVID-19 vaccine' })).toBeTruthy()
    expect(screen.getByText('Provider')).toBeTruthy()
    expect(screen.queryByText('facility 1')).toBeFalsy()
  })

  it('should show alert that vaccine has missing information', () => {
    initializeTestInstance(missingDataVaccine)

    expect(screen.getByText(t('vaccines.missingDetails.header'))).toBeTruthy()
    expect(screen.getByText(t('vaccines.missingDetails.description'))).toBeTruthy()
  })

  it('should show vaccine with missing name and date', () => {
    initializeTestInstance(missingDataVaccine)

    expect(screen.getByText(t('vaccine'))).toBeTruthy()
    expect(screen.getByText(t('vaccines.noDate'))).toBeTruthy()
  })
})
