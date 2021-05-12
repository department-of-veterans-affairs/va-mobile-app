import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import SendConfirmation from "./SendConfirmation";
import {TouchableWithoutFeedback} from "react-native";
import {
    initialAuthState,
    initialErrorsState,
    initialSecureMessagingState,
    updateSecureMessagingTab
} from "store";
import {LoadingComponent} from "components";
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
    }
})

context('SendConfirmation', () => {
    let component: any
    let testInstance: ReactTestInstance
    let props: any
    let goBack: jest.Mock
    let navigate: jest.Mock
    let store: any

    const initializeTestInstance = (loading = false, sendMessageComplete: boolean = false) => {
        store = mockStore({
            auth: {...initialAuthState},
            secureMessaging:{
                ...initialSecureMessagingState,
                sendingMessage: loading,
                sendMessageComplete: sendMessageComplete
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

    describe('on click of the crisis line banner', () => {
        it('should call useRouteNavigation', async () => {
            testInstance.findByType(TouchableWithoutFeedback).props.onPress()
            expect(mockNavigationSpy).toHaveBeenCalled()
        })
    })

    describe('on click of the "Go back to editing" button', () => {
        it('should call navigation goBack', async () => {
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
})
