import React from 'react'

import { DowntimeError } from 'components'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { context, render, screen } from 'testUtils'

context('DowntimeError', () => {
  beforeEach(() => {
    render(<DowntimeError screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('heading', { name: 'Maintenance on mobile app' })).toBeTruthy()
  })
})
