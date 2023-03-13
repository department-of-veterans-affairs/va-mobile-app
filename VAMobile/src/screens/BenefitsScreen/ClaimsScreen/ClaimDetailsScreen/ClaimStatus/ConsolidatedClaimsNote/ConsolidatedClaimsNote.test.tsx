import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, render, mockNavProps } from 'testUtils'
import { act } from 'react-test-renderer'

import ConsolidatedClaimsNote from './ConsolidatedClaimsNote'

context('ConsolidatedClaimsNote', () => {
  let component: any

  beforeEach(() => {
    const props = mockNavProps(undefined, { setOptions: jest.fn() })

    component = render(<ConsolidatedClaimsNote {...props} />)
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })
})
