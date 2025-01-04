import React from 'react'

import { IconProps } from '@department-of-veterans-affairs/mobile-component-library'
import { screen } from '@testing-library/react-native'

import { Box, InlineTextWithIconsProps } from 'components'
import { context, render } from 'testUtils'

import InlineTextWithIcons from './InlineTextWithIcons'

context('InlineTextWithIcons', () => {
  beforeEach(() => {
    const testLine1 = {
      leftTextProps: {
        text: 'Test Email',
        variant: 'MobileBodyBold',
        textAlign: 'left',
      },
      // Need to put updated Unread icon here
      leftIconProps: {
        name: 'RemoveCircle',
        width: 16,
        height: 16,
        isOwnLine: true,
        testID: 'RemoveCircle',
      } as IconProps,
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
      leftIconProps: { name: 'AttachFile', width: 16, height: 16, testID: 'AttachFile' } as IconProps,
      rightIconProps: {
        name: 'Chat',
        width: 16,
        height: 16,
        fill: 'spinner',
        testID: 'Chat',
      } as IconProps,
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
    // TODO: Need to find Unread equivalent using RemoveCircle as placeholder for now
    expect(screen.getByTestId('RemoveCircle')).toBeTruthy()
    expect(screen.getByTestId('AttachFile')).toBeTruthy()
    expect(screen.getByTestId('Chat')).toBeTruthy()
  })
})
