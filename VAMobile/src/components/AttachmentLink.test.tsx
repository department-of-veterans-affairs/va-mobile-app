import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import {context, renderWithProviders} from 'testUtils'
import { TextView } from './index'
import AttachmentLink from "./AttachmentLink";
import {ActivityIndicator, Pressable} from "react-native";

context('AttachmentLink', () => {
    let component: any
    let testInstance: ReactTestInstance
    let onPressSpy: Mock

    const initializeTestInstance = () => {
        onPressSpy = jest.fn(() => {})
        act(() => {
            component = renderWithProviders(<AttachmentLink name={'Test.png'} formattedSize={'(234 KB)'} onPress={onPressSpy} load={true} />)
        })
        testInstance = component.root
    }

    beforeEach(() => {
        initializeTestInstance()
    })


    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    it('should call onPress', async () => {
        testInstance.findByType(Pressable).props.onPress()
        expect(onPressSpy).toBeCalled()
    })

    it('should render text as "Test.png (234 KB)"', async () => {
        const texts = testInstance.findAllByType(TextView)
        expect(texts.length).toBe(1)
        expect(texts[0].props.children).toBe('Test.png (234 KB)')
    })

    it('should render ActivityIndicator if load is true', async () => {
        const loader = testInstance.findAllByType(ActivityIndicator)
        expect(loader.length).toBe(1)
    })


})