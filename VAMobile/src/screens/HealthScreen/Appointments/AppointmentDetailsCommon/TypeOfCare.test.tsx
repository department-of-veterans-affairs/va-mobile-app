import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'

import TypeOfCare from './TypeOfCare'

context('TypeOfCare', () => {
  const initializeTestInstance = (phoneOnly = false, typeOfCare?: string): void => {
    const props = {
      ...defaultAppointmentAttributes,
      phoneOnly: phoneOnly,
      typeOfCare: typeOfCare,
    }

    render(<TypeOfCare attributes={props} />)
  }

  it('When a appointment with no type of care or healthcare service noted it should render correctly', () => {
    initializeTestInstance(true)
    expect(screen.getByRole('header', { name: 'Type of care not noted' })).toBeTruthy()
  })

  it('When a appointment with a type of care noted it should render correctly', () => {
    initializeTestInstance(true, 'phone consultation')
    expect(screen.getByRole('header', { name: 'phone consultation' })).toBeTruthy()
  })
})
