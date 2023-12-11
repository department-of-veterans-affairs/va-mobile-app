import React from 'react'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { context, render, screen } from 'testUtils'
import DowntimeError from './DowntimeError'

context('DowntimeError', () => {

  beforeEach(() => {
    render(<DowntimeError screenID={ScreenIDTypesConstants.APPOINTMENTS_SCREEN_ID} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('header', { name: "Some online tools or services aren’t working right now" })).toBeTruthy()
  })
})
