import 'react-native'
import React from 'react'

import TrackingCard from './TrackingCard'
import { context, render, RenderAPI } from 'testUtils'
import Mock = jest.Mock;
import {  ReactTestInstance } from 'react-test-renderer'
import { Pressable } from 'react-native'

context('TrackingCard', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock


  const initializeTestInstance = (title: string = 'Acetaminophen 25MG TAB', dateShipped: string = '01/01/2022') => {
    onPressSpy = jest.fn()
    component = render(<TrackingCard title={title} dateShipped={dateShipped} onPress={onPressSpy}/>)

    return component.container
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(component).toBeTruthy()
  })

  describe('when card is pressed', () => {
    it('should call onPress', async () => {
      testInstance = initializeTestInstance()
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(onPressSpy).toBeCalled()
    })
  })
})
