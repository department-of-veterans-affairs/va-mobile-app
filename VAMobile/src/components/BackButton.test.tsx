import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, { act, ReactTestInstance } from 'react-test-renderer'
import { TouchableWithoutFeedback } from 'react-native'
import 'jest-styled-components'
import Mock = jest.Mock;

import BackButton from './BackButton'
import { context, TestProviders } from 'testUtils'

context('BackButton', () => {
    let component: any
    let testInstance: ReactTestInstance
    let onPressSpy: Mock
    let translationSpy: Mock

    beforeEach(() => {
        onPressSpy = jest.fn(() => {})
        translationSpy = jest.fn(() => {})

        act(() => {
            component = renderer.create(
                <TestProviders>
                    <BackButton onPress={onPressSpy} canGoBack={true} translation={translationSpy}/>
                </TestProviders>)
        })

        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    describe('when canGoBack is false', () => {
        it('should return null', async () => {
            act(() => {
                component = renderer.create(
                    <TestProviders>
                        <BackButton onPress={onPressSpy} canGoBack={false} translation={translationSpy}/>
                    </TestProviders>)
            })

            testInstance = component.root
            expect(component.toJSON()).toBeFalsy()
        })
    })

    describe('when the onPress is clicked', () => {
       it('should call the onPress function', async () => {
           testInstance.findByType(TouchableWithoutFeedback).props.onPress()
           expect(onPressSpy).toBeCalled()
       })
    });
})
