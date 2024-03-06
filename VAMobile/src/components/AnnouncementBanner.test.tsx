import React from 'react'
import { Linking } from 'react-native'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import AnnouncementBanner from './AnnouncementBanner'

context('AnnouncementBanner', () => {
  beforeEach(() => {
    render(<AnnouncementBanner title={'Learn about PACT Act on VA.gov'} link={'www.va.gov'} />)
  })

  it('renders title', () => {
    expect(screen.getByRole('button', { name: 'Learn about PACT Act on VA.gov' })).toBeTruthy()
  })

  it('navigates to link when tapped', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Learn about PACT Act on VA.gov' }))
    expect(Linking.openURL).toBeCalledWith('https://www.va.gov')
  })
})
