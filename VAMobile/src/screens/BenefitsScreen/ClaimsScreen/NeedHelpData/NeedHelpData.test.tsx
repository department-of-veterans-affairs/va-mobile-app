import React from 'react'
import { Alert, Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import NeedHelpData from './NeedHelpData'

context('NeedHelpData', () => {
  const initializeTestInstance = (isAppeal?: boolean) => {
    render(<NeedHelpData isAppeal={isAppeal} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('Renders NeedHelpData', () => {
    expect(screen.getByText('Need help?')).toBeTruthy()
    expect(
      screen.getByText('Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.'),
    ).toBeTruthy()
    expect(screen.getByText('800-827-1000')).toBeTruthy()
    expect(screen.queryByText('To review more details about your appeal, go to VA.gov.')).toBeFalsy()
    expect(screen.queryByText('Go to VA.gov')).toBeFalsy()
    initializeTestInstance(true)
    expect(screen.getByText('To review more details about your appeal, go to VA.gov.')).toBeTruthy()
    expect(screen.getByText('Go to VA.gov')).toBeTruthy()
  })

  it('should launch external link on click of the number', () => {
    fireEvent.press(screen.getByRole('link', { name: '800-827-1000' }))
    expect(Linking.openURL).toHaveBeenCalledWith('tel:8008271000')
  })

  describe('when isAppeal is true', () => {
    it('should launch external link on click of the url', () => {
      initializeTestInstance(true)
      fireEvent.press(screen.getByRole('link', { name: 'Go to VA.gov' }))
      expect(Alert.alert).toHaveBeenCalled()
    })
  })
})
