import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import ReplyMessage from "./ReplyMessage";
import {CategoryTypeFields, SecureMessagingMessageMap, SecureMessagingThreads} from "store/api/types";
import {initialAuthState, initialErrorsState, initialSecureMessagingState} from "store";
import {AccordionCollapsible, LoadingComponent, TextView} from "components";
import {Pressable, TouchableWithoutFeedback} from "react-native";

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
    let original = jest.requireActual("utils/hooks")
    let theme = jest.requireActual("styles/themes/standardTheme").default
    return {
        ...original,
        useTheme: jest.fn(()=> {
            return {...theme}
        }),
        useRouteNavigation: () => { return () => mockNavigationSpy},
    }
})

// Contains message Ids grouped together by thread
const mockThreads: Array<Array<number>> = [
    [1,2,3], [45]
]

// Contains message attributes mapped to their ids
const mockMessagesById: SecureMessagingMessageMap = {
    1: {
        messageId: 1,
        category: CategoryTypeFields.other,
        subject: 'mock subject 1: The initial message sets the overall thread subject header',
        body: 'message 1 body text',
        attachment: false,
        sentDate: '1',
        senderId: 2,
        senderName: 'mock sender 1',
        recipientId: 3,
        recipientName: 'mock recipient name 1',
        readReceipt: 'mock read receipt 1'
    },
    2 : {
        messageId: 2,
        category: CategoryTypeFields.other,
        subject: '',
        body: 'test 2',
        attachment: false,
        sentDate: '2',
        senderId: 2,
        senderName: 'mock sender 2',
        recipientId: 3,
        recipientName: 'mock recipient name 2',
        readReceipt: 'mock read receipt 2'
    },
    3 : {
        messageId: 3,
        category: CategoryTypeFields.other,
        subject: '',
        body: 'Last accordion collapsible should be open, so the body text of this message should display',
        attachment: false,
        sentDate: '3',
        senderId: 2,
        senderName: 'mock sender 3',
        recipientId: 3,
        recipientName: 'mock recipient name 3',
        readReceipt: 'mock read receipt'
    },
    45: {
        messageId: 45,
        category: CategoryTypeFields.other,
        subject: 'This message should not display because it has different thread ID',
        body: 'test',
        attachment: false,
        sentDate: '1-1-21',
        senderId: 2,
        senderName: 'mock sender 45',
        recipientId: 3,
        recipientName: 'mock recipient name',
        readReceipt: 'mock read receipt'
    }
}

context('ReplyMessage', () => {
    let component: any
    let testInstance: ReactTestInstance
    let props: any
    let store: any
    let goBack: jest.Mock

    const initializeTestInstance = (mockMessagesById: SecureMessagingMessageMap, threadList: SecureMessagingThreads, loading: boolean = false) => {
        props = mockNavProps(undefined, { setOptions: jest.fn(), goBack }, { params: { messageID: 3, attachmentFileToAdd: {} }})

        goBack = jest.fn()

        store = mockStore({
            auth: {...initialAuthState},
            secureMessaging: {
                ...initialSecureMessagingState,
                loading: loading,
                messagesById: mockMessagesById,
                threads: threadList,
            },
            errors: initialErrorsState,

        })

        act(() => {
            component = renderWithProviders(<ReplyMessage {...props}/>, store )
        })

        testInstance = component.root
    }

    beforeEach(() => {
        initializeTestInstance(mockMessagesById, mockThreads)
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    describe('on click of the crisis line banner', () => {
        it('should call useRouteNavigation', async () => {
            testInstance.findByType(TouchableWithoutFeedback).props.onPress()
            expect(mockNavigationSpy).toHaveBeenCalled()
        })
    })

    it('renders only messages in the same thread as the message associated with messageID', async () =>{
        expect(testInstance.findAllByType(AccordionCollapsible).length).toBe(3)
    })

    it('should render the correct text content of thread, and all accordions except the last should be closed', async () => {
        expect(testInstance.findAllByType(TextView)[18].props.children).toBe('mock sender 1')
        expect(testInstance.findAllByType(TextView)[19].props.children).toBe('Invalid DateTime')
        expect(testInstance.findAllByType(TextView)[20].props.children).toBe('mock sender 2')
        expect(testInstance.findAllByType(TextView)[21].props.children).toBe('Invalid DateTime')
        expect(testInstance.findAllByType(TextView)[22].props.children).toBe('mock sender 3')
        expect(testInstance.findAllByType(TextView)[23].props.children).toBe('Invalid DateTime')
    })

    it("should render last accordion's body text since it should be expanded", async () => {
        expect(testInstance.findAllByType(TextView)[24].props.children).toBe('Last accordion collapsible should be open, so the body text of this message should display')
    })

    describe('when first message and last message is clicked', () => {
        it('should expand first accordion and close last accordion', async () => {
            testInstance.findAllByType(Pressable)[4].props.onPress()
            testInstance.findAllByType(Pressable)[6].props.onPress()
            expect(testInstance.findAllByType(TextView)[20].props.children).toBe('message 1 body text')
            // Used to display last message's contents, but now there is no textview after the date
            expect(testInstance.findAllByType(TextView)[23].props.children).toBe('mock sender 3')
            expect(testInstance.findAllByType(TextView)[24].props.children).toBe('Invalid DateTime')
            expect(testInstance.findAllByType(TextView).length).toBe(25)
        })
    })

    describe('when loading is set to true', () => {
        it('should show loading screen', async () => {
            initializeTestInstance({}, [], true)
            expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
        })
    })
})
