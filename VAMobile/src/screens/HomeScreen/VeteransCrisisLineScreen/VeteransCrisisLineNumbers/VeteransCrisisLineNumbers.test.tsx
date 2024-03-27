import React from 'react'
import { Alert, Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import VeteransCrisisLineNumbers from './VeteransCrisisLineNumbers'

context('VeteransCrisisLineNumbers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    render(<VeteransCrisisLineNumbers />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('link', { name: 'Call 988 and select 1' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Text 838255' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Start a confidential chat' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'TTY: 800-799-4889' })).toBeTruthy()
  })

  describe('when the call number and press 1 link is clicked', () => {
    it('should launch external link with the parameter tel:988', () => {
      fireEvent.press(screen.getByRole('link', { name: 'Call 988 and select 1' }))
      expect(Linking.openURL).toBeCalledWith('tel:988')
    })
  })

  describe('when the text 838255 link is clicked', () => {
    it('should launch external link with the parameter sms:838255', () => {
      fireEvent.press(screen.getByRole('link', { name: 'Text 838255' }))
      expect(Linking.openURL).toBeCalledWith('sms:838255')
    })
  })

  describe('when the start confidential chat link is clicked', () => {
    it('should show alert', () => {
      fireEvent.press(screen.getByRole('link', { name: 'Start a confidential chat' }))
      expect(Alert.alert).toBeCalled()
    })
  })
  describe('when the 800-799-4889 link is clicked', () => {
    it('should launch external link with the parameter tel:8007994889', () => {
      fireEvent.press(screen.getByRole('link', { name: 'TTY: 800-799-4889' }))
      expect(Linking.openURL).toBeCalledWith('tel:8007994889')
    })
  })
})
