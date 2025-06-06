import React from 'react'

import BaseListItem from 'components/BaseListItem'
import { BackgroundVariant } from 'components/Box'
import { TextLines } from 'components/TextLines'
import { context, fireEvent, render, screen } from 'testUtils'

import Mock = jest.Mock

context('BaseListItem', () => {
  let onPressSpy: Mock

  const initializeTestInstance = (
    backgroundColor?: BackgroundVariant,
    activeBackgroundColor?: BackgroundVariant,
  ): void => {
    onPressSpy = jest.fn(() => {})
    render(
      <BaseListItem
        a11yHint={'a11y'}
        onPress={onPressSpy}
        backgroundColor={backgroundColor}
        activeBackgroundColor={activeBackgroundColor}>
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
