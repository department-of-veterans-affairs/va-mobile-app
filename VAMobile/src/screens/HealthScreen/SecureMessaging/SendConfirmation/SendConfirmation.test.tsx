import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, renderWithProviders} from 'testUtils'
import SendConfirmation from "./SendConfirmation";
import {Pressable} from "react-native";
import Mock = jest.Mock;

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
    let goBack: Mock

    beforeEach(() => {
        goBack = jest.fn()
        props = mockNavProps(undefined, { setOptions: jest.fn(), goBack }, { params: { header: '' } })

        act(() => {
            component = renderWithProviders(<SendConfirmation {...props}/>)
        })

        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    describe('on click of "Go Back to Editing" button', () => {
        it('should call goBack', async () => {
            testInstance.findAllByType(Pressable)[1].props.onPress()
            expect(goBack).toHaveBeenCalled()
        })
    })
})
