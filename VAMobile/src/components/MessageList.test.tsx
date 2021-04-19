import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import {context, findByTestID, renderWithProviders} from 'testUtils'
import MessageList from "./MessageList";
import VAIcon, {VAIconProps} from "./VAIcon";

context('MessageList', () => {
    let component: any
    let testInstance: ReactTestInstance
    let onPressSpy: Mock

    beforeEach(() => {
        onPressSpy = jest.fn(() => {})
        const items = [{ textLinesWithIcon: [{ text: 'line 1 on the first button'}, { text: 'line 2 on the first button'}], testId: 'item-with-read', a11yHintText: 'hinttext' },
            { textLinesWithIcon: [{ text: 'another line', iconProps: {name: 'PaperClip', width: 16, height: 16} as VAIconProps}, {text: 'line 2', iconProps: {name: 'UnreadIcon', width: 16, height: 16} as VAIconProps}], testId: "unread-item-with-attachment", a11yHintText: 'hint2', onPress: onPressSpy}]

        act(() => {
            component = renderWithProviders(<MessageList items={items} />)
        })

        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    it('should call onPress when one of the buttons has been clicked', async () => {
        expect(findByTestID(testInstance, 'unread-item-with-attachment').props.onPress())
        expect(onPressSpy).toBeCalled()
    })

    it('should render the VAIcon components for unread item with attachment', async () => {
        expect(testInstance.findAllByType(VAIcon)[0].props.name).toEqual('PaperClip')
        expect(testInstance.findAllByType(VAIcon)[1].props.name).toEqual('UnreadIcon')
    })

})
