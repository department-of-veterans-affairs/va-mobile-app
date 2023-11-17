import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import { LettersOverviewScreen } from './index'

let mockNavigationSpy = jest.fn()
jest.mock('@react-navigation/native', () => {
  let actual = jest.requireActual('@react-navigation/native')
  return {
    ...actual,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('LettersOverviewScreen', () => {
  const initializeTestInstance = () => {
    const props = mockNavProps()
    render(<LettersOverviewScreen {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByText('Downloaded documents will list your address as:')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Mailing address Add your mailing address' })).toBeTruthy()
    expect(screen.getByText('If this address is incorrect you may want to update it, but your letter will still be valid even with the incorrect address.')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Review letters' })).toBeTruthy()
  })

  it('should go to edit address when the address is pressed', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Mailing address Add your mailing address' }))
    expect(mockNavigationSpy).toHaveBeenCalled()
  })
  it('should go to letters list screen when Review letters is pressed', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Review letters' }))
    expect(mockNavigationSpy).toHaveBeenCalled()
  })
})
