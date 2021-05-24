import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, renderWithProviders, mockStore } from 'testUtils'
import {downloadFileAttachment} from 'store/actions'
import {Pressable} from 'react-native'
import {ErrorsState, initialErrorsState, InitialState} from 'store/reducers'
import {CategoryTypeFields, SecureMessagingAttachment, SecureMessagingMessageAttributes} from 'store/api/types'
import CollapsibleMessage from "./CollapsibleMessage";
import Mock = jest.Mock
import {TextView} from "components";

jest.mock('/store/actions', () => {
    let actual = jest.requireActual('/store/actions')
    return {
        ...actual,
        downloadFileAttachment: jest.fn(() => {
            return{
                type: '',
                payload: ''
            }
        })
    }
})

context('CollapsibleMessage', () => {
    let component: any
    let testInstance: ReactTestInstance
    let props: any
    let store: any
    let onPressSpy: Mock

    let listOfAttachments: Array<SecureMessagingAttachment> = [
        {
            id: 1,
            filename: 'testAttachment',
            size: 1048576, // Converts to 1 MB
            link: 'key',
        },
    ]
    let messageAttributes: SecureMessagingMessageAttributes = {
        messageId: 1,
        category: CategoryTypeFields.education,
        subject: 'Test Message Subject',
        body: 'Test Message Body',
        attachment: true,
        attachments: listOfAttachments,
        sentDate: '2013-06-06T04:00:00.000+00:00',
        senderId:  11,
        senderName: 'John Smith',
        recipientId: 2,
        recipientName: 'Jane Smith',
    }
    let mockProps = {
        message: messageAttributes,
        isInitialMessage: true
    }

    const initializeTestInstance = (errorsState: ErrorsState = initialErrorsState) => {
        onPressSpy = jest.fn(() => {})

        store = mockStore({
            ...InitialState,
            errors: errorsState
        })

        act(() => {
            component = renderWithProviders(<CollapsibleMessage {...mockProps} />, store)
        })

        testInstance = component.root

    }

    beforeEach(() => {
        initializeTestInstance()
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    it('should render message  contents correctly', async () => {
        const texts = testInstance.findAllByType(TextView)
        expect(texts.length).toBe(5)
        expect(texts[0].props.children).toBe('John Smith')
        // cannot test date textView - date display is dependent on viewer's current time zone
        expect(texts[2].props.children).toBe('Test Message Body')
        expect(texts[3].props.children).toBe('Attachments')
    })

    it('should render AttachmentLink content correctly', async () => {
        const linkText = testInstance.findAllByType(Pressable)[1].findByType(TextView)
        expect(linkText.props.children).toBe('testAttachment (1 MB)')
    })

    describe('when an attachment link is clicked', () => {
        it('should call onPressAttachment(), which calls downloadFileAttachment() from store/actions', async () => {
            act(() => {
                testInstance.findAllByType(Pressable)[1].props.onPress()
            })
            expect(downloadFileAttachment).toBeCalledWith(listOfAttachments[0], 'attachment-1' )
        })
    })


})
