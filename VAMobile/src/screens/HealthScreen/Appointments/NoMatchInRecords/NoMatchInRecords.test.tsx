import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import NoMatchInRecords from './NoMatchInRecords'

context('NoMatchInRecords', () => {
  it('initializes correctly', () => {
    render(<NoMatchInRecords />)
    expect(screen.getByText("We couldn't match your information to our VA patient records")).toBeTruthy()
    expect(screen.getByText("We're sorry. We couldn't find a match for you in our VA patient records.")).toBeTruthy()
    expect(screen.getByText('What you can do')).toBeTruthy()
    expect(screen.getByText("If you're currently registered as a patient at a VA health facility")).toBeTruthy()
    expect(
      screen.getByText(
        "If you're enrolled in VA health care, but not currently registered as a patient at a VA health facility",
      ),
    ).toBeTruthy()
    expect(
      screen.getByText("If you're not enrolled in VA health care or you don't know if you're enrolled"),
    ).toBeTruthy()
  })
})
