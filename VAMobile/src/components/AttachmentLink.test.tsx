import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'
import Mock = jest.Mock

import {context, renderWithProviders} from 'testUtils'
import { TextView } from './index'
import AttachmentLink from "./AttachmentLink";
import {SecureMessagingAttachment} from "../store/api";

context('AttachmentLink', () => {
    let component: any
    let testInstance: ReactTestInstance
    let onPressSpy: Mock
    let store: any
    let props: any

    let file: SecureMessagingAttachment = {
        id: 1,
        filename: 'Test.png',
        link: 'link'
    }

    beforeEach(() => {
        onPressSpy = jest.fn(() => {})
        act(() => {
            component = renderWithProviders(<AttachmentLink size={234} sizeUnit={'KB'} attachment={file}/>)
        })
        testInstance = component.root
    })


    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })


    it('should render text as "Test.png (234 KB)"', async () => {
        const texts = testInstance.findAllByType(TextView)
        expect(texts.length).toBe(1)
        expect(texts[0].props.children).toBe('Test.png (234 KB)')
    })
})