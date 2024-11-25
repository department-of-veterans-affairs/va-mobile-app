import React from 'react'

import { screen } from '@testing-library/react-native'

import { Box, InlineTextWithIconsProps } from 'components'
import { context, render } from 'testUtils'

import InlineTextWithIcons from './InlineTextWithIcons'
import { VAIconProps } from './VAIcon'

context('InlineTextWithIcons', () => {
  beforeEach(() => {
    const testLine1 = {
      leftTextProps: {
        text: 'Test Email',
        variant: 'MobileBodyBold',
        textAlign: 'left',
      },
      leftIconProps: { name: 'Unread', width: 16, height: 16, isOwnLine: true, testID: 'Unread' } as VAIconProps,
    } as InlineTextWithIconsProps
    const testLine2 = {
      leftTextProps: {
        text: 'September 10, 2022',
        variant: 'MobileBody',
        textAlign: 'right',
        color: 'primary',
      },
    } as InlineTextWithIconsProps
    const testLine3 = {
      leftTextProps: {
        text: 'Test Subject',
        variant: 'MobileBodyBold',
        textAlign: 'left',
        color: 'primary',
      },
      leftIconProps: { name: 'PaperClip', fill: 'spinner', width: 16, height: 16, testID: 'PaperClip' } as VAIconProps,
      rightIconProps: {
        name: 'Chat',
        width: 16,
        height: 16,
        fill: 'spinner',
        testID: 'Chat',
      } as VAIconProps,
    } as InlineTextWithIconsProps

    render(
      <Box>
        <InlineTextWithIcons {...testLine1} />
        <InlineTextWithIcons {...testLine2} />
        <InlineTextWithIcons {...testLine3} />
      </Box>,
    )
  })

  it('renders text', () => {
    expect(screen.getByText('Test Email')).toBeTruthy()
    expect(screen.getByText('September 10, 2022')).toBeTruthy()
    expect(screen.getByText('Test Subject')).toBeTruthy()
  })

  it('renders icons', () => {
    expect(screen.getByTestId('Unread')).toBeTruthy()
    expect(screen.getByTestId('PaperClip')).toBeTruthy()
    expect(screen.getByTestId('Chat')).toBeTruthy()
  })
})
