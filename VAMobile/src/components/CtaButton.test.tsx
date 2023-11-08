import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import CtaButton from './CtaButton'
import TextView from './TextView'

context('CtaButton', () => {
  const onPressSpy = jest.fn()

  beforeEach(() => {
    render(
      <CtaButton onPress={onPressSpy}>
        <TextView>Some text</TextView>
      </CtaButton>,
    )
  })

  it('renders a11yLabel', () => {
    expect(screen.getByLabelText('talk-to-the-veterans-crisis-line-now')).toBeTruthy()
  })

  it('calls onPress when clicked', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Some text' }))
    expect(onPressSpy).toBeCalled()
  })
})
