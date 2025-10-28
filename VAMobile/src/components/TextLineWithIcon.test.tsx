import React from 'react'

import { IconProps } from '@department-of-veterans-affairs/mobile-component-library'
import { screen } from '@testing-library/react-native'

import { Box, TextLineWithIcon } from 'components'
import Unread from 'components/VAIcon/svgs/Unread.svg'
import { context, render } from 'testUtils'

context('TextLineWithIcon', () => {
  beforeEach(() => {
    const testLine1 = {
      text: 'line1',
      iconProps: { name: 'Delete', width: 16, height: 16, testID: 'Delete' } as IconProps,
    }
    const testLine2 = {
      text: 'another line2',
      iconProps: { svg: Unread, width: 16, height: 16, testID: 'Unread', isOwnLine: true } as IconProps,
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
    expect(screen.getByTestId('Unread')).toBeTruthy()
  })

  it('should render text correctly and not render text for component where icon specified to be in own line', () => {
    expect(screen.getByText('line1')).toBeTruthy()
    expect(screen.getByText('line3 no iconProps')).toBeTruthy()
    expect(screen.queryByText('another line2')).toBeFalsy()
  })
})
