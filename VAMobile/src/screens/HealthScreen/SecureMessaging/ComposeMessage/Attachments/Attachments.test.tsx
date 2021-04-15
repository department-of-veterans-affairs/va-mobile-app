import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, renderWithProviders} from 'testUtils'
import Attachments from './Attachments'

context('Attachments', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any

  beforeEach(() => {
    props = mockNavProps(undefined, { setOptions: jest.fn() })

    act(() => {
      component = renderWithProviders(<Attachments {...props}/>)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

})
