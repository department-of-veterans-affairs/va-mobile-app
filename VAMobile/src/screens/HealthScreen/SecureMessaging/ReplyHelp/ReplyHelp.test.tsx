import 'react-native'
import React from 'react'

import { screen, fireEvent } from '@testing-library/react-native'
import { context, render } from 'testUtils'
import ReplyHelpScreen from './ReplyHelp'

const mockExternalLinkSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('ReplyHelpScreen', () => {
  beforeEach(() => {
    render(<ReplyHelpScreen />)
  })

  it('initializes correctly', async () => {
    expect(screen.getByText('Only use messages for non-urgent needs')).toBeTruthy()
    expect(screen.getByText('Your care team may take up to 3 business days to reply.')).toBeTruthy()
    expect(screen.getByText('If you need help sooner, use one of these urgent communication options:')).toBeTruthy()
    expect(screen.getByText("If you're in crisis or having thoughts of suicide, connect with our Veterans Crisis Line. We offer confidential support anytime, day or night.")).toBeTruthy()
    expect(screen.getByText('Call 988 and select 1')).toBeTruthy()
    expect(screen.getByText('Text 838255')).toBeTruthy()
    expect(screen.getByText('Start a confidential chat')).toBeTruthy()
    expect(screen.getByText('TTY: 800-799-4889')).toBeTruthy()
    expect(screen.getByText('If you think your life or health is in danger, call 911 or go to the nearest emergency room.')).toBeTruthy()
    expect(screen.getByText('Call 911')).toBeTruthy()
  })

  describe('when the Call 911 link is clicked', () => {
    it('should launch external link', async () => {
      fireEvent.press(screen.getByLabelText('Call 9 1 1'))
      expect(mockExternalLinkSpy).toBeCalledWith('tel:911')
    })
  })
})
