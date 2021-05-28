import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, renderWithProviders} from 'testUtils'
import ConfirmationAlert from "./ConfirmationAlert";
import {Pressable} from "react-native";
import TextView from "./TextView";

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

context('ConfirmationAlert', () => {
    let component: any
    let testInstance: ReactTestInstance
    let props: any
    let goBack: any

    beforeEach(() => {
        goBack = jest.fn()

        props = mockNavProps({confirmLabel: 'button1', cancelLabel: 'button2', confirmOnPress: mockNavigationSpy, cancelOnPress: goBack})

        act(() => {
            component = renderWithProviders(<ConfirmationAlert {...props}/>)
        })

        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    it('should display correct button text', async () => {
        expect(testInstance.findAllByType(TextView)[0].props.children).toBe('button1')
        expect(testInstance.findAllByType(TextView)[1].props.children).toBe('button2')
    })

    describe('on click of first button', () => {
        it('should call route navigation', async () => {
            testInstance.findAllByType(Pressable)[0].props.onPress()
            expect(mockNavigationSpy).toHaveBeenCalled()
        })
    })

    describe('on click of second button', () => {
        it('should call goBack', async () => {
            testInstance.findAllByType(Pressable)[1].props.onPress()
            expect(goBack).toHaveBeenCalled()
        })
    })
})
