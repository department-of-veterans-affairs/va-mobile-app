import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'

import { context, findByTypeWithSubstring, render, RenderAPI } from 'testUtils'
import TextView from './TextView'
import AppVersionAndBuild from './AppVersionAndBuild'
import { ReactTestInstance } from 'react-test-renderer'

context('AppVersionAndBuild', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any

  beforeEach(() => {
    component = render(<AppVersionAndBuild {...props} />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should display the Version: text', async () => {
    expect(findByTypeWithSubstring(testInstance, TextView, 'Version:')).toBeTruthy()
  })
})
