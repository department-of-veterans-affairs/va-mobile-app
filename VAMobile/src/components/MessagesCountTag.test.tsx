import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, renderWithProviders} from 'testUtils'
import MessagesCountTag from "./MessagesCountTag";
import TextView from './TextView'

context('MessagesCountTag', () => {
    let component: any
    let testInstance: ReactTestInstance

    beforeEach(() => {
        act(() => {
            component = renderWithProviders(<MessagesCountTag unread={2} />)
        })
        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    it('should render unread as 2', async () => {
        const texts = testInstance.findAllByType(TextView)
        expect(texts.length).toBe(1)
        expect(texts[0].props.children).toBe(2)
    })
})
