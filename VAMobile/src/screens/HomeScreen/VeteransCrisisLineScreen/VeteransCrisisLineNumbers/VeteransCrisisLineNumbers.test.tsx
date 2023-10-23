import 'react-native'
import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { context, render } from 'testUtils'
import VeteransCrisisLineNumbers from './VeteransCrisisLineNumbers'

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('VeteransCrisisLineNumbers', () => {
  beforeEach(() => {
    render(<VeteransCrisisLineNumbers />)
  })

  it('initializes correctly', async () => {
    expect(screen.getByText('Call 988 and select 1')).toBeTruthy()
    expect(screen.getByText('Text 838255')).toBeTruthy()
    expect(screen.getByText('Start a confidential chat')).toBeTruthy()
    expect(screen.getByText('TTY: 800-799-4889')).toBeTruthy()
  })

  describe('when the call number and press 1 link is clicked', () => {
    it('should launch external link with the parameter tel:988', async () => {
      fireEvent.press(screen.getByLabelText('Call 9 8 8 and select 1'))
      expect(mockExternalLinkSpy).toBeCalledWith('tel:988')
    })
  })

  describe('when the text 838255 link is clicked', () => {
    it('should launch external link with the parameter sms:838255', async () => {
      fireEvent.press(screen.getByLabelText('text 8 3 8 2 5 5'))
      expect(mockExternalLinkSpy).toBeCalledWith('sms:838255')
    })
  })

  describe('when the start confidential chat link is clicked', () => {
    it('should launch external link with the parameter https://www.veteranscrisisline.net/get-help/chat', async () => {
      fireEvent.press(screen.getByLabelText('Start a confidential chat'))
      expect(mockExternalLinkSpy).toBeCalledWith('https://www.veteranscrisisline.net/get-help/chat')
    })
  })
  describe('when the 800-799-4889 link is clicked', () => {
    it('should launch external link with the parameter tel:8007994889', async () => {
      fireEvent.press(screen.getByLabelText('TTY: 800-799-4889'))
      expect(mockExternalLinkSpy).toBeCalledWith('tel:8007994889')
    })
  })
})
