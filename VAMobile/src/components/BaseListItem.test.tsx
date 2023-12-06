import React from 'react'
import Mock = jest.Mock
import { BackgroundVariant } from './Box'
import { context, render, screen, fireEvent } from 'testUtils'
import BaseListItem from './BaseListItem'
import { TextLines } from './TextLines'

context('BaseListItem', () => {
  let onPressSpy: Mock

  const initializeTestInstance = (backgroundColor?: BackgroundVariant, activeBackgroundColor?: BackgroundVariant): void => {
    onPressSpy = jest.fn(() => { })
    render(
      <BaseListItem a11yHint={'a11y'} onPress={onPressSpy} backgroundColor={backgroundColor} activeBackgroundColor={activeBackgroundColor}>
        <TextLines listOfText={[{ text: 'My Title' }]} />
      </BaseListItem>,
    )
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByText('My Title')).toBeTruthy()
  })

  it('should call onPress', () => {
    fireEvent.press(screen.getByText('My Title'))
    expect(onPressSpy).toBeCalled()
  })

})
