import React from 'react'

import LabelTag from 'components/LabelTag'
import { context, fireEvent, render, screen } from 'testUtils'

context('LabelTag', () => {
  const onPressSpy = jest.fn()

  beforeEach(() => {
    render(<LabelTag text={'Read'} labelType={'tagGreen'} onPress={onPressSpy} />)
  })

  it("should render text as 'Read'", () => {
    expect(screen.getByText('Read')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Read' })).toBeTruthy()
  })

  it('should call the press action if it exists', () => {
    fireEvent.press(screen.getByRole('button', { name: 'Read' }))
    expect(onPressSpy).toHaveBeenCalled()
  })
})
