import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import ReplyHelpScreen from './ReplyHelp'

context('ReplyHelpScreen', () => {
  beforeEach(() => {
    render(<ReplyHelpScreen />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: 'Only use messages for non-urgent needs' })).toBeTruthy()
    expect(screen.getByText('Your care team may take up to 3 business days to reply.')).toBeTruthy()
    expect(screen.getByText('If you need help sooner, use one of these urgent communication options:')).toBeTruthy()
    expect(
      screen.getByText(
        "If you're in crisis or having thoughts of suicide, connect with our Veterans Crisis Line. We offer confidential support anytime, day or night.",
      ),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Call 988 and select 1' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Text 838255' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Start a confidential chat' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 800-799-4889' })).toBeTruthy()
    expect(
      screen.getByText('If you think your life or health is in danger, call 911 or go to the nearest emergency room.'),
    ).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Call 911' })).toBeTruthy()
  })

  describe('when the Call 911 link is clicked', () => {
    it('should launch external link', () => {
      fireEvent.press(screen.getByRole('link', { name: 'Call 911' }))
      expect(Linking.openURL).toBeCalledWith('tel:911')
    })
  })
})
