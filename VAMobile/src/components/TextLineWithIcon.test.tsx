import React from 'react'

import { screen } from '@testing-library/react-native'

import { Box } from 'components'
import { context, render } from 'testUtils'

import TextLineWithIcon from './TextLineWithIcon'
import { VAIconProps } from './VAIcon'

context('TextLineWithIcon', () => {
  beforeEach(() => {
    const testLine1 = {
      text: 'line1',
      iconProps: { name: 'Trash', width: 16, height: 16, testID: 'Trash' } as VAIconProps,
    }
    const testLine2 = {
      text: 'another line2',
      iconProps: { name: 'Unread', width: 16, height: 16, testID: 'Unread', isOwnLine: true } as VAIconProps,
    }
    const testLine3 = { text: 'line3 no iconProps' }

    render(
      <Box>
        <TextLineWithIcon {...testLine1} />
        <TextLineWithIcon {...testLine2} />
        <TextLineWithIcon {...testLine3} />
      </Box>,
    )
  })

  it('renders correct VAIcons', () => {
    expect(screen.getByTestId('Trash')).toBeTruthy()
    expect(screen.getByTestId('Unread')).toBeTruthy()
  })

  it('should render text correctly and not render text for component where icon specified to be in own line', () => {
    expect(screen.getByText('line1')).toBeTruthy()
    expect(screen.getByText('line3 no iconProps')).toBeTruthy()
    expect(screen.queryByText('another line2')).toBeFalsy()
  })
})
