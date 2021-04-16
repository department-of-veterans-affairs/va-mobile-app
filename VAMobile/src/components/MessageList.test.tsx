import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import {context, findByTestID, renderWithProviders} from 'testUtils'
import MessageList from "./MessageList";
import VAIcon from "./VAIcon";

context('MessageList', () => {
    let component: any
    let testInstance: ReactTestInstance
    let onPressSpy: Mock

    beforeEach(() => {
        onPressSpy = jest.fn(() => {})

        const items = [{ textLines: [{ text: 'line 1 on the first button' }, { text: 'line 2 on the first button' }], testId: 'item-with-read', a11yHintText: 'hinttext', readReceipt: 'READ', attachment: false },
            { textLines: [{ text: 'another line' }], testId: "unread-item-with-attachment", a11yHintText: 'hint2', onPress: onPressSpy , attachment: true,}]

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

   /* it('should render Unread VaIcon on unread list item', async () => {
        expect(findByTestID(testInstance,'unread-line-with-attachmentD').props.children.toBe(VAIcon)
        expect(testInstance.
    })*/
})
