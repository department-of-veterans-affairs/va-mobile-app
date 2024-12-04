import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'

import LinkRow from './LinkRow'

context('LinkRow', () => {
  const onPressSpy = jest.fn()

  beforeEach(() => {
    render(<LinkRow title={'Find a VA location'} titleA11yLabel={'Find a V-A location'} onPress={onPressSpy} />)
  })

  it('renders title', () => {
    expect(screen.getByRole('link', { name: 'Find a VA location' })).toBeTruthy()
    expect(screen.getByLabelText('Find a V-A location')).toBeTruthy()
  })

  it('calls onPress when tapped', () => {
    fireEvent.press(screen.getByRole('link', { name: 'Find a VA location' }))
    expect(onPressSpy).toHaveBeenCalled()
  })
})
