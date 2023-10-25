import 'react-native'
import React from 'react'

import { screen, fireEvent } from '@testing-library/react-native'
import { context, mockNavProps, render } from 'testUtils'
import { LettersOverviewScreen } from './index'
import { profileAddressOptions } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import { when } from 'jest-when'

let mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('LettersOverviewScreen', () => {
  let mockNavigateToSpy: jest.Mock

  const initializeTestInstance = () => {
    mockNavigateToSpy = jest.fn()
    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('EditAddress', { displayTitle: 'Mailing address', addressType: profileAddressOptions.MAILING_ADDRESS })
      .mockReturnValue(mockNavigateToSpy)
      .calledWith('LettersList')
      .mockReturnValue(mockNavigateToSpy)

    const props = mockNavProps()
    render(<LettersOverviewScreen {...props} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(screen.getByText('Downloaded documents will list your address as:')).toBeTruthy()
    expect(screen.getByTestId('Mailing address Add your mailing address')).toBeTruthy()
    expect(screen.getByText('If this address is incorrect you may want to update it, but your letter will still be valid even with the incorrect address.')).toBeTruthy()
    expect(screen.getByText('Review letters')).toBeTruthy()
  })

  it('should go to edit address when the address is pressed', async () => {
    fireEvent.press(screen.getByTestId('Mailing address Add your mailing address'))
    expect(mockNavigateToSpy).toHaveBeenCalled()
  })
  it('should go to letters list screen when Review letters is pressed', async () => {
    fireEvent.press(screen.getByText('Review letters'))
    expect(mockNavigateToSpy).toHaveBeenCalled()
  })
})
