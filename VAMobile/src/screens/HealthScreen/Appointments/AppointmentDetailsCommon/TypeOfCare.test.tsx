import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import TypeOfCare from './TypeOfCare'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'

context('TypeOfCare', () => {
  const initializeTestInstance = (phoneOnly = false, typeOfCare?: string): void => {
    let props = {
      ...defaultAppointmentAttributes,
      phoneOnly: phoneOnly,
      typeOfCare: typeOfCare,
    }

    render(<TypeOfCare attributes={props} />)
  }

  it('When not a phone appointment it should render correctly', () => {
    initializeTestInstance()
    expect(screen.queryByRole('header', { name: 'Type of care not noted' })).toBeFalsy()
  })

  it('When a phone appointment with no type of care noted it should render correctly', () => {
    initializeTestInstance(true)
    expect(screen.getByRole('header', { name: 'Type of care not noted' })).toBeTruthy()
  })

  it('When a phone appointment with a type of care noted it should render correctly', () => {
    initializeTestInstance(true, 'phone consultation')
    expect(screen.getByRole('header', { name: 'phone consultation' })).toBeTruthy()
  })
})
