import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, {act, ReactTestInstance} from 'react-test-renderer'
import 'jest-styled-components'
import Mock = jest.Mock;

import WideButtonShortBorder from './WideButtonShortBorder'
import { context, findByTestID, TestProviders } from 'testUtils'

context('WideButtonShortBorder', () => {
    let component: any
    let testInstance: ReactTestInstance
    let onPressSpy: Mock

    beforeEach(() => {
        onPressSpy = jest.fn(() => {})

        act(() => {
            component = renderer.create(
                <TestProviders>
                    <WideButtonShortBorder title={'My Title'} a11yHint={'a11y'} onPress={onPressSpy}/>
                </TestProviders>)
        })

        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    it('should call onPress', async () => {
        findByTestID(testInstance, 'my-title-button').props.onPress()
        expect(onPressSpy).toBeCalled()
    })
})
