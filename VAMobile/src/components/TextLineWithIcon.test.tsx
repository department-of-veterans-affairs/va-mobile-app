import React from 'react'

import { IconProps } from '@department-of-veterans-affairs/mobile-component-library'
import { screen } from '@testing-library/react-native'

import { Box } from 'components'
import { context, render } from 'testUtils'

import TextLineWithIcon from './TextLineWithIcon'

context('TextLineWithIcon', () => {
  beforeEach(() => {
    const testLine1 = {
      text: 'line1',
      iconProps: { name: 'Delete', width: 16, height: 16, testID: 'Delete' } as IconProps,
    }
    const testLine2 = {
      text: 'another line2',
      iconProps: { name: 'Close', width: 16, height: 16, testID: 'Close', isOwnLine: true } as IconProps,
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

  it('renders correct Icons', () => {
    expect(screen.getByTestId('Delete')).toBeTruthy()
    expect(screen.getByTestId('Close')).toBeTruthy()
  })

  it('should render text correctly and not render text for component where icon specified to be in own line', () => {
    expect(screen.getByText('line1')).toBeTruthy()
    expect(screen.getByText('line3 no iconProps')).toBeTruthy()
    expect(screen.queryByText('another line2')).toBeFalsy()
  })
})
