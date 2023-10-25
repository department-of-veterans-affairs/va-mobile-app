import 'react-native'
import React from 'react'

import { screen, fireEvent } from '@testing-library/react-native'
import { context, render } from 'testUtils'
import IndividualMessageErrorComponent from './IndividualMessageErrorComponent'
import { Linking } from 'react-native'

context('IndividualMessageErrorComponent', () => {
  beforeEach(() => {
    render(<IndividualMessageErrorComponent />)
  })

  it('initializes correctly', async () => {
    expect(screen.getByText('Message could not be found')).toBeTruthy()
    expect(screen.getByText("We're sorry. Something went wrong on our end. Please refresh this screen or try again later.")).toBeTruthy()
    expect(screen.getByText("If the app still doesn't work, call the My HealtheVet Help Desk. We're here Monday-Friday, 8:00 a.m.-8:00 p.m. ET.")).toBeTruthy()
    expect(screen.getByText('877-327-0022')).toBeTruthy()
    expect(screen.getByText('TTY: 711')).toBeTruthy()
    expect(screen.getByText('Refresh screen')).toBeTruthy()
  })

  describe('when the My HealtheVet phone number link is clicked', () => {
    it('should call Linking open url with the parameter tel:8773270022', async () => {
      fireEvent.press(screen.getByText('877-327-0022'))
      expect(Linking.openURL).toBeCalledWith('tel:8773270022')
    })
  })
  describe('when the call TTY phone link is clicked', () => {
    it('should call Linking open url with the parameter tel:711', async () => {
      fireEvent.press(screen.getByText('TTY: 711'))
      expect(Linking.openURL).toBeCalledWith('tel:711')
    })
  })
})
