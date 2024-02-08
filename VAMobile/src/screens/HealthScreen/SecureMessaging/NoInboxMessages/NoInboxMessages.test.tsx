import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import NoInboxMessages from './NoInboxMessages'

context('NoInboxMessages', () => {
  it('initializes correctly', () => {
    render(<NoInboxMessages />)
    expect(screen.getByText("You don't have any messages in your inbox")).toBeTruthy()
    expect(
      screen.getByText('Waiting for a reply from your care team? It may take up to 3 business days to get a reply.'),
    ).toBeTruthy()
  })
})
