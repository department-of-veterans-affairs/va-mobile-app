import React from 'react'
import { screen } from '@testing-library/react-native'

import { context, render } from 'testUtils'
import { VAIconProps } from './VAIcon'
import InlineTextWithIcons from './InlineTextWithIcons'
import { Box, InlineTextWithIconsProps } from 'components'

context('InlineTextWithIcons', () => {
  beforeEach(() => {
    const testLine1 = {
      leftTextProps: {
        text: 'Test Email',
        variant: 'MobileBodyBold',
        textAlign: 'left',
      },
      leftIconProps: { name: 'Unread', width: 16, height: 16, isOwnLine: true, testID: 'Unread' } as VAIconProps,
      rightTextProps: {
        text: '9/10/2022',
        variant: 'MobileBody',
        textAlign: 'right',
        color: 'primary',
      },
    } as InlineTextWithIconsProps
    const testLine2 = {
      leftTextProps: {
        text: 'Test Subject',
        variant: 'MobileBodyBold',
        textAlign: 'left',
        color: 'primary',
      },
      leftIconProps: { name: 'PaperClip', fill: 'spinner', width: 16, height: 16, testID: 'PaperClip' } as VAIconProps,
      rightIconProps: { name: 'ChevronRight', width: 16, height: 16, fill: 'spinner', testID: 'ChevronRight' } as VAIconProps,
    } as InlineTextWithIconsProps

    render(
      <Box>
        <InlineTextWithIcons {...testLine1} />
        <InlineTextWithIcons {...testLine2} />
      </Box>,
    )
  })

  it('renders text', () => {
    expect(screen.getByText('Test Email')).toBeTruthy()
    expect(screen.getByText('9/10/2022')).toBeTruthy()
    expect(screen.getByText('Test Subject')).toBeTruthy()
  })

  it('renders icons', () => {
    expect(screen.getByTestId('Unread')).toBeTruthy()
    expect(screen.getByTestId('PaperClip')).toBeTruthy()
    expect(screen.getByTestId('ChevronRight')).toBeTruthy()
  })
})
