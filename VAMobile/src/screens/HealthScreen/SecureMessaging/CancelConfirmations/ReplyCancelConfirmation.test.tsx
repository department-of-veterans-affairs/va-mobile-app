import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, renderWithProviders} from 'testUtils'
import {TouchableWithoutFeedback} from "react-native"
import ReplyCancelConfirmation from "./ReplyCancelConfirmation";
import {resetSendMessageFailed} from "../../../../store";

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
        })
    }
})

context('ReplyCancelConfirmation', () => {
    let component: any
    let testInstance: ReactTestInstance
    let props: any
    let goBack: jest.Mock

    beforeEach(() => {
        goBack = jest.fn()

        props = mockNavProps(undefined, { setOptions: jest.fn(), goBack}, { params: { messageID: 0 } })

        act(() => {
            component = renderWithProviders(<ReplyCancelConfirmation {...props}/>)
        })

        testInstance = component.root
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

    describe('on click of the "Cancel and go to message" button', () => {
        it('should call useRouteNavigation and resetSendMessageFailed', async () => {
            testInstance.findByProps({ label: 'Cancel and go to message' }).props.onPress()
            expect(resetSendMessageFailed).toHaveBeenCalled()
            expect(mockNavigationSpy).toHaveBeenCalled()
        })
    })

    describe('on click of the "Go back to editing" button', () => {
        it('should call navigation goBack', async () => {
            testInstance.findByProps({ label: 'Go back to editing' }).props.onPress()
            expect(goBack).toHaveBeenCalled()
        })
    })
})