import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import IndividualMessageErrorComponent from './IndividualMessageErrorComponent'

context('IndividualMessageErrorComponent', () => {
  beforeEach(() => {
    render(<IndividualMessageErrorComponent />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText('Message could not be found')).toBeTruthy()
    expect(
      screen.getByText("We're sorry. Something went wrong on our end. Please refresh this screen or try again later."),
    ).toBeTruthy()
    expect(
      screen.getByText(
        "If the app still doesn't work, call the My HealtheVet Help Desk. We're here Monday-Friday, 8:00 a.m.-8:00 p.m. ET.",
      ),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: '877-327-0022' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Refresh screen' })).toBeTruthy()
  })

  describe('when the My HealtheVet phone number link is clicked', () => {
    it('should call Linking open url with the parameter tel:8773270022', () => {
      fireEvent.press(screen.getByRole('link', { name: '877-327-0022' }))
      expect(Linking.openURL).toBeCalledWith('tel:8773270022')
    })
  })
  describe('when the call TTY phone link is clicked', () => {
    it('should call Linking open url with the parameter tel:711', () => {
      fireEvent.press(screen.getByRole('link', { name: 'TTY: 711' }))
      expect(Linking.openURL).toBeCalledWith('tel:711')
    })
  })
})
