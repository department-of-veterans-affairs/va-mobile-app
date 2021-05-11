import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import SendConfirmation from "./SendConfirmation";
import {Linking, TouchableWithoutFeedback} from "react-native";
import {
    initialAuthState,
    initialErrorsState,
    initialSecureMessagingState,
    resetSendMessageFailed,
    updateSecureMessagingTab
} from "store";
import {AlertBox, LoadingComponent} from "components";
import {formHeaders} from "constants/secureMessaging";
import {CategoryTypeFields} from "store/api/types";

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
    let original = jest.requireActual("utils/hooks")
    return {
        ...original,
        useRouteNavigation: () => { return () => mockNavigationSpy},
    }
})

jest.mock('store/actions', () => {
    let actual = jest.requireActual('store/actions')
    return {
        ...actual,
        updateSecureMessagingTab: jest.fn(() => {
            return {
                type: '',
                payload: ''
            }
        }),
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

    const initializeTestInstance = (loading = false, sendMessageComplete: boolean = false, sendMessageFailed: boolean = false) => {
        store = mockStore({
            auth: {...initialAuthState},
            secureMessaging:{
                ...initialSecureMessagingState,
                sendingMessage: loading,
                sendMessageComplete: sendMessageComplete,
                sendMessageFailed: sendMessageFailed
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

        props = mockNavProps(undefined, { setOptions: jest.fn(), goBack, navigate }, { params: { origin: formHeaders.compose, originHeader: '', messageData  } })

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

    describe('on click of the crisis line banner', () => {
        it('should call useRouteNavigation', async () => {
            testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
            expect(mockNavigationSpy).toHaveBeenCalled()
        })
    })

    describe('on click of the "Go back to editing" button', () => {
        it('should call navigation goBack and reset sendMessageFailed attribute', async () => {
            testInstance.findByProps({ label: 'Go back to editing' }).props.onPress()
            expect(resetSendMessageFailed).toHaveBeenCalled()
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
            expect(updateSecureMessagingTab).toHaveBeenCalled()
            expect(navigate).toHaveBeenCalled()
        })
    })

    describe('when message send fails', () => {
        beforeEach(() => {
            initializeTestInstance(false, false, true)
        })

        it('should display error alert', async () => {
            expect(testInstance.findAllByType(AlertBox).length).toBe(2)
        })
        describe('when the My HealtheVet phone number link is clicked', () => {
            it('should call Linking open url with the parameter tel:8773270022', async () => {
                testInstance.findAllByType(TouchableWithoutFeedback)[1].props.onPress()
                expect(Linking.openURL).toBeCalledWith('tel:8773270022')
            })
        })
        describe('when the call TTY phone link is clicked', () => {
            it('should call Linking open url with the parameter tel:711', async () => {
                testInstance.findAllByType(TouchableWithoutFeedback)[2].props.onPress()
                expect(Linking.openURL).toBeCalledWith( 'tel:711')
            })
        })
    })
})
