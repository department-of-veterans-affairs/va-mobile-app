import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, renderWithProviders } from 'testUtils'

import AppealTimeline from './AppealTimeline'

context('AppealTimeline', () => {
  let component: any
  let props: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    props = mockNavProps({
      events: [
        {
          data: '2015-04-24',
          type: 'claim_decision',
        },
        {
          data: '',
          type: 'hlr_request',
        },
        {
          data: '',
          type: 'claim_decision',
        },
      ]
    })

    act(() => {
      component = renderWithProviders(<AppealTimeline {...props} />)
    })

    testInstance = component.root
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })
})
