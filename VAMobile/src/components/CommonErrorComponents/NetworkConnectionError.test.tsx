import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'

import NetworkConnectionError from './NetworkConnectionError'

context('NetworkConnectionError', () => {
  const onTryAgainPressSpy = jest.fn()

  beforeEach(() => {
    render(<NetworkConnectionError onTryAgain={onTryAgainPressSpy} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    expect(
      screen.getByText("You aren't connected to the internet. Check your internet connection and try again."),
    ).toBeTruthy()
    expect(screen.getByRole('header', { name: "The app can't be loaded." })).toBeTruthy()
  })

  it('should call onTryAgain', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Refresh screen' }))
    expect(onTryAgainPressSpy).toHaveBeenCalled()
  })
})
