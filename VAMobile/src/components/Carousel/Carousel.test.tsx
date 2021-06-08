import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders } from 'testUtils'
import Carousel from './Carousel'
import {TextView} from '../index'

context('Carousel', () => {
  let component: any
  let testInstance: ReactTestInstance
  let t = jest.fn(() => {})

  const TestComponent = () => {
    return <TextView>Test Component</TextView>
  }

  beforeEach(() => {
    act(() => {
      component = renderWithProviders(<Carousel screenList={[ { name: 'TestComponent', component: TestComponent } ]} onCarouselEnd={() => {}} translation={t} />)
    })
    testInstance = component.root
  })

  it('initializes correctly2', async () => {
    expect(component).toBeTruthy()
  })
})
