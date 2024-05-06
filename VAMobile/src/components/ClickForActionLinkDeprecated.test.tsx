import React from 'react'

import { context, fireEvent, render, screen } from 'testUtils'

import ClickForActionLinkDeprecated, { LinkTypeOptionsConstants, LinkUrlIconType } from './ClickForActionLinkDeprecated'

import Mock = jest.Mock

const mockExternalLinkSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useExternalLink: () => mockExternalLinkSpy,
  }
})

context('ClickForActionLinkDeprecated', () => {
  let analyticFn: Mock

  const initializeTestInstance = (
    displayedText: string,
    numberOrUrlLink: string,
    linkType: keyof typeof LinkTypeOptionsConstants,
    linkIconType?: LinkUrlIconType,
  ): void => {
    analyticFn = jest.fn()

    render(
      <ClickForActionLinkDeprecated
        displayedText={displayedText}
        a11yLabel={displayedText}
        numberOrUrlLink={numberOrUrlLink}
        linkType={linkType}
        linkUrlIconType={linkIconType}
        fireAnalytic={analyticFn}
      />,
    )
  }

  beforeEach(() => {
    initializeTestInstance('111-453-3234', '1114533234', LinkTypeOptionsConstants.call)
  })

  describe('when linkType is call', () => {
    it('should launch external link with the parameter tel:number', () => {
      fireEvent.press(screen.getByRole('link', { name: '111-453-3234' }))
      expect(mockExternalLinkSpy).toBeCalledWith('tel:1114533234')
    })
  })

  describe('when linkType is text', () => {
    beforeEach(() => {
      initializeTestInstance('111-453-3234', '1114533234', LinkTypeOptionsConstants.text)
    })
    it('should call mockExternalLinkSpy with the parameter sms:number', () => {
      fireEvent.press(screen.getByRole('link', { name: '111-453-3234' }))
      expect(mockExternalLinkSpy).toBeCalledWith('sms:1114533234')
    })
  })

  describe('when linkType is url', () => {
    beforeEach(() => {
      initializeTestInstance('click me to go to google', 'https://google.com', LinkTypeOptionsConstants.url)
    })
    it('should call mockExternalLinkSpy with the parameter given to urlLink, https://google.com', () => {
      fireEvent.press(screen.getByRole('link', { name: 'click me to go to google' }))
      expect(mockExternalLinkSpy).toBeCalledWith('https://google.com')
    })
  })

  describe('analytic function', () => {
    it('should be fired on press', () => {
      initializeTestInstance('click me to go to google', 'https://google.com', LinkTypeOptionsConstants.url)
      fireEvent.press(screen.getByRole('link', { name: 'click me to go to google' }))
      expect(analyticFn).toBeCalled()
    })
  })
})
