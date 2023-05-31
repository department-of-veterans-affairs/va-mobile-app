import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, render, RenderAPI, waitFor } from 'testUtils'
import LoadingComponent from './LoadingComponent'
import LottieView from 'lottie-react-native'
import { TextView } from 'components'

context('LoadingComponent', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<LoadingComponent text={'This is a loading component'} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(LottieView).length > 0)
    expect(testInstance.findAllByType(TextView).length > 0)
  })
})
