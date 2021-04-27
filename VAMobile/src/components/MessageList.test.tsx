import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import {context, findByTestID, renderWithProviders} from 'testUtils'
import MessageList from "./MessageList";
import VAIcon, {VAIconProps} from "./VAIcon";
import MessagesSentReadTag from "./MessagesSentReadTag";

context('MessageList', () => {
    let component: any
    let testInstance: ReactTestInstance
    let onPressSpy: Mock

    beforeEach(() => {
        onPressSpy = jest.fn(() => {})
        const items = [
            { textLinesWithIcon:
                    [{ text: 'another line'},
                    {text: 'line 2'}],
                isSentFolder: false,
                testId: "inbox-item-no-attachment-read",
                a11yHintText: 'hint2',
                onPress: onPressSpy},
            { textLinesWithIcon:
                    [{ text: 'test2-sender', iconProps: {name: 'PaperClip', width: 16, height: 16} as VAIconProps},
                        {text: 'test2-subject-line', iconProps: {name: 'UnreadIcon', width: 16, height: 16} as VAIconProps}],
                isSentFolder: false,
                a11yHintText: 'hint2',
                onPress: onPressSpy},
            { textLinesWithIcon:
                    [{ text: 'test3-recipient'},
                        {text: 'test3-sent-item-with-read-tag'}],
                isSentFolder: true,
                readReceipt: 'READ',
                a11yHintText: 'hint2',
                onPress: onPressSpy}
                ]

        act(() => {
            component = renderWithProviders(<MessageList items={items} />)
        })

        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    it('should call onPress when one of the buttons has been clicked', async () => {
        findByTestID(testInstance, 'inbox-item-no-attachment-read').props.onPress()
        expect(onPressSpy).toBeCalled()
    })

    it('should generate correct testId with icon accessibility labels if no testId provided in props', async () => {
        findByTestID(testInstance, 'Has attachment test2-sender Unread: test2-subject-line').props.onPress()
        findByTestID(testInstance, 'test3-recipient test3-sent-item-with-read-tag Recipient has read your message').props.onPress()
    })

    it('should render READ tag for read sent message', async () => {
        expect(testInstance.findByType(MessagesSentReadTag).props.text).toEqual('READ')
    })

    it('should render the VAIcon components for unread item with attachment', async () => {
        expect(testInstance.findAllByType(VAIcon)[1].props.name).toEqual('PaperClip')
        expect(testInstance.findAllByType(VAIcon)[2].props.name).toEqual('UnreadIcon')
    })

})
