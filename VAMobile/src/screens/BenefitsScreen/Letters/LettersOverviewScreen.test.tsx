import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import { LettersOverviewScreen } from './index'
import { profileAddressOptions } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'

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

  it('initializes correctly and should go to edit address when the address is pressed', async () => {
    expect(screen.getByText('Downloaded documents will list your address as:')).toBeTruthy()
    expect(screen.getByText('If this address is incorrect you may want to update it, but your letter will still be valid even with the incorrect address.')).toBeTruthy()
    expect(screen.getByText('Review letters')).toBeTruthy()
    fireEvent.press(screen.getByText('Mailing address'))
    expect(mockNavigationSpy).toHaveBeenCalledWith('EditAddress', { displayTitle: 'Mailing address', addressType: profileAddressOptions.MAILING_ADDRESS })
  })
})
