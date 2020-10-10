import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import renderer, {act, ReactTestInstance} from 'react-test-renderer'
import 'jest-styled-components'
import Mock = jest.Mock;

import ButtonList from './ButtonList'
import { context, findByTestID, TestProviders } from 'testUtils'

context('ButtonList', () => {
    let component: any
    let testInstance: ReactTestInstance
    let onPressSpy: Mock

    beforeEach(() => {
        onPressSpy = jest.fn(() => {})

        const items = [
            { textID: 'militaryInformation.title', a11yHintID: 'militaryInformation.a11yHint', onPress: onPressSpy },
        ]

        act(() => {
            component = renderer.create(
                <TestProviders>
                    <ButtonList items={items} translationNameSpace={'profile'}/>
                </TestProviders>)
        })

        testInstance = component.root
    })

    it('initializes correctly', async () => {
        expect(component).toBeTruthy()
    })

    it('should call onPress when one of the buttons has been clicked', async () => {
        findByTestID(testInstance, 'military-information').props.onPress()
        expect(onPressSpy).toBeCalled()
    })
})
