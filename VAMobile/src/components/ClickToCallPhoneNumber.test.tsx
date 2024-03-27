import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { AppointmentPhone } from 'api/types'
import { ClickToCallPhoneNumber } from 'components'
import { context, render } from 'testUtils'

context('ClickToCallPhoneNumber', () => {
  const renderWithProps = (phone?: AppointmentPhone) => {
    render(<ClickToCallPhoneNumber phone={phone} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    renderWithProps({ areaCode: '123', number: '456-7890', extension: '12' })
  })

  it('renders phone and TTY links', () => {
    expect(screen.getByRole('link', { name: '123-456-7890' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 711' })).toBeTruthy()
  })

  it('renders phone and TTY a11yLabels', () => {
    expect(screen.getByLabelText('1 2 3 4 5 6 7 8 9 0')).toBeTruthy()
    expect(screen.getByLabelText('TTY: 7 1 1')).toBeTruthy()
  })

  it('opens URL on phone number click', () => {
    fireEvent.press(screen.getByRole('link', { name: '123-456-7890' }))
    expect(Linking.openURL).toBeCalledWith('tel:1234567890')
  })

  it('opens URL on TTY click', () => {
    fireEvent.press(screen.getByRole('link', { name: 'TTY: 711' }))
    expect(Linking.openURL).toBeCalledWith('tel:711')
  })

  it('does not render links when props are absent', () => {
    renderWithProps()
    expect(screen.queryByRole('link')).toBeFalsy()
  })
})
