import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders } from 'testUtils'
import LoadingComponent from "./LoadingComponent";
import { ActivityIndicator } from "react-native";
import { TextView } from "components";

context('LoadingComponent', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {

    act(() => {
      component = renderWithProviders(
        <LoadingComponent text={'This is a loading component'} />
      )
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
    expect(testInstance.findAllByType(ActivityIndicator).length > 0)
    expect(testInstance.findAllByType(TextView).length > 0)
  })

})
