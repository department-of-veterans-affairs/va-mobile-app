import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockNavProps, renderWithProviders } from 'testUtils'
import ContactVAScreen from './ContactVAScreen'
import { CrisisLineCta, ClickToCallPhoneNumber, TextArea } from 'components'

context('ContactVAScreen', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    const props = mockNavProps(
        {},
        {
          setOptions: () => {},
        }
    )

    act(() => {
      component = renderWithProviders(<ContactVAScreen {...props} />)
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()

    expect(testInstance.findByType(CrisisLineCta)).toBeTruthy()
    expect(testInstance.findByType(ClickToCallPhoneNumber)).toBeTruthy()

    const parent = testInstance.findByType(TextArea)
    const children = parent.props.children

    expect(children.length).toBe(3)
    expect(children[0].props.children).toBe('Call MyVA411')
    expect(children[1].props.children).toBe('MyVA411 is our main VA information line. We can help connect you to any of our VA contact centers.')
    expect(children[2].props.phone).toEqual('800-698-2411')
  })
})
