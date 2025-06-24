import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import AttachmentLink from 'components/AttachmentLink'
import { context, render } from 'testUtils'

context('AttachmentLink', () => {
  const onPressSpy = jest.fn()

  beforeEach(() => {
    render(<AttachmentLink name={'Test.png'} formattedSize={'(234 KB)'} onPress={onPressSpy} />)
  })

  it('renders text', () => {
    expect(screen.getByRole('link', { name: 'Test.png (234 KB)' })).toBeTruthy()
  })

  it('renders a11yLabel', () => {
    expect(screen.getByLabelText('Test.png')).toBeTruthy()
  })

  it('calls onPress when clicked', () => {
    fireEvent.press(screen.getByRole('link', { name: 'Test.png (234 KB)' }))
    expect(onPressSpy).toBeCalled()
  })
})
