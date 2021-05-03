import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'

import {initialAuthState} from 'store/reducers'
import AttachmentsFAQ from "./AttachmentsFAQ";
import {Linking, TouchableWithoutFeedback} from "react-native";

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

jest.mock('@react-navigation/native', () => {
    const original = jest.requireActual('@react-navigation/native')
    return {
        ...original,
        useFocusEffect: () => jest.fn(),
    };
})

context('AttachmentsFAQ', () => {
    let store: any
    let component: any
    let testInstance: ReactTestInstance

    beforeEach(() => {
        const props = mockNavProps({}, { setOptions: jest.fn(), navigate: jest.fn()}, {params:{originHeader: 'TestHeader'}})

        store = mockStore({
            auth: {...initialAuthState},
        })

        act(() => {
            component = renderWithProviders(<AttachmentsFAQ {...props} />, store)
        })

        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    describe('when the My HealtheVet phone number link is clicked', () => {
        it('should call Linking open url with the parameter tel:8773270022', async () => {
            testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
            expect(Linking.openURL).toBeCalledWith('tel:8773270022')
        })
    })
    describe('when the call TTY phone link is clicked', () => {
        it('should call Linking open url with the parameter tel:711', async () => {
            testInstance.findAllByType(TouchableWithoutFeedback)[1].props.onPress()
            expect(Linking.openURL).toBeCalledWith( 'tel:711')
        })
    })
})
