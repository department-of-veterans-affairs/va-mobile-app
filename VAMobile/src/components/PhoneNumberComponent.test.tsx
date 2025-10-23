import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import PhoneNumberComponent from 'components/PhoneNumberComponent'
import { context, render } from 'testUtils'

context('PhoneNumberComponent', () => {
  it('renders phone number and handles click for inline variant', () => {
    render(<PhoneNumberComponent variant="inline">{['123-456-7890']}</PhoneNumberComponent>)
    const phoneNumber = screen.getByText('123-456-7890')
    fireEvent.press(phoneNumber)
    expect(Linking.openURL).toBeCalledWith('tel:1234567890')
  })

  it('renders phone number and handles clicks for standalone variant with TTY', () => {
    render(<PhoneNumberComponent variant="standalone">{['123-456-7890']}</PhoneNumberComponent>)
    const phoneNumber = screen.getByText('123-456-7890')
    fireEvent.press(phoneNumber)
    expect(Linking.openURL).toBeCalledWith('tel:1234567890')
    const ttyNumber = screen.getByText('TTY: 711')
    fireEvent.press(ttyNumber)
    expect(Linking.openURL).toBeCalledWith('tel:711')
  })

  it('renders phone number and handles click for standalone variant without TTY', () => {
    render(
      <PhoneNumberComponent variant="standalone" ttyBypass={true}>
        {['123-456-7890']}
      </PhoneNumberComponent>,
    )
    const phoneNumber = screen.getByText('123-456-7890')
    fireEvent.press(phoneNumber)
    expect(Linking.openURL).toBeCalledWith('tel:1234567890')
    expect(screen.queryByText('TTY: 711')).toBeNull()
  })
})
