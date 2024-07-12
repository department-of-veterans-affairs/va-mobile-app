import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'

import AppealTimeline from './AppealTimeline'

context('AppealTimeline', () => {
  beforeEach(() => {
    const props = mockNavProps({
      events: [
        {
          date: '2015-04-24',
          type: 'claim_decision',
        },
        {
          date: '2016-03-23',
          type: 'hlr_request',
        },
        {
          date: '2016-09-02',
          type: 'reconsideration',
        },
      ],
    })

    render(<AppealTimeline {...props} />)
  })

  it('displays list of events with a11y labels', () => {
    expect(screen.getByLabelText('V-A  sent you a claim decision On April 24, 2015')).toBeTruthy()
    expect(screen.getByLabelText('V-A  received your Higher-Level Review request On March 23, 2016')).toBeTruthy()
    expect(screen.getByLabelText('Your Motion for Reconsideration was denied On September 02, 2016')).toBeTruthy()
  })
})
