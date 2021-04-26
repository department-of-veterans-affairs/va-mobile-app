import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, mockNavProps, renderWithProviders} from 'testUtils'
import SendConfirmation from "./SendConfirmation";

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

    beforeEach(() => {
        props = mockNavProps(undefined, { goBack: jest.fn(), setOptions: jest.fn() }, { params: { header: '' } })

        act(() => {
            component = renderWithProviders(<SendConfirmation {...props}/>)
        })

        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })
})
