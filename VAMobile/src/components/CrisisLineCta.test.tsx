import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import CrisisLineCta from './CrisisLineCta'

context('CrisisLineCta', () => {
  const onPressSpy = jest.fn()

  beforeEach(() => {
    render(<CrisisLineCta onPress={onPressSpy} />)
  })

  it('calls onPress function on click', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Talk to the Veterans Crisis Line now' }))
    expect(onPressSpy).toBeCalled()
  })
})
