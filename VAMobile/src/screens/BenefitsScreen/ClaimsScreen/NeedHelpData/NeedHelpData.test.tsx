import React from 'react'
import { screen, fireEvent } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import NeedHelpData from './NeedHelpData'

const mockExternalLinkSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('NeedHelpData', () => {
  const initializeTestInstance = (isAppeal?: boolean) => {
    render(<NeedHelpData isAppeal={isAppeal} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('Renders NeedHelpData', () => {
    expect(screen.getByText('Need help?')).toBeTruthy()
    expect(screen.getByText('Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.')).toBeTruthy()
    expect(screen.getByText('800-827-1000')).toBeTruthy()
    expect(screen.queryByText('To review more details about your appeal, visit VA.gov:')).toBeFalsy()
    expect(screen.queryByText('Visit VA.gov')).toBeFalsy()
    initializeTestInstance(true)
    expect(screen.getByText('To review more details about your appeal, visit VA.gov:')).toBeTruthy()
    expect(screen.getByText('Visit VA.gov')).toBeTruthy()
  })

  it('should launch external link on click of the number', () => {
    fireEvent.press(screen.getByRole('link', { name: '800-827-1000' }))
    expect(mockExternalLinkSpy).toHaveBeenCalled()
  })

  describe('when isAppeal is true', () => {
    it('should launch external link on click of the url', () => {
      initializeTestInstance(true)
      fireEvent.press(screen.getByRole('link', { name: 'Visit VA.gov' }))
      expect(mockExternalLinkSpy).toHaveBeenCalled()
    })
  })
})
