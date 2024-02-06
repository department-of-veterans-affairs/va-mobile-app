import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import NoMilitaryInformationAccess from './NoMilitaryInformationAccess'

context('NoMilitaryInformationAccess', () => {
  it('should render text fields correctly', () => {
    render(<NoMilitaryInformationAccess />)
    expect(screen.getByRole('header', { name: "We can't access your military information" })).toBeTruthy()
    expect(
      screen.getByText(
        "We're sorry. We can't access your military service records. If you think you should be able to review your service information here, please file a request to change or correct your DD214 or other military records.",
      ),
    ).toBeTruthy()
  })
})
