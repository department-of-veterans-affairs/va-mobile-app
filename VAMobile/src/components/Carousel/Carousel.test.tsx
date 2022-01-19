import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import Carousel from './Carousel'
import { TextView } from '../index'

context('Carousel', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let t = jest.fn(() => {})

  const TestComponent = () => {
    return <TextView>Test Component</TextView>
  }

  beforeEach(() => {
    component = render(<Carousel screenList={[{ name: 'TestComponent', component: TestComponent }]} onCarouselEnd={() => {}} translation={t} />)

    testInstance = component.container
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
