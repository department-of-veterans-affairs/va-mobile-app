import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, renderWithProviders} from 'testUtils'
import TextView from './TextView'
import MessagesSentReadTag from "./MessagesSentReadTag";

context('MessagesSentReadTag', () => {
    let component: any
    let testInstance: ReactTestInstance

    beforeEach(() => {
        act(() => {
            component = renderWithProviders(<MessagesSentReadTag text={'READ'} />)
        })
        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    it("should render text as 'READ'", async () => {
        const texts = testInstance.findAllByType(TextView)
        expect(texts.length).toBe(1)
        expect(texts[0].props.children).toBe('READ')
    })
})
