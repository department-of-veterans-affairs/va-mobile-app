import 'react-native'
import React from 'react'

import { screen } from '@testing-library/react-native'
import { context, mockNavProps, render } from 'testUtils'
import AppealTimeline from './AppealTimeline'

context('AppealTimeline', () => {
  beforeEach(async () => {
    const props = mockNavProps({
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

    render(<AppealTimeline {...props} />)
  })

  it('should initialize', async () => {
    expect(screen.getAllByLabelText('VA sent you a claim decision')).toBeTruthy()
    expect(screen.getByText('VA received your Higher-Level Review request')).toBeTruthy()
  })
})
