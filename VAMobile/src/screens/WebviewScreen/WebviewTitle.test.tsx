import React from 'react'

import { screen } from '@testing-library/react-native'

import WebviewTitle from 'screens/WebviewScreen/WebviewTitle'
import { context, render } from 'testUtils'

context('WebviewTitle', () => {
  it('initializes correctly', () => {
    render(<WebviewTitle title={'my title'} />)
    expect(screen.getByText('my title')).toBeTruthy()
  })
})
