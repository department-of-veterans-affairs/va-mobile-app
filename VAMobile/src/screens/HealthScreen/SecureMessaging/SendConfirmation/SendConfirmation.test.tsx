import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, renderWithProviders} from 'testUtils'
import SendConfirmation from "./SendConfirmation";
import {TouchableWithoutFeedback} from "react-native";

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
    let original = jest.requireActual("utils/hooks")
    return {
        ...original,
        useRouteNavigation: () => { return () => mockNavigationSpy},
    }
})

context('SendConfirmation', () => {
    let component: any
    let testInstance: ReactTestInstance
    let props: any
    let goBack: jest.Mock

    beforeEach(() => {
        goBack = jest.fn()

        props = mockNavProps(undefined, { setOptions: jest.fn(), goBack }, { params: { originHeader: '' } })

        act(() => {
            component = renderWithProviders(<SendConfirmation {...props}/>)
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

    describe('on click of the "Go back to editing" button', () => {
        it('should call navigation goBack', async () => {
            testInstance.findByProps({ label: 'Go back to editing' }).props.onPress()
            expect(goBack).toHaveBeenCalled()
        })
    })
})
