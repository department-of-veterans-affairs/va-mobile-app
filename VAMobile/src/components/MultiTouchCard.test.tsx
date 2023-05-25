import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'
import Mock = jest.Mock

import { context, render, RenderAPI, waitFor } from 'testUtils'
import { TextLine } from './types'
import MultiTouchCard, { MultiTouchCardProps } from './MultiTouchCard'
import { TextLines } from './TextLines'

context('MultiTouchCard', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    const middleTextLines: Array<TextLine> = [
      {
        text: 'line 1',
        variant: 'MobileBodyBold',
      },
      {
        text: 'line 1',
        variant: 'MobileBodyBold',
      },
      {
        text: 'line 1',
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
    }

    component = render(<MultiTouchCard {...props} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
