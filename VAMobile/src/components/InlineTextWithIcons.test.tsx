import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import { context, render, RenderAPI } from 'testUtils'
import VAIcon, { VAIconProps } from './VAIcon'
import InlineTextWithIcons from './InlineTextWithIcons'
import { Box, InlineTextWithIconsProps } from 'components'
import TextView from './TextView'

context('InlineTextWithIcons', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let onPressSpy: Mock

  beforeEach(() => {
    onPressSpy = jest.fn(() => {})
    const testLine1 = {
      leftTextProps: {
        text: 'Test Email',
        variant: 'MobileBodyBold',
        textAlign: 'left',
      },
      leftIconProps: { name: 'Unread', width: 16, height: 16, isOwnLine: true } as VAIconProps,
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
      leftIconProps: { name: 'PaperClip', fill: 'spinner', width: 16, height: 16 } as VAIconProps,
      rightIconProps: { name: 'ChevronRight', width: 16, height: 16, fill: 'spinner' } as VAIconProps,
    } as InlineTextWithIconsProps

    component = render(
      <Box>
        <InlineTextWithIcons {...testLine1} />
        <InlineTextWithIcons {...testLine2} />
      </Box>,
    )

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  it('should render correct VAIcons and not show icon for component with undefined iconProps', async () => {
    expect(testInstance.findAllByType(VAIcon)[0].props.name).toEqual('Unread')
    expect(testInstance.findAllByType(VAIcon)[1].props.name).toEqual('PaperClip')
    expect(testInstance.findAllByType(VAIcon)[2].props.name).toEqual('ChevronRight')
    expect(testInstance.findAllByType(VAIcon).length).toEqual(3)
  })
})
