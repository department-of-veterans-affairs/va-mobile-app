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
    return {
        ...original,
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

        props = mockNavProps({button1Label: 'button1', button2Label: 'button2', button1OnPress: mockNavigationSpy, button2OnPress: goBack})

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
