import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import MultiTouchCard, { MultiTouchCardProps } from './MultiTouchCard'
import { TextLines } from './TextLines'
import { TextLine } from './types'

context('MultiTouchCard', () => {
  const onPressSpy = jest.fn(() => {})

  beforeEach(() => {
    const middleTextLines: Array<TextLine> = [
      {
        text: 'main line 1',
        variant: 'MobileBodyBold',
      },
      {
        text: 'main line 2',
        variant: 'MobileBodyBold',
      },
      {
        text: 'main line 3',
        variant: 'MobileBodyBold',
      },
    ]
    const bottomText: Array<TextLine> = [
      { text: 'bottom line 1', variant: 'MobileBodyBold' },
      { text: 'bottom line 2', variant: 'MobileBodyBold' },
    ]
    const props: MultiTouchCardProps = {
      orderIdentifier: 'Prescription 1 of 1',
      mainContent: <TextLines listOfText={middleTextLines} />,
      bottomContent: <TextLines listOfText={bottomText} />,
      bottomA11yHint: 'Hint for bottom content',
      bottomOnPress: onPressSpy,
    }

    render(<MultiTouchCard {...props} />)
  })

  it('shows orderIdentifier', () => {
    expect(screen.getByText('Prescription 1 of 1')).toBeTruthy()
  })

  it('shows mainContent', () => {
    expect(screen.getByText('main line 1')).toBeTruthy()
    expect(screen.getByText('main line 2')).toBeTruthy()
    expect(screen.getByText('main line 3')).toBeTruthy()
  })

  it('shows bottomContent', () => {
    expect(screen.getByText('bottom line 1')).toBeTruthy()
    expect(screen.getByText('bottom line 2')).toBeTruthy()
  })

  it('renders a11yHint for bottomContent', () => {
    expect(screen.getByA11yHint('Hint for bottom content')).toBeTruthy()
  })

  it('calls onPress function on bottomContent click', () => {
    fireEvent.press(screen.getByRole('button', { name: 'bottom line 1' }))
    expect(onPressSpy).toBeCalled()
  })
})
