import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import ActivityButton from './ActivityButton'

context('ActivityButton', () => {
  beforeEach(() => {
    render(<ActivityButton title={'Claims'} subText={'5 active'} deepLink={'claims'} />)
  })

  it('renders title and subtext', () => {
    expect(screen.getByRole('button', { name: 'Claims' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '5 active' })).toBeTruthy()
  })

  it('navigates to deep link when tapped', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Claims' }))
    expect(Linking.openURL).toBeCalledWith('vamobile://claims')
  })
})
