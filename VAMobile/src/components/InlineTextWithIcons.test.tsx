import React from 'react'

import { IconProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'
import { screen } from '@testing-library/react-native'

import { Box, InlineTextWithIconsProps } from 'components'
import { context, render } from 'testUtils'
import { useTheme } from 'utils/hooks'

import InlineTextWithIcons from './InlineTextWithIcons'
import { VA_ICON_MAP } from './VAIcon'

context('InlineTextWithIcons', () => {
  beforeEach(() => {
    const theme = useTheme()
    const testLine1 = {
      leftTextProps: {
        text: 'Test Email',
        variant: 'MobileBodyBold',
        textAlign: 'left',
      },
      leftIconProps: {
        svg: VA_ICON_MAP.Unread,
        width: 16,
        height: 16,
        fill: theme.colors.icon.unreadMessage,
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
      leftIconProps: {
        svg: VA_ICON_MAP.Unread,
        width: 16,
        height: 16,
        fill: theme.colors.icon.unreadMessage,
      } as IconProps,
      rightIconProps: { name: 'AttachFile', fill: theme.colors.icon.spinner } as IconProps,
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
    expect(screen.getByTestId('ChevronRight')).toBeTruthy()
  })
})
