import React from 'react'
import { context, render, screen } from 'testUtils'
import Carousel from './Carousel'
import { TextView } from '../index'

context('Carousel', () => {
  let t = jest.fn(() => { })

  const TestComponent = () => {
    return <TextView>Test Component</TextView>
  }

  const screenList = [
    {
      name: 'TestComponent',
      component: TestComponent,
      a11yHints: {
        skipHint: 'skip',
        doneHint: 'done',
      }
    }
  ]

  beforeEach(() => {
    render(<Carousel screenList={screenList} onCarouselEnd={() => { }} translation={t} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText('Test Component')).toBeTruthy()
    expect(screen.getByAccessibilityHint('skip')).toBeTruthy()
    expect(screen.getByAccessibilityHint('done')).toBeTruthy()
  })
})
