import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'

import CallHelpCenter from './CallHelpCenter'

const onTryAgainSpy = jest.fn(() => {})

context('ErrorComponent', () => {
  const initializeTestInstance = (errorText?: string, onTryAgain?: jest.Mock) => {
    render(<CallHelpCenter errorText={errorText} errorA11y={errorText} onTryAgain={onTryAgain} />)
  }

  it('initializes correctly with default error message', () => {
    initializeTestInstance()
    expect(screen.getByText(/call our MyVA411 main information line/)).toBeTruthy()
    expect(screen.getByLabelText(/call our My V-A 4 1 1 main information line/)).toBeTruthy()
  })

  it('initializes correctly with custom error message', () => {
    initializeTestInstance('Call for help')
    expect(screen.getByText(/Call for help/)).toBeTruthy()
    expect(screen.getByLabelText(/Call for help/)).toBeTruthy()
  })

  it('should call onTryAgain if passed in', () => {
    initializeTestInstance(undefined, onTryAgainSpy)
    fireEvent.press(screen.getByRole('button', { name: 'Refresh screen' }))
    expect(onTryAgainSpy).toHaveBeenCalled()
  })
})
