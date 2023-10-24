import 'react-native'
import React from 'react'

import { context, render } from 'testUtils'
import { screen, fireEvent } from '@testing-library/react-native'
import NoVaccineRecords from './NoVaccineRecords'
import { Linking } from 'react-native'

context('NoVaccineRecords', () => {
  beforeEach(() => {
    render(<NoVaccineRecords />)
  })

  it('initializes correctly', async () => {
    expect(screen.getByText("We couldn't find information about your VA vaccines")).toBeTruthy()
    expect(screen.getByText("We're sorry. We update your vaccine records every 24 hours, but new records can take up to 36 hours to appear.")).toBeTruthy()
    expect(screen.getByText("If you think your vaccine records should be here, call our MyVA411 main information line. We're here 24/7.")).toBeTruthy()
    expect(screen.getByText('800-698-2411')).toBeTruthy()
    expect(screen.getByText('TTY: 711')).toBeTruthy()
  })

  describe('when the My HealtheVet phone number link is clicked', () => {
    it('should call Linking open url with the parameter tel:8006982411', async () => {
      fireEvent.press(screen.getByText('800-698-2411'))
      expect(Linking.openURL).toBeCalledWith('tel:8006982411')
    })
  })

  describe('when the call TTY phone link is clicked', () => {
    it('should call Linking open url with the parameter tel:711', async () => {
      fireEvent.press(screen.getByText('TTY: 711'))
      expect(Linking.openURL).toBeCalledWith('tel:711')
    })
  })
})
