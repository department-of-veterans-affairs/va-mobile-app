import {Linking} from 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import {act, ReactTestInstance} from 'react-test-renderer'

import {context, findByTestID, renderWithProviders} from 'testUtils'
import ClickForActionLink, {LinkUrlIconType, LinkTypeOptionsConstants} from './ClickForActionLink'
import VAIcon from './VAIcon'

context('ClickForActionLink', () => {
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (displayedText: string, numberOrUrlLink: string, linkType: keyof typeof LinkTypeOptionsConstants, linkIconType?: LinkUrlIconType): void => {
    act(() => {
      component = renderWithProviders(<ClickForActionLink displayedText={displayedText} numberOrUrlLink={numberOrUrlLink} linkType={linkType} linkUrlIconType={linkIconType} />)
    })

    testInstance = component.root
  }

  beforeEach(() => {
   initializeTestInstance('111-453-3234', '1114533234', LinkTypeOptionsConstants.call)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when linkType is call', () => {
    it('should call Linking.openURL with the parameter tel:number', async () => {
      findByTestID(testInstance, '111-453-3234').props.onPress()
      expect(Linking.openURL).toBeCalledWith('tel:1114533234')
    })

    it('should render the VAIcon with name Phone', async () => {
      expect(testInstance.findByType(VAIcon).props.name).toEqual('Phone')
    })
  })

  describe('when linkType is text', () => {
    beforeEach(() => {
      initializeTestInstance('111-453-3234', '1114533234', LinkTypeOptionsConstants.text)
    })
    it('should call Linking.openURL with the parameter sms:number', async () => {
      findByTestID(testInstance, '111-453-3234').props.onPress()
      expect(Linking.openURL).toBeCalledWith('sms:1114533234')
    })

    it('should render the VAIcon with name Text', async () => {
      expect(testInstance.findByType(VAIcon).props.name).toEqual('Text')
    })
  })

  describe('when linkType is url', () => {
    beforeEach(() => {
      initializeTestInstance('click me to go to google', 'https://google.com', LinkTypeOptionsConstants.url)
    })
    it('should call Linking.openURL with the parameter given to urlLink, https://google.com', async () => {
      findByTestID(testInstance, 'click-me-to-go-to-google').props.onPress()
      expect(Linking.openURL).toBeCalledWith('https://google.com')
    })

    describe('when there is no linkIconType or it is set to Chat', () => {
      it('should render the VAIcon with name Chat', async () => {
        expect(testInstance.findByType(VAIcon).props.name).toEqual('Chat')

        initializeTestInstance('click me to go to google', 'https://google.com', LinkTypeOptionsConstants.url, LinkUrlIconType.Chat)
        expect(testInstance.findByType(VAIcon).props.name).toEqual('Chat')
      })
    })

    describe('when linkIconType is set to Arrow', () => {
      it('should render the VAIcon with name RightArrowInCircle', async () => {
        initializeTestInstance('click me to go to google', 'https://google.com', LinkTypeOptionsConstants.url, LinkUrlIconType.Arrow)
        expect(testInstance.findByType(VAIcon).props.name).toEqual('RightArrowInCircle')
      })
    })
  })
})
