import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import {
    CategoryTypeFields,
    ScreenIDTypes,
    ScreenIDTypesConstants,
    SecureMessagingMessageMap,
    SecureMessagingThreads
} from 'store/api/types'
import {initialAuthState, initialErrorsState, initialSecureMessagingState} from "store";
import {AccordionCollapsible, AlertBox, ErrorComponent, LoadingComponent, TextView} from 'components'
import ViewMessageScreen from "./ViewMessageScreen";
import Mock = jest.Mock;
import {Pressable} from "react-native";
import {getFormattedDateTimeYear} from "utils/formattingUtils";
import {CommonErrorTypes, CommonErrorTypesConstants} from "constants/errors";


let mockNavigationSpy = jest.fn()
jest.mock('/utils/hooks', () => {
    let original = jest.requireActual("/utils/hooks")
    let theme = jest.requireActual("/styles/themes/standardTheme").default
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

// Create a date that's always more than 45 days from now
const d = new Date()
const fortySixDaysAgo = d.setDate(d.getDate() - 46)
const fortySixDaysAgoISO = new Date(fortySixDaysAgo).toISOString()

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
        sentDate: new Date().toISOString(), // current date
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
        sentDate: fortySixDaysAgoISO, // message always older than 45 days
        senderId: 2,
        senderName: 'mock sender 45',
        recipientId: 3,
        recipientName: 'mock recipient name',
        readReceipt: 'mock read receipt'
    }
}

const individMsgErrorProps = {
    screenID: ScreenIDTypesConstants.SECURE_MESSAGING_VIEW_MESSAGE_SCREEN_ID,
    errorType: CommonErrorTypesConstants.APP_LEVEL_ERROR_INDIVIDUAL_MSG,
    tryAgain: () => Promise.resolve()
}

const regErrorProps = {
    tryAgain: () => Promise.resolve()
}

context('ViewMessageScreen', () => {
    let component: any
    let store: any
    let props: any
    let testInstance: ReactTestInstance
    let onPressSpy: Mock
    onPressSpy = jest.fn(() => {})

    const initializeTestInstance = (mockMessagesById: SecureMessagingMessageMap, threadList: SecureMessagingThreads, loading: boolean = false, errorProps?: {tryAgain: () => Promise<void>, screenID?: ScreenIDTypes, messageID?: number, errorType?: CommonErrorTypes}, messageID: number = 3, messageIDsOfError?: Array<number>) => {
        /** messageID is 3 because inbox/folder previews the last message from a thread, aka the message we clicked on to access the rest of thread
         * While the renderMessages function can identify the correct thread array from any one of the messageIDs in that particular thread, it also
         * uses messageID to determine which AccordionCollapsible component should be expanded by default.
         * So it's important when testing to set this messageID to the last message in the thread to match design specs for ViewMessage.tsx
         * */
        props = mockNavProps(undefined, undefined, { params: { messageID: messageID }})

        onPressSpy = jest.fn(() => {})

        store = mockStore({
            auth: {...initialAuthState},
            secureMessaging: {
                ...initialSecureMessagingState,
                loading: loading,
                messagesById: mockMessagesById,
                threads: threadList,
                messageIDsOfError: messageIDsOfError,
            },
            errors: errorProps || initialErrorsState,

        })

        act(() => {
            component = renderWithProviders(
                <ViewMessageScreen {...props} />, store
            )
        })

        testInstance = component.root
    }

    beforeEach(() => {
        initializeTestInstance(mockMessagesById, mockThreads)
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    it('renders only messages in the same thread as the message associated with messageID', async () =>{
        expect(testInstance.findAllByType(AccordionCollapsible).length).toBe(3)
    })

    it('should render the correct text content of thread, and all accordions except the last should be closed', async () => {
        expect(testInstance.findAllByType(TextView)[1].props.children).toBe('mock sender 1')
        // Have to use Invalid DateTime values otherwise will fail git tests if in different time zone
        expect(testInstance.findAllByType(TextView)[2].props.children).toBe('Invalid DateTime')
        expect(testInstance.findAllByType(TextView)[3].props.children).toBe('mock sender 2')
        expect(testInstance.findAllByType(TextView)[4].props.children).toBe('Invalid DateTime')
        expect(testInstance.findAllByType(TextView)[5].props.children).toBe('mock sender 3')
        expect(testInstance.findAllByType(TextView)[6].props.children).toBe(getFormattedDateTimeYear(new Date().toISOString()))
    })

    it("should render last accordion's body text since it should be expanded", async () => {
        expect(testInstance.findAllByType(TextView)[7].props.children).toBe('Last accordion collapsible should be open, so the body text of this message should display')
    })

    describe('when first message and last message is clicked', () => {
        it('should expand first accordion and close last accordion', async () => {
            testInstance.findAllByType(Pressable)[0].props.onPress()
            testInstance.findAllByType(Pressable)[2].props.onPress()
            expect(testInstance.findAllByType(TextView)[3].props.children).toBe('message 1 body text')
            // Used to display last message's contents, but now the textview after the date is the bottom Reply button's text
            expect(testInstance.findAllByType(TextView)[6].props.children).toBe('mock sender 3')
            expect(testInstance.findAllByType(TextView)[7].props.children).toBe(getFormattedDateTimeYear(new Date().toISOString()))
            // Reply footer displays properly if latest message in thread is not over 45 days old
            expect(testInstance.findAllByType(TextView)[8].props.children).toBe('Reply')
        })
    })

    describe('when loading is set to true', () => {
        it('should show loading screen', async () => {
            initializeTestInstance({}, [], true)
            expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
        })
    })

    describe('when individual messages fail to load', () => {
        describe('when an individual message returns an error and that message is clicked', () => {
            it('should show AlertBox with "Message could not be found" title', async () => {
                initializeTestInstance(mockMessagesById, mockThreads, false, individMsgErrorProps, 3, [1])
                testInstance.findAllByType(Pressable)[0].props.onPress()
                expect(testInstance.findByType(ErrorComponent)).toBeTruthy()
                expect(testInstance.findByProps({title: 'Message could not be found'})).toBeTruthy()
            })
        })
        describe('when multiple messages are expanded and fail to load', () => {
            it('should show multiple error components', async () => {
                initializeTestInstance(mockMessagesById, mockThreads, false, individMsgErrorProps, 3, [1, 3])
                testInstance.findAllByType(Pressable)[0].props.onPress()
                testInstance.findAllByType(Pressable)[2].props.onPress()
                expect(testInstance.findAllByType(ErrorComponent)).toBeTruthy()
                expect(testInstance.findAllByProps({title: 'Message could not be found'})).toBeTruthy()
            })
        })
    })

    describe('when message is older than 45 days', () => {
        // changing to a different message thread by changing to different messageID
        beforeEach(() => {
            initializeTestInstance(mockMessagesById, mockThreads, false, regErrorProps,  45 )
        })

        it('should show AlertBox with Compose button', async () => {
            expect(testInstance.findByType(AlertBox)).toBeTruthy()
           expect(testInstance.findByProps({label: 'Compose a new message'})).toBeTruthy()
        })

        it('should use route navigation when Compose button is clicked', async () => {
            testInstance.findByProps({label: 'Compose a new message'}).props.onPress()
            expect(mockNavigationSpy).toHaveBeenCalled()
        })
    })

})
