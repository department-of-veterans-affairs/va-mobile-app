import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import {context,  renderWithProviders} from 'testUtils'
import VAIcon, {VAIconProps} from "./VAIcon";
import TextLineWithIcon from "./TextLineWithIcon";
import { Box } from 'components'
import TextView from "./TextView";

context('TextLineWithIcon', () => {
    let component: any
    let testInstance: ReactTestInstance
    let onPressSpy: Mock

    beforeEach(() => {
        onPressSpy = jest.fn(() => {})
        const testLine1 = { text: 'line1', iconProps: {name: 'PaperClip', width: 16, height: 16} as VAIconProps}
        const testLine2 = { text: 'another line2', iconProps: {name: 'UnreadIcon', width: 16, height: 16, isOwnLine: true} as VAIconProps}
        const testLine3 = { text: 'line3 no iconProps' }

        act(() => {
            component = renderWithProviders(
                <Box>
                    <TextLineWithIcon {...testLine1} />
                    <TextLineWithIcon {...testLine2} />
                    <TextLineWithIcon {...testLine3} />
                </Box>
        )
        })

        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    it('should render correct VAIcons and not show icon for component with undefined iconProps', async () => {
        expect(testInstance.findAllByType(VAIcon)[0].props.name).toEqual('PaperClip')
        expect(testInstance.findAllByType(VAIcon)[1].props.name).toEqual('UnreadIcon')
        expect(testInstance.findAllByType(VAIcon).length).toEqual(2)
    })

    it("should render text correctly and not render text for component where icon specified to be in own line", async () => {
        expect(testInstance.findAllByType(TextView)[0].props.children).toBe('line1')
        expect(testInstance.findAllByType(TextView)[1].props.children).toBe('line3 no iconProps')
        expect(testInstance.findAllByType(VAIcon).length).toEqual(2)

    })



})
