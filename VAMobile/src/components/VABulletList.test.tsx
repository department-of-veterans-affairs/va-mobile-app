import React from 'react'

import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import VABulletList from './VABulletList'

context('VABulletList', () => {
  beforeEach(() => {
    render(<VABulletList listOfText={['first item', 'second item']} />)
  })

  it('shows list of items', () => {
    expect(screen.getByText('first item')).toBeTruthy()
    expect(screen.getByText('second item')).toBeTruthy()
  })
})
