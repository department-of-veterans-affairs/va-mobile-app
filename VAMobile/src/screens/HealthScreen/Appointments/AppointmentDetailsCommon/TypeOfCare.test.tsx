import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'

import TypeOfCare from './TypeOfCare'

context('TypeOfCare', () => {
  const initializeTestInstance = (phoneOnly = false, typeOfCare?: string, healthcareService?: string): void => {
    const props = {
      ...defaultAppointmentAttributes,
      healthcareService: healthcareService,
      phoneOnly: phoneOnly,
      typeOfCare: typeOfCare,
    }

    render(<TypeOfCare attributes={props} />)
  }

  it('When a appointment with no type of care noted it should render correctly', () => {
    initializeTestInstance(true, undefined, 'phone consult')
    expect(screen.getByRole('header', { name: 'phone consult' })).toBeTruthy()
  })

  it('When a appointment with no type of care or healthcare service noted it should render correctly', () => {
    initializeTestInstance(true)
    expect(screen.getByRole('header', { name: 'Type of care not noted' })).toBeTruthy()
  })

  it('When a appointment with a type of care noted it should render correctly', () => {
    initializeTestInstance(true, 'phone consultation')
    expect(screen.getByRole('header', { name: 'phone consultation' })).toBeTruthy()
  })
})
