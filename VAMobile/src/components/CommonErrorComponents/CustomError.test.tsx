import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'

import CustomError from './CustomError'

const onTryAgainSpy = jest.fn(() => {})

context('ErrorComponent', () => {
  const initializeTestInstance = (errorTitle: string, errorText: string, onTryAgain?: jest.Mock) => {
    render(<CustomError titleText={errorTitle} errorText={errorText} onTryAgain={onTryAgain} />)
  }

  it('initializes correctly with custom error message', () => {
    initializeTestInstance('Custom title', 'Call for help')
    expect(screen.getByText(/Custom title/)).toBeTruthy()
    expect(screen.getByLabelText(/Custom title/)).toBeTruthy()
    expect(screen.getByText(/Call for help/)).toBeTruthy()
    expect(screen.getByLabelText(/Call for help/)).toBeTruthy()
  })

  it('should call onTryAgain if passed in', () => {
    initializeTestInstance('Custom title', 'Call for help or refresh', onTryAgainSpy)
    fireEvent.press(screen.getByRole('button', { name: 'Refresh screen' }))
    expect(onTryAgainSpy).toHaveBeenCalled()
  })
})
