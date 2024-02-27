import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { profileAddressOptions } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import { context, mockNavProps, render } from 'testUtils'

import { LettersOverviewScreen } from './index'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const actual = jest.requireActual('utils/hooks')
  return {
    ...actual,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const authorizedServicesMockData = { lettersAndDocuments: true }
jest.mock('../../../api/authorizedServices/getAuthorizedServices', () => {
  const original = jest.requireActual('../../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest.fn().mockReturnValue({
      status: 'success',
      data: authorizedServicesMockData,
    }),
  }
})

context('LettersOverviewScreen', () => {
  const initializeTestInstance = (isAuthorized = true) => {
    authorizedServicesMockData.lettersAndDocuments = isAuthorized
    render(<LettersOverviewScreen {...mockNavProps()} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByText('Downloaded documents will list your address as:')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Mailing address Add your mailing address' })).toBeTruthy()
    expect(
      screen.getByText(
        'If this address is incorrect you may want to update it, but your letter will still be valid even with the incorrect address.',
      ),
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Review letters' })).toBeTruthy()
  })

  it('should go to edit address when the address is pressed', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Mailing address Add your mailing address' }))
    expect(mockNavigationSpy).toHaveBeenCalledWith('EditAddress', {
      displayTitle: 'Mailing address',
      addressType: profileAddressOptions.MAILING_ADDRESS,
    })
  })

  it('should go to letters list screen when Review letters is pressed', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Review letters' }))
    expect(mockNavigationSpy).toHaveBeenCalledWith('LettersList')
  })

  it('should show No Letters screen when service is not authorized', () => {
    initializeTestInstance(false)
    expect(screen.getByRole('header', { name: "We couldn't find information about your VA letters" })).toBeTruthy()
  })
})
