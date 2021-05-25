import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.

import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, renderWithProviders, mockStore } from 'testUtils'
import IndividualMessageErrorComponent from "./IndividualMessageErrorComponent";
import {Linking, TouchableWithoutFeedback} from "react-native";

context('ErrorComponent', () => {
    let store: any
    let component: any
    let testInstance: ReactTestInstance

    beforeEach(() => {
        store = mockStore({})

        act(() => {
            component = renderWithProviders(
                <IndividualMessageErrorComponent />,
                store
            )
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
