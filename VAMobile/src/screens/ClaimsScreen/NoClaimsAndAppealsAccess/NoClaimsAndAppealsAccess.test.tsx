import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.

import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders } from 'testUtils'
import NoClaimsAndAppealsAccess from './NoClaimsAndAppealsAccess'
import { ClickToCallPhoneNumber, TextView } from 'components'

context('NoClaimsAndAppealsAccess', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    act(() => {
      component = renderWithProviders(
        <NoClaimsAndAppealsAccess />
      )
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should render the title', async () => {
    expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('We can\'t find any claims information for you')
  })

  it('should render the body', async () => {
    expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('We\'re sorry. We can\'t find any claims for you in our records. If you think this is an error, call the VA benefits hotline.')
  })

  it('should render ClickToCallPhoneNumber component', async () => {
    expect(testInstance.findAllByType(ClickToCallPhoneNumber).length).toEqual(1)

  })
})
