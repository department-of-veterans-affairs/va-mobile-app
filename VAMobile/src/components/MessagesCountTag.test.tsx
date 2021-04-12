import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import renderer, { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import {TestProviders, context, findByTestID, renderWithProviders} from 'testUtils'
import MessagesCountTag from "./MessagesCountTag";
import TextView from './TextView'

context('MessagesCountTag', () => {
    let component: any
    let testInstance: ReactTestInstance
    let onPressSpy: Mock

    beforeEach(() => {
        onPressSpy = jest.fn(() => {})
        act(() => {
            component = renderWithProviders(<MessagesCountTag unread={1} />)
        })
        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    it('should render text as "text"', async () => {
        const texts = testInstance.findAllByType(TextView)
        expect(texts.length).toBe(1)
        expect(texts[0].props.children).toBe(1)
    })
})
