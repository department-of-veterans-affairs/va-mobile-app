import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import NoLabsAndTestsRecords from './NoLabsAndTestsRecords'

context('NoLabsAndTestsRecords', () => {
  const initializeTestInstance = () => {
    return render(<NoLabsAndTestsRecords />)
  }

  it('renders the NoLabsAndTestsRecords component', () => {
    const { getByTestId } = initializeTestInstance()
    expect(getByTestId('NoLabsAndTestsRecords')).toBeTruthy()
  })

  it('displays the correct alert title', () => {
    initializeTestInstance()
    expect(screen.getByText("We couldn't find information about your labs and tests")).toBeTruthy()
  })

  it('displays the correct alert description', () => {
    initializeTestInstance()
    expect(
      screen.getByText(
        "We're sorry. We update your labs and tests records every 24 hours, but new records can take up to 36 hours to appear.",
      ),
    ).toBeTruthy()
    expect(
      screen.getByText(
        "If you think your labs and tests records should be here, call our MyVA411 main information line. We're here 24/7.",
      ),
    ).toBeTruthy()
  })

  it('displays the correct phone number', () => {
    initializeTestInstance()
    expect(screen.getByText('800-698-2411')).toBeTruthy()
  })
})
