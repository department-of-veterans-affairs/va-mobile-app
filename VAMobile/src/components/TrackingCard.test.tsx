import 'react-native'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'
import Mock = jest.Mock
import { Pressable } from 'react-native'

import { context, render, RenderAPI } from 'testUtils'
import TrackingCard from './TrackingCard'

context('TrackingCard', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  const initializeTestInstance = (title: string = 'Acetaminophen 25MG TAB', dateShipped: string = '01/01/2022') => {
    onPressSpy = jest.fn()
    component = render(<TrackingCard title={title} dateShipped={dateShipped} onPress={onPressSpy} />)
    testInstance = component.UNSAFE_root
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(component).toBeTruthy()
  })

  describe('when card is pressed', () => {
    it('should call onPress', async () => {
      initializeTestInstance()
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(onPressSpy).toBeCalled()
    })
  })
})
