import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { context, mockNavProps, render, waitFor, RenderAPI } from 'testUtils'

import AppealTimeline from './AppealTimeline'

context('AppealTimeline', () => {
  let component: RenderAPI
  let props: any
  let testInstance: ReactTestInstance

  beforeEach(async () => {
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
      ],
    })

    component = render(<AppealTimeline {...props} />)

    testInstance = component.UNSAFE_root
  })

  it('should initialize', async () => {
    expect(component).toBeTruthy()
  })
})
