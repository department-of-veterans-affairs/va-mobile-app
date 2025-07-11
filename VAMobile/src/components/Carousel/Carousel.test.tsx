import React from 'react'

import { TFunction } from 'i18next'

import { Carousel, TextView } from 'components'
import { context, render, screen } from 'testUtils'

context('Carousel', () => {
  const t = jest.fn(() => {})

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
      },
    },
  ]

  beforeEach(() => {
    render(<Carousel screenList={screenList} onCarouselEnd={() => {}} translation={t as unknown as TFunction} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByText('Test Component')).toBeTruthy()
    expect(screen.getByAccessibilityHint('skip')).toBeTruthy()
    expect(screen.getByAccessibilityHint('done')).toBeTruthy()
  })
})
