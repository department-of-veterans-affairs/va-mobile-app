import 'react-native'
import React from 'react'

import { context, render } from 'testUtils'
import { screen, fireEvent } from '@testing-library/react-native'
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
  const initializeTestInstance = async (isAppeal?: boolean) => {
    render(<NeedHelpData isAppeal={isAppeal} />)
  }

  beforeEach(async () => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(screen.getByText('Need help?')).toBeTruthy()
    expect(screen.getByText('Call our VA benefits hotline. We’re here Monday through Friday, 8:00 a.m. to 9:00 p.m. ET.')).toBeTruthy()
    expect(screen.getByText('800-827-1000')).toBeTruthy()
    expect(screen.queryByText('To review more details about your appeal, visit VA.gov:')).toBeFalsy()
    expect(screen.queryByText('Visit VA.gov')).toBeFalsy()
    initializeTestInstance(true)
    expect(screen.getByText('To review more details about your appeal, visit VA.gov:')).toBeTruthy()
    expect(screen.getByText('Visit VA.gov')).toBeTruthy()
  })

  it('should launch external link on click of the number', async () => {
    fireEvent.press(screen.getByText('800-827-1000'))
    expect(mockExternalLinkSpy).toHaveBeenCalled()
  })

  describe('when isAppeal is true', () => {
    it('should launch external link on click of the url', async () => {
      initializeTestInstance(true)
      fireEvent.press(screen.getByText('Visit VA.gov'))
      expect(mockExternalLinkSpy).toHaveBeenCalled()
    })
  })
})
