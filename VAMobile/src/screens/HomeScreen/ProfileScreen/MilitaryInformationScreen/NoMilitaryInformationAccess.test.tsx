import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, render, RenderAPI } from 'testUtils'
import NoMilitaryInformationAccess from './NoMilitaryInformationAccess'
import { TextView } from 'components'

context('NoMilitaryInformationAccess', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  const initializeTestInstance = () => {
    component = render(<NoMilitaryInformationAccess />)
    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should render text fields correctly', async () => {
    const texts = testInstance.findAllByType(TextView)
    expect(texts[0].props.children).toBe("We can't access your military information")
    expect(texts[1].props.children).toBe(
      "We're sorry. We can't access your military service records. If you think you should be able to review your service information here, please file a request to change or correct your DD214 or other military records.",
    )
  })
})
