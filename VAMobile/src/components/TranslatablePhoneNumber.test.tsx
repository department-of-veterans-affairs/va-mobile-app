import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { TranslatablePhoneNumber } from 'components'
import { context, render } from 'testUtils'

context('TranslatablePhoneNumber', () => {
  it('renders phone number and handles click for inline variant', () => {
    render(<TranslatablePhoneNumber variant="inline">{['123-456-7890']}</TranslatablePhoneNumber>)
    const phoneNumber = screen.getByText('123-456-7890')
    fireEvent.press(phoneNumber)
    expect(Linking.openURL).toBeCalledWith('tel:1234567890')
  })

  it('renders phone number and handles clicks for standalone variant with TTY', () => {
    render(<TranslatablePhoneNumber variant="standalone">{['123-456-7890']}</TranslatablePhoneNumber>)
    const phoneNumber = screen.getByText('123-456-7890')
    fireEvent.press(phoneNumber)
    expect(Linking.openURL).toBeCalledWith('tel:1234567890')
    const ttyNumber = screen.getByText('TTY: 711')
    fireEvent.press(ttyNumber)
    expect(Linking.openURL).toBeCalledWith('tel:711')
  })

  it('renders phone number and handles click for standalone variant without TTY', () => {
    render(
      <TranslatablePhoneNumber variant="standalone" ttyBypass={true}>
        {['123-456-7890']}
      </TranslatablePhoneNumber>,
    )
    const phoneNumber = screen.getByText('123-456-7890')
    fireEvent.press(phoneNumber)
    expect(Linking.openURL).toBeCalledWith('tel:1234567890')
    expect(screen.getByText('TTY: 711')).toBeFalsy()
  })
})
