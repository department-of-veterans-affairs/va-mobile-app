import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, mockStore, realStore, renderWithProviders} from 'testUtils'
import SendConfirmation from "./SendConfirmation";
import { TouchableWithoutFeedback } from "react-native";
import {
    initialAuthState,
    initialErrorsState,
    initialSecureMessagingState,
    resetSendMessageFailed,
} from "store";
import {AlertBox, LoadingComponent} from "components";
import {CategoryTypeFields} from "store/api/types";

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

jest.mock('store/actions', () => {
    let actual = jest.requireActual('store/actions')
    return {
        ...actual,
        resetSendMessageFailed: jest.fn(() => {
            return {
                type: '',
                payload: ''
            }
        }),
    }
})

context('SendConfirmation', () => {
    let component: any
    let testInstance: ReactTestInstance
    let props: any
    let goBack: jest.Mock
    let navigate: jest.Mock
    let store: any

    const initializeTestInstance = (loading = false, sendMessageComplete: boolean = false, sendMessageFailed: boolean = false, replyTriageError: boolean = false) => {
        store = mockStore({
            auth: {...initialAuthState},
            secureMessaging:{
                ...initialSecureMessagingState,
                sendingMessage: loading,
                sendMessageComplete: sendMessageComplete,
                sendMessageFailed: sendMessageFailed,
                replyTriageError: replyTriageError,
            },

            errors: initialErrorsState,
        })

        goBack = jest.fn()
        navigate = jest.fn()

        const messageData = {
            recipient_id: 1,
            category: CategoryTypeFields.general,
            subject: 'Subject',
            body: 'message text'
        }

        props = mockNavProps(undefined, { setOptions: jest.fn(), goBack, navigate }, { params: { originHeader: '', messageData  } })

        act(() => {
            component = renderWithProviders(<SendConfirmation {...props}/>, store)
        })

        testInstance = component.root
    }

    beforeEach(() =>{
        initializeTestInstance()
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    it('should not display error alert before send button is clicked', () => {
        testInstance.findByType(AlertBox) // Only the send confirmation alert box should display
    })

    it('should not have sendMessageFailed as true before send button is clicked', () => {
        const store = realStore()
        const { secureMessaging } = store.getState()
        expect(secureMessaging.sendMessageFailed).toEqual(false)
    })

    describe('on click of the crisis line banner', () => {
        it('should call useRouteNavigation', async () => {
            testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
            expect(mockNavigationSpy).toHaveBeenCalled()
        })
    })

    describe('on click of the "Go back to editing" button', () => {
        it('should call navigation goBack and reset sendMessageFailed attribute', async () => {
            testInstance.findByProps({ label: 'Go back to editing' }).props.onPress()
            expect(goBack).toHaveBeenCalled()
        })
    })

    describe('when loading is set to true', () => {
        it('should show loading screen', async () => {
            initializeTestInstance(true)
            expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
        })
    })

    describe('when message is sent', () => {
        it('should call useRouteNavigation', async () => {
            initializeTestInstance(false, true)
            expect(navigate).toHaveBeenCalled()
        })
    })

    describe('when message send fails', () => {
        it('should call navigation goBack', async () => {
            initializeTestInstance(false, false, true)
            expect(goBack).toHaveBeenCalled()
        })
    })

    describe('when message reply fails because of triage error', () => {
        it('should call useRouteNavigation', async () => {
            initializeTestInstance(false, false, true, true)
            expect(navigate).toHaveBeenCalled()
        })
    })
})
