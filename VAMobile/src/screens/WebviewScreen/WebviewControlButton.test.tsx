import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import WebviewControlButton from 'screens/WebviewScreen/WebviewControlButton'
import { context, render } from 'testUtils'

import Mock = jest.Mock

context('WebviewControlButton', () => {
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})

    render(<WebviewControlButton onPress={onPressSpy} icon={'Refresh'} />)
  })

  it('initializes correctly', () => {
    expect(screen.getByRole('button')).toBeTruthy()
    fireEvent.press(screen.getByRole('button'))
    expect(onPressSpy).toBeCalled()
  })
})
